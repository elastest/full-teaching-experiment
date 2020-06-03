package com.fullteaching.backend.security;

import com.fullteaching.backend.annotation.CourseAuthorized;
import com.fullteaching.backend.annotation.RoleFilter;
import com.fullteaching.backend.model.Course;
import com.fullteaching.backend.model.CourseDetails;
import com.fullteaching.backend.model.User;
import com.fullteaching.backend.security.user.UserComponent;
import com.fullteaching.backend.service.CourseDetailsService;
import com.fullteaching.backend.service.CourseService;
import com.fullteaching.backend.struct.Role;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Objects;

@Log4j2
@Component
public class CourseAuthorizerInterceptor implements HandlerInterceptor {

    private final UserComponent userComponent;
    private final CourseService courseService;
    private final CourseDetailsService courseDetailsService;

    @Autowired
    public CourseAuthorizerInterceptor(UserComponent userComponent, CourseService courseService, CourseDetailsService courseDetailsService) {
        this.userComponent = userComponent;
        this.courseService = courseService;
        this.courseDetailsService = courseDetailsService;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws IOException {
//        if ((handler instanceof HandlerMethod)) {
//            HandlerMethod handlerMethod = (HandlerMethod) handler;
//            CourseAuthorized courseAuthorized = handlerMethod.getMethod().getAnnotation(CourseAuthorized.class);
//
//            // we have correct annotation
//            if (Objects.isNull(courseAuthorized)) {
//                return true;
//            }
//
//            // check logged in
//            User user = userComponent.getLoggedUser();
//            if (Objects.isNull(user)) {
//                log.info("User is not logged in!");
//                response.setStatus(401);
//                return false;
//            }
//
//            String courseIdParamName = courseAuthorized.courseParam();
//            String courseDetailsIdParamName = courseAuthorized.courseDetailsIdParam();
//            boolean mustBeTeacher = courseAuthorized.mustBeTeacherOfCourse();
//            Course course = null;
//
//            // get course by id
//            if (!courseIdParamName.equals("")) {
//                long id = Long.parseLong(request.getParameter(courseIdParamName));
//                course = this.courseService.getFromId(id);
//            }
//
//            // get course by details
//            if(!courseDetailsIdParamName.equals("")){
//                long id = Long.parseLong(request.getParameter(courseDetailsIdParamName));
//                CourseDetails courseDetails = this.courseDetailsService.getFromId(id);
//
//                // course details found
//                if(Objects.nonNull(courseDetails)){
//                    course = courseDetails.getCourse();
//                }
//            }
//
//
//            // course found
//            if (Objects.nonNull(course)) {
//                log.info("Course was found with id {}!", course.getId());
//
//                // check if user is teacher
//                if (mustBeTeacher) {
//                    boolean isTeacher = course.getTeacher().equals(user);
//                    log.info("Is teacher: {}", isTeacher);
//                    return isTeacher;
//                }
//
//                // check if is attender
//                else {
//                    boolean isAttender = course.getAttenders().contains(user);
//                    log.info("Is attender: {}", isAttender);
//                    return isAttender;
//                }
//            }
//            // course not found
//            else {
//                log.info("Course does not exist!");
//                return false;
//            }
//        }
        return true;
    }

}
