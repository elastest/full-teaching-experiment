package com.fullteaching.backend.controller;

import com.fasterxml.jackson.annotation.JsonView;
import com.fullteaching.backend.annotation.CourseAuthorized;
import com.fullteaching.backend.annotation.LoginRequired;
import com.fullteaching.backend.annotation.RoleFilter;
import com.fullteaching.backend.model.Course;
import com.fullteaching.backend.model.Course.SimpleCourseList;
import com.fullteaching.backend.model.User;
import com.fullteaching.backend.notifications.NotificationDispatcher;
import com.fullteaching.backend.security.AuthorizationService;
import com.fullteaching.backend.security.user.UserComponent;
import com.fullteaching.backend.service.CourseService;
import com.fullteaching.backend.service.UserService;
import com.fullteaching.backend.struct.Role;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.validator.routines.EmailValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api-courses")
@Slf4j
public class CourseController extends SecureController {


    private final CourseService courseService;
    private final UserService userService;
    private final NotificationDispatcher notificationDispatcher;

    @Autowired
    public CourseController(CourseService courseService, UserService userService, UserComponent user, AuthorizationService authorizationService, NotificationDispatcher notificationDispatcher) {
        super(user, authorizationService);
        this.courseService = courseService;
        this.userService = userService;
        this.notificationDispatcher = notificationDispatcher;
    }


    private class AddAttendersResponse {
        public Collection<User> attendersAdded;
        public Collection<User> attendersAlreadyAdded;
        public Collection<String> emailsInvalid;
        public Collection<String> emailsValidNotRegistered;
    }

    @LoginRequired
    @JsonView(SimpleCourseList.class)
    @RequestMapping(value = "/user/{id}", method = RequestMethod.GET)
    public ResponseEntity<Object> getCourses(@PathVariable(value = "id") long id) {
        log.info("CRUD operation: Getting all user courses");
        User user = userService.getFromId(id);
        Collection<Course> courses = courseService.getCoursesFilteringHiddenFiles(user);
        return new ResponseEntity<>(courses, HttpStatus.OK);
    }

    @LoginRequired
    @RequestMapping(value = "/course/{id}", method = RequestMethod.GET)
    public ResponseEntity<Object> getCourse(@PathVariable(value = "id") long id) {
        log.info("CRUD operation: Getting one course");
        Course course = courseService.getFromId(id);
        return new ResponseEntity<>(course, HttpStatus.OK);
    }

    @RoleFilter(role = Role.TEACHER)
    @RequestMapping(value = "/new", method = RequestMethod.POST)
    public ResponseEntity<?> newCourse(@RequestBody Course course) {

        log.info("CRUD operation: Adding new course");

        User userLogged = user.getLoggedUser();

        //Updating course ('teacher', 'attenders')
        course.setTeacher(userLogged);
        course.getAttenders().add(userLogged);
		
		/*Saving the new course: Course entity is the owner of the relationships
		Course-Teacher, Course-User, Course-CourseDetails. Teacher, User and CourseDetails
		tables don't need to be updated (they will automatically be)*/
        courseService.save(course);

        course = courseService.getFromId(course.getId());

        log.info("New course succesfully added: {}", course.toString());

        return new ResponseEntity<>(course, HttpStatus.CREATED);
    }

    @RoleFilter(role = Role.TEACHER)
    @RequestMapping(value = "/edit", method = RequestMethod.PUT)
    public ResponseEntity<Object> modifyCourse(@RequestBody Course course) {

        log.info("CRUD operation: Updating course");

        Course c = courseService.getFromId(course.getId());

        ResponseEntity<Object> teacherAuthorized = authorizationService.checkAuthorization(c, c.getTeacher());
        if (teacherAuthorized != null) { // If the user is not the teacher of the course
            return teacherAuthorized;
        } else {
            log.info("Updating course. Previous value: {}", c.toString());

            //Modifying the course attributes
            c.setImage(course.getImage());
            c.setTitle(course.getTitle());
            if (course.getCourseDetails() != null) {
                if (course.getCourseDetails().getInfo() != null) {
                    c.getCourseDetails().setInfo(course.getCourseDetails().getInfo());
                }
            }
            //Saving the modified course
            courseService.save(c);

            log.info("Course succesfully updated. Modified value: {}", c.toString());

            return new ResponseEntity<>(c, HttpStatus.OK);
        }
    }

    @CourseAuthorized(courseParam = "course_id", mustBeTeacherOfCourse = true)
    @RequestMapping(value = "/delete", method = RequestMethod.DELETE)
    public ResponseEntity<Object> deleteCourse(@RequestParam(value = "course_id") long courseId) {

        log.info("CRUD operation: Deleting course");

        Course c = courseService.getFromId(courseId);


        log.info("Deleting course: {}", c.toString());

        //Removing the deleted course from its attenders
        Collection<Course> courses = new HashSet<>();
        courses.add(c);
        Collection<User> users = userService.findByCourses(courses);
        for (User u : users) {
            u.getCourses().remove(c);
        }
        userService.saveAll(users);
        c.getAttenders().clear();

        courseService.delete(c);

        log.info("Course successfully deleted");

        return new ResponseEntity<>(c, HttpStatus.OK);

    }


    @CourseAuthorized(courseParam = "course_id", mustBeTeacherOfCourse = true)
    @RequestMapping(value = "/edit/add-attenders/course", method = RequestMethod.PUT)
    public ResponseEntity<Object> addAttenders(
            @RequestBody String[] attenderEmails,
            @RequestParam(value = "course_id") long courseId) {

        log.info("CRUD operation: Adding attenders to course");

        Course c = courseService.getFromId(courseId);

        ResponseEntity<Object> teacherAuthorized = authorizationService.checkAuthorization(c, c.getTeacher());
        if (teacherAuthorized != null) { // If the user is not the teacher of the course
            return teacherAuthorized;
        } else {

            log.info("Adding attenders {} to course {}", Arrays.toString(attenderEmails), c.toString());

            //Strings with a valid email format
            Set<String> attenderEmailsValid = new HashSet<>();
            //Strings with an invalid email format
            Set<String> attenderEmailsInvalid = new HashSet<>();
            //Strings with a valid email format but no registered in the application
            Set<String> attenderEmailsNotRegistered = new HashSet<>();

            EmailValidator emailValidator = EmailValidator.getInstance();

            for (int i = 0; i < attenderEmails.length; i++) {
                if (emailValidator.isValid(attenderEmails[i])) {
                    attenderEmailsValid.add(attenderEmails[i]);
                } else {
                    attenderEmailsInvalid.add(attenderEmails[i]);
                }
            }

            Collection<User> newPossibleAttenders = userService.findByNameIn(attenderEmailsValid);
            Collection<User> newAddedAttenders = new HashSet<>();
            Collection<User> alreadyAddedAttenders = new HashSet<>();

            for (String s : attenderEmailsValid) {
                if (!this.userListContainsEmail(newPossibleAttenders, s)) {
                    attenderEmailsNotRegistered.add(s);
                }
            }

            for (User attender : newPossibleAttenders) {
                boolean newAtt = true;
                if (!attender.getCourses().contains(c)) attender.getCourses().add(c);
                else newAtt = false;
                if (!c.getAttenders().contains(attender)) c.getAttenders().add(attender);
                else newAtt = false;
                if (newAtt) newAddedAttenders.add(attender);
                else alreadyAddedAttenders.add(attender);
            }

            //Saving the attenders (all of them, just in case a field of the bidirectional relationship is missing in a Course or a User)
            userService.saveAll(newPossibleAttenders);
            //Saving the modified course
            courseService.save(c);

            AddAttendersResponse customResponse = new AddAttendersResponse();
            customResponse.attendersAdded = newAddedAttenders;
            customResponse.attendersAlreadyAdded = alreadyAddedAttenders;
            customResponse.emailsInvalid = attenderEmailsInvalid;
            customResponse.emailsValidNotRegistered = attenderEmailsNotRegistered;

            log.info("Attenders added: {} | Attenders already exist: {} | Emails not valid: {} | Emails valid but no registered: {}",
                    customResponse.attendersAdded,
                    customResponse.attendersAlreadyAdded,
                    customResponse.emailsInvalid,
                    customResponse.emailsValidNotRegistered);

            // notify attenders that they were added to a course
            for (User attender : newAddedAttenders) {
                this.notificationDispatcher.notifyInvitedToCourse(attender, c);
            }

            return new ResponseEntity<>(customResponse, HttpStatus.OK);
        }
    }

    @CourseAuthorized(courseParam = "course_id", mustBeTeacherOfCourse = true)
    @RequestMapping(value = "/edit/remove-attender", method = RequestMethod.PUT)
    public ResponseEntity<?> removeAttenders(@RequestParam(value = "course_id") long course_id, @RequestParam(value = "attender_id") long attender_id) {
        log.info("Removing attender {} from course {}", attender_id, course_id);
        Course c = this.courseService.getFromId(course_id);

        User attender = this.userService.getFromId(attender_id);
        Collection attenders = this.courseService.removeAttender(attender, c);
        log.info("Attender {} successfully removed from course {}", attender_id, course_id);
        return new ResponseEntity<>(attenders, HttpStatus.OK);

    }


    //Checks if a User collection contains a user with certain email
    private boolean userListContainsEmail(Collection<User> users, String email) {
        boolean isContained = false;
        for (User u : users) {
            if (u.getName().equals(email)) {
                isContained = true;
                break;
            }
        }
        return isContained;
    }

}

	
	
