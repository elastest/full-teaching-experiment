package com.fullteaching.backend.controller;

import com.fullteaching.backend.file.MultipartFileSender;
import com.fullteaching.backend.model.Course;
import com.fullteaching.backend.model.File;
import com.fullteaching.backend.security.AuthorizationService;
import com.fullteaching.backend.security.user.UserComponent;
import com.fullteaching.backend.service.CourseService;
import com.fullteaching.backend.service.FileService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.Objects;

@RestController
@RequestMapping("streaming/video")
@Slf4j
public class VideoStreamingController {

    public static final Path VIDEOS_FOLDER = Paths.get(System.getProperty("user.dir"), "/assets/files");
    private final FileService fileService;
    private final AuthorizationService authorizationService;
    private final CourseService courseService;
    private final UserComponent userComponent;

    @Autowired
    public VideoStreamingController(FileService fileService, AuthorizationService authorizationService, CourseService courseService, UserComponent userComponent) {
        this.fileService = fileService;
        this.authorizationService = authorizationService;
        this.courseService = courseService;
        this.userComponent = userComponent;
    }

    @GetMapping(value = "/play/{fileId}/{courseId}")
    public void getTestVideo(HttpServletRequest request, HttpServletResponse response, @PathVariable long fileId, @PathVariable long courseId) throws Exception {

        ResponseEntity<Object> authorized = authorizationService.checkBackendLogged();
        if (Objects.nonNull(authorized)) {
            response.sendError(401, "Not logged");
            return;
        } else {
            Course course = this.courseService.getFromId(courseId);
            if (Objects.nonNull(this.authorizationService.checkAuthorizationUsers(course, Collections.singleton(userComponent.getLoggedUser())))) {
                response.sendError(401, "Not logged");
                return;
            }
        }

        File file = this.fileService.getFromId(fileId);

        if (Objects.nonNull(file)) {

            log.info("File found!");

            String videoPath = VIDEOS_FOLDER + "/" + file.getNameIdent();
            log.info(videoPath);

            MultipartFileSender.fromPath(Paths.get(videoPath))
                    .with(request)
                    .with(response)
                    .serveResource();
        } else {
            log.info("File not found with id: {}", fileId);
            response.sendError(404, "File not found");
        }
    }
}
