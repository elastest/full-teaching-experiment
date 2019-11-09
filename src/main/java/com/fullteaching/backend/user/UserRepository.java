package com.fullteaching.backend.user;

import com.fullteaching.backend.course.Course;
import org.springframework.data.repository.CrudRepository;

import java.util.Collection;
import java.util.List;

public interface UserRepository extends CrudRepository<User, Long> {

    User findByName(String name);

    Collection<User> findByNameIn(Collection<String> names);

    Collection<User> findByCourses(Collection<Course> courses);

    Collection<User> findAllById(Collection<Long> ids);

    User findById(long id);
}
