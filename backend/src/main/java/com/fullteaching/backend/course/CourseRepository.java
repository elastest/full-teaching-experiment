package com.fullteaching.backend.course;

import com.fullteaching.backend.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;

public interface CourseRepository extends JpaRepository<Course, Long> {
	
    Collection<Course> findAllByAttendersIn(Collection<User> users);

    Course findById(long id);
}
