package com.fullteaching.backend.service;

import com.fullteaching.backend.model.Course;
import com.fullteaching.backend.model.User;
import com.fullteaching.backend.repo.UserRepository;
import com.fullteaching.backend.struct.FTService;
import com.fullteaching.backend.struct.Role;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Set;

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

    public User getByEmail(String name){
        return this.repo.findByName(name);
    }

    public Page<User> getByname(String name, int page, int size) {
        return this.repo.findAllByNameStartingWith(name, PageRequest.of(page, size));
    }

    public User addRole(User user, Role role){
        user.getRoles().add(role.getName());
        return this.save(user);
    }

    public User setRole(User user, Role role){
        user.getRoles().clear();
        user.getRoles().add(role.getName());
        return this.save(user);
    }
}
