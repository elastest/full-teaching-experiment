package com.fullteaching.backend.model;

import java.util.Set;
import java.util.HashSet;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.persistence.OneToMany;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;

import com.fasterxml.jackson.annotation.JsonView;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Course {
	
	public interface SimpleCourseList {}

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@JsonView(SimpleCourseList.class)
	private long id;
	
	@JsonView(SimpleCourseList.class)
	private String title;
	
	@JsonView(SimpleCourseList.class)
	private String image;
	
	@ManyToOne
	private User teacher;
	
	@OneToOne(cascade=CascadeType.ALL)
	private CourseDetails courseDetails;
	
	@JsonView(SimpleCourseList.class)
	@OneToMany(fetch = FetchType.EAGER, cascade=CascadeType.ALL, mappedBy="course")
	private Set<Session> sessions = new HashSet<>();
	
	@ManyToMany
	private Set<User> attenders = new HashSet<>();

	public Course(String title, String image, User teacher) {
		this.title = title;
		this.image = image;
		this.teacher = teacher;
		this.courseDetails = null;
	}

	public Course(String title, String image, User teacher, CourseDetails courseDetails) {
		this.title = title;
		this.image = image;
		this.teacher = teacher;
		this.courseDetails = courseDetails;
	}
}
