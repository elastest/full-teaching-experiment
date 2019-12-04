package com.fullteaching.backend.user;

import java.util.Collection;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.fullteaching.backend.course.Course;

public interface UserRepository extends JpaRepository<User, Long>{
	
	public User findByName(String name);
	
	public Collection<User> findByNameIn(Collection<String> names);
	
    @Query("select user from User user where courses in :givenCourses")
	public Collection<User> findByCourses(@Param("givenCourses") Collection<Course> courses);

}
