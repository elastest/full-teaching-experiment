package com.fullteaching.backend.model;

import java.util.List;
import java.util.ArrayList;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Comment {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
	
	private String videourl;
	private boolean audioonly;
	private String message;
	
	private long date;
	
	@OneToMany(mappedBy="commentParent", cascade=CascadeType.ALL)
	@JsonManagedReference
	private List<Comment> replies = new ArrayList<>();
	
	@ManyToOne
	@JsonBackReference
	private Comment commentParent;
	
	@ManyToOne
	private User user;

	public Comment(String message, long date, User user) {
		this.message = message;
		this.date = date;
		this.user = user;
		this.commentParent = null;
	}
	
	public Comment(String message, long date, User user, Comment commentParent) {
		this.message = message;
		this.date = date;
		this.user = user;
		this.commentParent = commentParent;
	}


}
