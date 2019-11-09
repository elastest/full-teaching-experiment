package com.fullteaching.backend.course;

import java.util.Collection;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fullteaching.backend.user.User;
import org.springframework.data.repository.CrudRepository;

public interface CourseRepository extends CrudRepository<Course, Long> {
	
    public Collection<Course> findByAttenders(Collection<User> users);

    Course findById(long id);
}
