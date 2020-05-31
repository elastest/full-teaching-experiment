package com.fullteaching.backend.repo;

import com.fullteaching.backend.model.Course;
import com.fullteaching.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;

public interface CourseRepository extends JpaRepository<Course, Long> {
	
    Collection<Course> findAllByAttendersIn(Collection<User> users);

    Course findById(long id);
}
