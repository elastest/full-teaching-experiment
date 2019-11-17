package com.fullteaching.backend.user;

import com.fullteaching.backend.course.Course;
import com.fullteaching.backend.struct.FTService;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
@Slf4j
@Service
public class UserService implements FTService<User, Long> {

    private final UserRepository repo;


    @Autowired
    public UserService(UserRepository repo) {
        this.repo = repo;
    }

    public Collection<User> findByCourses(Collection<Course> courses) {
        return this.repo.findAllByCoursesIn(courses);
    }

    public Collection<User> findByNameIn(Set<String> attenderEmailsValid) {
        return this.repo.findByNameIn(attenderEmailsValid);
    }

    public boolean existsByName(String userDatum) {
        return this.repo.existsByName(userDatum);
    }

    public User getByName(String name){
        return this.repo.findByName(name);
    }

}
