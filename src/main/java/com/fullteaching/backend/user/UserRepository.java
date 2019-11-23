package com.fullteaching.backend.user;

import com.fullteaching.backend.course.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

import java.util.Collection;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByName(String name);

    Collection<User> findByNameIn(Collection<String> names);

    Collection<User> findAllByCoursesIn(Collection<Course> courses);

    Collection<User> findAllByIdIn(Collection<Long> ids);

    User findById(long id);

    boolean existsByName(String name);
}
