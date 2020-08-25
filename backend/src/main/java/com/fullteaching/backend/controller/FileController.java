package com.fullteaching.backend.controller;

import com.fullteaching.backend.annotation.LoginRequired;
import com.fullteaching.backend.annotation.RoleFilter;
import com.fullteaching.backend.file.FileOperationsService;
import com.fullteaching.backend.file.MimeTypes;
import com.fullteaching.backend.model.*;
import com.fullteaching.backend.notifications.NotificationDispatcher;
import com.fullteaching.backend.security.AuthorizationService;
import com.fullteaching.backend.security.user.UserComponent;
import com.fullteaching.backend.service.*;
import com.fullteaching.backend.struct.Role;
import lombok.extern.slf4j.Slf4j;
import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Iterator;
import java.util.UUID;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api-load-files")
@Slf4j
public class FileController extends SecureController {

    private final FileGroupService fileGroupService;
    private final FileService fileService;
    private final CourseService courseService;
    private final CommentService commentService;
    private final UserService userService;
    private final FileOperationsService fileOperationsService;
    private final CourseDetailsService courseDetailsService;
    private final EntryService entryService;
    private final NotificationDispatcher notificationDispatcher;

    @Value("${profile.stage}")
    private String profileStage;

    public static final Path FILES_FOLDER = Paths.get(System.getProperty("user.dir"), "/assets/files");
    public static final Path VIDEOS_FOLDER = Paths.get(System.getProperty("user.dir"), "/assets/videos");
    public static final Path PICTURES_FOLDER = Paths.get(System.getProperty("user.dir"), "/assets/pictures");
    public static final Path AUDIOS_FOLDER = Paths.get(System.getProperty("user.dir"), "/assets/audios");

    @Autowired
    public FileController(FileGroupService fileGroupService, FileService fileService, CourseService courseService, CommentService commentService, UserService userService, UserComponent user, AuthorizationService authorizationService, FileOperationsService fileOperationsService, CourseDetailsService courseDetailsService, EntryService entryService, NotificationDispatcher notificationDispatcher) {
        super(user, authorizationService);
        this.fileGroupService = fileGroupService;
        this.fileService = fileService;
        this.courseService = courseService;
        this.commentService = commentService;
        this.userService = userService;
        this.fileOperationsService = fileOperationsService;
        this.courseDetailsService = courseDetailsService;
        this.entryService = entryService;
        this.notificationDispatcher = notificationDispatcher;
    }

    @RoleFilter(role = Role.TEACHER)
    @RequestMapping(value = "/upload/course/{courseId}/file-group/{fileGroupId}/type/{file_type}", method = RequestMethod.POST)
    public ResponseEntity<Object> handleFileUpload(@PathVariable(value = "courseId") String courseId, @PathVariable(value = "fileGroupId") String fileGroupId, @RequestParam("file") MultipartFile file, @PathVariable("file_type") int fileType)
            throws IOException {

        log.info("Uploading file...");

        long id_course = -1;
        long id_fileGroup = -1;
        try {
            id_course = Long.parseLong(courseId);
            id_fileGroup = Long.parseLong(fileGroupId);
        } catch (NumberFormatException e) {
            log.error("Course ID '{}' or FileGroup ID '{}' are not of type Long", courseId, fileGroupId);
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Course c = courseService.getFromId(id_course);

        ResponseEntity<Object> teacherAuthorized = authorizationService.checkAuthorization(c, c.getTeacher());
        if (teacherAuthorized != null) { // If the user is not the teacher of the course
            return teacherAuthorized;
        } else {

            FileGroup fg = null;

            String name = file.getName();

            log.info("File name: '{}'", name);

            String fileName = file.getOriginalFilename();

            log.info("File full name: " + fileName);

            if (file.isEmpty()) {
                log.error("The file is empty");
                throw new RuntimeException("The file is empty");
            }

            if (!Files.exists(FILES_FOLDER)) {
                log.debug("Creating folder '{}'", FILES_FOLDER);
                Files.createDirectories(FILES_FOLDER);
            }

            com.fullteaching.backend.model.File customFile = new com.fullteaching.backend.model.File(fileType, fileName);
            File uploadedFile = new File(FILES_FOLDER.toFile(), customFile.getNameIdent());

            file.transferTo(uploadedFile);

            if (this.isProductionStage()) {
                // ONLY ON PRODUCTION
                try {
                    fileOperationsService.productionFileSaver(customFile.getNameIdent(), "files", uploadedFile);
                } catch (InterruptedException e) {
                    fileOperationsService.deleteLocalFile(uploadedFile.getName(), FILES_FOLDER);
                    e.printStackTrace();
                }
                customFile.setLink("https://" + FileOperationsService.bucketAWS + ".s3.amazonaws.com/files/"
                        + customFile.getNameIdent());
                fileOperationsService.deleteLocalFile(uploadedFile.getName(), FILES_FOLDER);
                // ONLY ON PRODUCTION
            } else {
                // ONLY ON DEVELOPMENT
                customFile.setLink(uploadedFile.getPath());
                // ONLY ON DEVELOPMENT
            }
            fg = fileGroupService.getFromId(id_fileGroup);
            fg.getFiles().add(customFile);
            fg.updateFileIndexOrder();
            log.info("File succesfully uploaded to path '{}'", uploadedFile.getPath());


            FileGroup saved = fileGroupService.save(fg);

            return new ResponseEntity<>(saved, HttpStatus.CREATED);
        }
    }

    @LoginRequired
    @RequestMapping("/course/{courseId}/download/{fileId}")
    public void handleFileDownload(@PathVariable String fileId, @PathVariable(value = "courseId") String courseId,
                                   HttpServletResponse response) throws IOException {

        log.info("Downloading file...");

        long id_course = -1;
        long id_file = -1;
        try {
            id_course = Long.parseLong(courseId);
            id_file = Long.parseLong(fileId);
        } catch (NumberFormatException e) {
            log.error("Course ID '{}' or File ID '{}' are not of type Long", courseId, fileId);
            response.sendError(422, "Invalid format");
            return;
        }

        Course c = courseService.getFromId(id_course);

        ResponseEntity<Object> userAuthorized = authorizationService.checkAuthorizationUsers(c, c.getAttenders());
        if (userAuthorized != null) { // If the user is not an attender of the course
            response.sendError(401, "Unauthorized");
            return;
        } else {

            com.fullteaching.backend.model.File f = fileService.getFromId(id_file);

            if (f != null) {

                log.info("File name: '{}'", f.getName());

                if (this.isProductionStage()) {
                    // ONLY ON PRODUCTION
                    fileOperationsService.productionFileDownloader(f.getNameIdent(), response);
                    // ONLY ON PRODUCTION
                } else {
                    // ONLY ON DEVELOPMENT
                    Path file = FILES_FOLDER.resolve(f.getNameIdent());

                    if (Files.exists(file)) {
                        try {
                            String fileExt = f.getFileExtension();
                            response.setContentType(MimeTypes.getMimeType(fileExt));

                            // get your file as InputStream
                            InputStream is = new FileInputStream(file.toString());
                            // copy it to response's OutputStream
                            IOUtils.copy(is, response.getOutputStream());
                            response.flushBuffer();

                            log.info("File '{}' succesfully downloaded", f.getName());
                        } catch (IOException ex) {
                            throw new RuntimeException("IOError writing file to output stream");
                        }

                    } else {
                        log.error("File '{}' does not exist and cannot be downloaded", f.getName());
                        response.sendError(404,
                                "File" + f.getNameIdent() + "(" + file.toAbsolutePath() + ") does not exist");
                    }
                    // ONLY ON DEVELOPMENT
                }
            }
        }
    }

    @LoginRequired
    @RequestMapping(value = "/upload/picture/{userId}", method = RequestMethod.POST)
    public ResponseEntity<Object> handlePictureUpload(MultipartHttpServletRequest request,
                                                      @PathVariable(value = "userId") String userId) throws IOException {

        log.info("Uploading picture...");

        long id_user = -1;
        try {
            id_user = Long.parseLong(userId);
        } catch (NumberFormatException e) {
            log.error("User ID '{}' is not of type Long", userId);
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        User u = userService.getFromId(id_user);

        ResponseEntity<Object> userAuthorized = authorizationService.checkAuthorization(u, this.user.getLoggedUser());
        if (userAuthorized != null) { // If the user is not the teacher of the course
            return userAuthorized;
        } else {

            Iterator<String> i = request.getFileNames();
            while (i.hasNext()) {
                String name = i.next();

                log.info("File name: '{}'", name);

                MultipartFile file = request.getFile(name);

                log.info("File original name: " + file.getOriginalFilename());

                if (file.isEmpty()) {
                    log.error("File is empty");
                    throw new RuntimeException("The picture is empty");
                }

                if (!Files.exists(PICTURES_FOLDER)) {
                    log.debug("Creating folder '{}'", PICTURES_FOLDER);
                    Files.createDirectories(PICTURES_FOLDER);
                }

                String encodedName = fileOperationsService.getEncodedPictureName(file.getOriginalFilename());

                File uploadedPicture = new File(PICTURES_FOLDER.toFile(), encodedName);
                file.transferTo(uploadedPicture);

                if (this.isProductionStage()) {
                    // ONLY ON PRODUCTION
                    try {
                        fileOperationsService.productionFileSaver(encodedName, "pictures", uploadedPicture);
                    } catch (InterruptedException e) {
                        // TODO Auto-generated catch block
                        fileOperationsService.deleteLocalFile(uploadedPicture.getName(), PICTURES_FOLDER);
                        e.printStackTrace();
                    }
                    fileOperationsService.deleteLocalFile(uploadedPicture.getName(), PICTURES_FOLDER);
                    if (u.getPicture() != null) {
                        fileOperationsService.productionFileDeletion(
                                fileOperationsService.getFileNameFromURL(u.getPicture()), "/pictures");
                    }
                    u.setPicture(
                            "https://" + FileOperationsService.bucketAWS + ".s3.amazonaws.com/pictures/" + encodedName);
                    // ONLY ON PRODUCTION
                } else {
                    // ONLY ON DEVELOPMENT
                    if (u.getPicture() != null) {
                        fileOperationsService.deleteLocalFile(fileOperationsService.getFileNameFromURL(u.getPicture()),
                                PICTURES_FOLDER);
                    }
                    u.setPicture("/assets/pictures/" + uploadedPicture.getName());

                    log.info("Picture succesfully uploaded to path '{}'", uploadedPicture.getPath());
                    // ONLY ON DEVELOPMENT
                }

                userService.save(u);

                // Update current logged user picture
                this.user.getLoggedUser().setPicture(u.getPicture());
            }

            return new ResponseEntity<>(u, HttpStatus.OK);
        }
    }

    @LoginRequired
    @RequestMapping(value = "/upload/course/{courseDetailsId}/comment/{parentId}/entry/{entryId}", method = RequestMethod.POST)
    public ResponseEntity<Object> handleVideoMessageUpload(MultipartHttpServletRequest request,
                                                           @PathVariable(value = "courseDetailsId") long courseDetailsId,
                                                           @PathVariable(value = "entryId") long entryId,
                                                           @PathVariable(value = "parentId") long parentId)
            throws IOException {

        log.info("Uploading audio message...");

        CourseDetails courseDetails = courseDetailsService.getFromId(courseDetailsId);
        Comment commentParent = commentService.getFromId(parentId);
        Entry entry = entryService.getFromId(entryId);

        ResponseEntity<Object> userAuthorized = authorizationService.checkAuthorizationUsers(courseDetails.getCourse(), courseDetails.getCourse().getAttenders());
        if (userAuthorized != null) { // If the user is not an attender of the course
            return userAuthorized;
        } else {
            if (commentParent != null) {
                Comment comment = new Comment();
                Iterator<String> i = request.getFileNames();
                while (i.hasNext()) {

                    String name = i.next();

                    log.info("Audio file name: '{}'", name);

                    MultipartFile file = request.getFile(name);
                    String fileName = file.getOriginalFilename();

                    log.info("Audio file full name: " + fileName);

                    if (file.isEmpty()) {
                        log.error("The Audio file is empty");
                        throw new RuntimeException("The Audio file is empty");
                    }

                    if (!Files.exists(AUDIOS_FOLDER)) {
                        log.debug("Creating folder '{}'", AUDIOS_FOLDER);
                        Files.createDirectories(AUDIOS_FOLDER);
                    }

                    String saveName = UUID.randomUUID().toString() + ".wav";
                    String finalName = "audio-comment-" + saveName;
                    log.info("Audio file final name: " + finalName);
                    File uploadedFile = new File(AUDIOS_FOLDER.toFile(), finalName);

                    file.transferTo(uploadedFile);

                    if (this.isProductionStage()) {
                        // ONLY ON PRODUCTION
                        try {
                            fileOperationsService.productionFileSaver(finalName, "audios", uploadedFile);
                        } catch (InterruptedException e) {
                            fileOperationsService.deleteLocalFile(uploadedFile.getName(), AUDIOS_FOLDER);
                            e.printStackTrace();
                        }
                        fileOperationsService.deleteLocalFile(uploadedFile.getName(), AUDIOS_FOLDER);
                        // ONLY ON PRODUCTION
                    }
                    comment.setAudioUrl(finalName);
                    log.info("File succesfully uploaded to path '{}'", uploadedFile.getPath());
                }

                comment.setCommentParent(commentParent);
                comment.setUser(this.user.getLoggedUser());
                comment = commentService.save(comment);
                entryService.save(entry);

                User commentOwner = comment.getUser();
                User entryOwner = entry.getUser();
                User parentOwner = commentParent.getUser();

                // send new comment in your entry notification
                if(!commentOwner.equals(entryOwner)){
                    this.notificationDispatcher.notifyCommentAdded(entry,comment, commentOwner, courseDetails.getCourse());
                }

                // send new reply to your comment notification
                if(!parentOwner.equals(entryOwner) && !parentOwner.equals(commentOwner)){
                    this.notificationDispatcher.notifyCommentReply(commentParent, commentOwner, courseDetails.getCourse(), entry, comment);
                }


                return new ResponseEntity<>(comment, HttpStatus.CREATED);

            } else {
                log.error("Comment parent with id '{}' doesn't exist", parentId);
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }
    }

    private boolean isProductionStage() {
        return this.profileStage.equals("prod");
    }

}
