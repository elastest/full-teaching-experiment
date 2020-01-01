package com.fullteaching.backend.session;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonView;
import com.fullteaching.backend.course.Course;
import com.fullteaching.backend.course.Course.SimpleCourseList;
import lombok.*;

@Entity
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class Session {
	
	@JsonView(SimpleCourseList.class)
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
	
	@JsonView(SimpleCourseList.class)
	private String title;
	
	@JsonView(SimpleCourseList.class)
	private String description;
	
	@JsonView(SimpleCourseList.class)
	private long date;
	
	@JsonIgnore
	@ManyToOne
	private Course course;

	public Session(String title, String description, long date) {
		this.title = title;
		this.description = description;
		this.date = date;
		this.course = null;
	}

	public Session(String title, String description, long date, Course course) {
		this.title = title;
		this.description = description;
		this.date = date;
		this.course = course;
	}
}
