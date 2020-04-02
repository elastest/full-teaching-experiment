package com.fullteaching.backend.course;

import com.fullteaching.backend.struct.FTService;
import com.fullteaching.backend.user.User;
import com.fullteaching.backend.user.UserService;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collection;

@Getter
@Service
@Slf4j
public class CourseService implements FTService<Course, Long> {

    private final CourseRepository repo;
    private final UserService userService;

    @Autowired
    public CourseService(CourseRepository repo, UserService userService) {
        this.repo = repo;
        this.userService = userService;
    }

    public Collection<Course> findByAttenders(Collection<User> users) {
        return this.repo.findAllByAttendersIn(users);
    }


    public Collection<User> removeAttender(User attender, Course c) {
        c.getAttenders().remove(attender);
        attender.getCourses().remove(c);
        this.save(c);
        this.userService.save(attender);
        return c.getAttenders();
    }
}
