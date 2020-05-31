package com.fullteaching.backend.controller;

import com.fullteaching.backend.annotation.LoginRequired;
import com.fullteaching.backend.annotation.RoleFilter;
import com.fullteaching.backend.model.Comment;
import com.fullteaching.backend.service.CommentService;
import com.fullteaching.backend.model.Course;
import com.fullteaching.backend.service.CourseService;
import com.fullteaching.backend.model.CourseDetails;
import com.fullteaching.backend.service.CourseDetailsService;
import com.fullteaching.backend.model.Entry;
import com.fullteaching.backend.service.EntryService;
import com.fullteaching.backend.entry.NewEntryCommentResponse;
import com.fullteaching.backend.security.AuthorizationService;
import com.fullteaching.backend.model.User;
import com.fullteaching.backend.security.user.UserComponent;
import com.fullteaching.backend.struct.Role;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api-comments")
@Slf4j
public final class CommentController extends SecureController {

    private final UserComponent user;
    private final AuthorizationService authorizationService;
    private final CourseDetailsService courseDetailsService;
    private final EntryService entryService;
    private final CommentService commentService;
    private final CourseService courseService;

    @Autowired
    public CommentController(UserComponent user, AuthorizationService authorizationService, CourseDetailsService courseDetailsService, EntryService entryService, CommentService commentService, CourseService courseService) {
        super(user, authorizationService);
        this.user = user;
        this.authorizationService = authorizationService;
        this.courseDetailsService = courseDetailsService;
        this.entryService = entryService;
        this.commentService = commentService;
        this.courseService = courseService;
    }


    @RoleFilter(role = Role.TEACHER)
    @LoginRequired
    @PostMapping(value = "/comment/{commentId}/{courseId}/{entryId}")
    public ResponseEntity<?> removeComment(@PathVariable long commentId, @PathVariable long courseId, @PathVariable() long entryId) {

        Course course = this.courseService.getFromId(courseId);
        Entry entry = this.entryService.getFromId(entryId);
        ResponseEntity<?> unAuthorized = this.authorize(course);

        if (Objects.isNull(unAuthorized)) {
            ResponseEntity<?> responseEntity;
            Comment comment = this.commentService.getFromId(commentId);

            if (Objects.nonNull(comment) && Objects.nonNull(entry)) {
                Entry response = this.entryService.removeCommentAndChildren(entry, comment);
                responseEntity = ResponseEntity.ok(response);
            } else {
                responseEntity = new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            return responseEntity;
        } else {
            return unAuthorized;
        }
    }

    @LoginRequired
    @RequestMapping(value = "/entry/{entryId}/forum/{courseDetailsId}", method = RequestMethod.POST)
    public ResponseEntity<Object> newComment(
            @RequestBody Comment comment,
            @PathVariable(value = "entryId") String entryId,
            @PathVariable(value = "courseDetailsId") String courseDetailsId
    ) {

        log.info("CRUD operation: Adding new comment");

        ResponseEntity<Object> authorized = authorizationService.checkBackendLogged();
        if (authorized != null) {
            return authorized;
        }


        long id_entry = -1;
        long id_courseDetails = -1;
        try {
            id_entry = Long.parseLong(entryId);
            id_courseDetails = Long.parseLong(courseDetailsId);
        } catch (NumberFormatException e) {
            log.error("Entry ID '{}' or CourseDetails ID '{}' are not of type Long", entryId, courseDetailsId);
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        CourseDetails cd = this.courseDetailsService.getFromId(id_courseDetails);

        ResponseEntity<Object> userAuthorized = authorizationService.checkAuthorizationUsers(cd, cd.getCourse().getAttenders());
        if (userAuthorized != null) { // If the user is not an attender of the course
            return userAuthorized;
        } else {

            //Setting the author of the comment
            User userLogged = user.getLoggedUser();
            comment.setUser(userLogged);
            //Setting the date of the comment
            comment.setDate(System.currentTimeMillis());

            //The comment is a root comment
            if (comment.getCommentParent() == null) {
                log.info("Adding new root comment");
                Entry entry = entryService.getFromId(id_entry);
                if (entry != null) {

                    comment = commentService.save(comment);

                    entry.getComments().add(comment);
					/*Saving the modified entry: Cascade relationship between entry and comments
					  will add the new comment to CommentRepository*/
                    entryService.save(entry);

                    log.info("New comment succesfully added: {}", comment.toString());

                    return new ResponseEntity<>(new NewEntryCommentResponse(entry, comment), HttpStatus.CREATED);
                } else {
                    return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
                }
            }

            //The comment is a replay to another existing comment
            else {
                log.info("Adding new comment reply");
                Comment cParent = commentService.getFromId(comment.getCommentParent().getId());
                if (cParent != null) {

                    comment = commentService.save(comment);

                    cParent.getReplies().add(comment);
					/*Saving the modified parent comment: Cascade relationship between comment and 
					 its replies will add the new comment to CommentRepository*/
                    commentService.save(cParent);
                    Entry entry = entryService.getFromId(id_entry);

                    log.info("New comment succesfully added: {}", comment.toString());

                    return new ResponseEntity<>(new NewEntryCommentResponse(entry, comment), HttpStatus.CREATED);
                } else {
                    return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
                }
            }
        }
    }

}
