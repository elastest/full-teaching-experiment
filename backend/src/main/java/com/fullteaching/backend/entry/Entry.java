package com.fullteaching.backend.entry;

import java.util.List;
import java.util.ArrayList;
import java.util.Objects;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.ManyToOne;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fullteaching.backend.comment.Comment;
import com.fullteaching.backend.forum.Forum;
import com.fullteaching.backend.user.User;
import lombok.*;

@Entity
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class Entry {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
	
	private String title;
	
	private long date;
	
	@OneToMany(cascade=CascadeType.ALL, orphanRemoval=true)
	private List<Comment> comments = new ArrayList<>();

	@JsonIgnoreProperties("entries")
	@ManyToOne
	private Forum forum;

	@ManyToOne
	private User user;

	public Entry(String title, long date, User user) {
		this.title = title;
		this.date = date;
		this.user = user;
	}


	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		Entry entry = (Entry) o;
		return id == entry.id;
	}

	@Override
	public int hashCode() {
		return Objects.hash(id);
	}
}
