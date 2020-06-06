package com.fullteaching.backend.model;

import java.util.*;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.ElementCollection;
import javax.persistence.Id;
import javax.persistence.ManyToMany;

import com.fullteaching.backend.struct.Role;
import lombok.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity(name = "user_data")
@Getter
@Setter
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
	private List<String> roles = new ArrayList<>();
	
	private String nickName;
	
	private String picture;
	
	private long registrationDate;
	
	//It is ignored in order to avoid infinite recursiveness
	//This makes necessary another interaction with the database (after login to retrieve the courses of the user)
	@JsonIgnore
	@ManyToMany(mappedBy="attenders")
	private Set<Course> courses = new HashSet<>();

	public User(String name, String password, String nickName, String picture, String... roles){
		this.name = name;
		this.passwordHash = new BCryptPasswordEncoder().encode(password);
		this.roles = new ArrayList<>(Arrays.asList(roles));
		
		this.nickName = nickName;
		if (picture != null && picture != "") {
			this.picture = picture;
		}
		this.registrationDate = System.currentTimeMillis();
		this.courses = new HashSet<>();
	}

	public boolean isRole(Role role){
		return Objects.nonNull(this.roles
				.stream()
				.filter(r -> r.equals(role.getName()))
				.findFirst()
				.orElse(null));

	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		User user = (User) o;
		return id == user.id &&
				registrationDate == user.registrationDate;
	}

	@Override
	public int hashCode() {
		return Objects.hash(id, registrationDate);
	}

}
