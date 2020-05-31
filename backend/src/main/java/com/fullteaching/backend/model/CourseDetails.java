package com.fullteaching.backend.model;

import java.util.List;
import java.util.ArrayList;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.persistence.OneToMany;

import com.fullteaching.backend.model.Forum;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fullteaching.backend.model.Course;
import com.fullteaching.backend.model.FileGroup;
import lombok.*;

@Entity
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class CourseDetails {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
	
	@Column(length=100000)
	private String info;

	@OneToOne(cascade=CascadeType.ALL)
	private Forum forum = new Forum();
	
	@OneToMany(cascade=CascadeType.ALL)
	private List<FileGroup> files = new ArrayList<>();
	
	@JsonIgnore
	@OneToOne(mappedBy="courseDetails")
	private Course course;

	public CourseDetails(Course course) {
		this.info = "";
		this.course = course;
		this.forum = new Forum();
	}

	
}
