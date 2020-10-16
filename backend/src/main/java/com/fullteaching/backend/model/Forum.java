package com.fullteaching.backend.model;

import java.util.List;
import java.util.ArrayList;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Forum {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
	
	private boolean activated;
	
	@OneToMany(cascade=CascadeType.ALL, orphanRemoval = true)
	private List<Entry> entries = new ArrayList<>();

	public Forum(boolean activated) {
		this.activated = activated;
	}

	@Override
	public String toString() {
		int numberOfComments = 0;
		for (Entry entry: this.entries) {
			numberOfComments += entry.getComments().size();
		}
		return "Forum[activated: \"" + this.activated + "\", #entries: \"" + this.entries.size() + "\", #comments: \"" + numberOfComments + "\"]";
	}
}
