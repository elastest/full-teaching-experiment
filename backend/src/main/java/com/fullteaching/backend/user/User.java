package com.fullteaching.backend.user;

import java.util.List;
import java.util.Set;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.ElementCollection;
import javax.persistence.Id;
import javax.persistence.ManyToMany;

import lombok.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.fasterxml.jackson.annotation.JsonIgnore;

import com.fullteaching.backend.course.Course;

@Entity(name = "user_data")
@Getter
@Setter
@EqualsAndHashCode
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class User {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;

	private String name;

	@JsonIgnore
	private String passwordHash;

	@ElementCollection(fetch = FetchType.EAGER)
	private List<String> roles;
	
	private String nickName;
	
	private String picture;
	
	private long registrationDate;
	
	//It is ignored in order to avoid infinite recursiveness
	//This makes necessary another interaction with the database (after login to retrieve the courses of the user)
	@JsonIgnore
	@ManyToMany(mappedBy="attenders")
	private Set<Course> courses;

	public User(String name, String password, String nickName, String picture, String... roles){
		this.name = name;
		this.passwordHash = new BCryptPasswordEncoder().encode(password);
		this.roles = new ArrayList<>(Arrays.asList(roles));
		
		this.nickName = nickName;
		if (picture != null && picture != "") {
			this.picture = picture;
		} else {
			this.picture = "/../assets/images/default_session_image.png";
		}
		this.registrationDate = System.currentTimeMillis();
		this.courses = new HashSet<>();
	}
}
