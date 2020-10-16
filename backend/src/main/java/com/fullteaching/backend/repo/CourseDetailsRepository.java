package com.fullteaching.backend.repo;

import com.fullteaching.backend.model.CourseDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import com.fullteaching.backend.model.Course;

public interface CourseDetailsRepository extends JpaRepository<CourseDetails, Long> {
	
	CourseDetails findByCourse(Course course);
	CourseDetails findById(long id);
}
