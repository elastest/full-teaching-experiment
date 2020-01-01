package com.fullteaching.backend.entry;

import java.util.List;
import java.util.ArrayList;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.ManyToOne;

import com.fullteaching.backend.comment.Comment;
import com.fullteaching.backend.user.User;
import lombok.*;

@Entity
@Getter
@Setter
@EqualsAndHashCode
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class Entry {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
	
	private String title;
	
	private long date;
	
	@OneToMany(cascade=CascadeType.ALL)
	private List<Comment> comments;
	
	@ManyToOne
	private User user;

	public Entry(String title, long date, User user) {
		this.title = title;
		this.date = date;
		this.user = user;
		this.comments = new ArrayList<>();
	}


}
