package com.fullteaching.backend.file;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import lombok.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Entity
@Getter
@Setter
@EqualsAndHashCode
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class File {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
	
	private int type;
	
	private String name;
	
	private String nameIdent;
	
	private String link;
	
	private int indexOrder;
	

	public File(int type, String name) {
		this.type = type; //0: web-link | 1: pdf | 2: video
		this.name = name;
		this.nameIdent = generateNameIdent(name);
		this.link = "";
	}
	
	public File(int type, String name, String link) {
		this.type = type; //0: web-link | 1: pdf | 2: video
		this.name = name;
		this.nameIdent = generateNameIdent(name);
		this.link = link;
	}
	
	public File(int type, String name, String link, int indexOrder) {
		this.type = type; //0: web-link | 1: pdf | 2: video
		this.name = name;
		this.nameIdent = generateNameIdent(name);
		this.link = link;
		this.indexOrder = indexOrder;
	}

	public String getFileExtension(){
		return this.nameIdent.substring(this.nameIdent.lastIndexOf('.') + 1);
	}
	
	//Generates a string which acts as an identifier for the stored file in the system (local, S3...)
	private String generateNameIdent(String originalName){
		String s = originalName + (Math.random() * (Integer.MIN_VALUE - Integer.MAX_VALUE));
		s = new BCryptPasswordEncoder().encode(s);
		s = s.replaceAll("[^A-Za-z0-9\\$]", "");
		int i = originalName.lastIndexOf('.');
		if (i >= 0) s += originalName.substring(i);
		return s;
	}
}
