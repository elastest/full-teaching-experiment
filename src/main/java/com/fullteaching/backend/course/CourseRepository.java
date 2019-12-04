package com.fullteaching.backend.course;

import java.util.Collection;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.fullteaching.backend.user.User;

public interface CourseRepository extends JpaRepository<Course, Long> {

    @Query("select course from Course course where attenders in :users")
	public Collection<Course> findByAttenders(@Param("users") Collection<User> users);

}
