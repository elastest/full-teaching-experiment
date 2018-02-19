package com.fullteaching.backend.comment;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.fullteaching.backend.entry.Entry;
import com.fullteaching.backend.entry.EntryRepository;
import com.fullteaching.backend.user.User;
import com.fullteaching.backend.user.UserComponent;

@RestController
@RequestMapping("/api-comments")
public class CommentController {
	
	private static final Logger log = LoggerFactory.getLogger(CommentController.class);
	
	@Autowired
	private EntryRepository entryRepository;
	
	@Autowired
	private CommentRepository commentRepository;
	
	@Autowired
	private UserComponent user;
	
	@RequestMapping(value = "/entry/{entryId}/forum/{courseDetailsId}", method = RequestMethod.POST)
	public ResponseEntity<Object> newComment(
			@RequestBody Comment comment, 
			@PathVariable(value="entryId") String entryId, 
			@PathVariable(value="courseDetailsId") String courseDetailsId
	) {
		
		log.info("CRUD operation: Adding new comment");
		
		long id_entry = -1;
		try {
			id_entry = Long.parseLong(entryId);
		} catch(NumberFormatException e){
			log.error("Entry ID '{}' or CourseDetails ID '{}' are not of type Long", entryId, courseDetailsId);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		
		//Setting the author of the comment
		User userLogged = user.getLoggedUser();
		comment.setUser(userLogged);
		//Setting the date of the comment
		comment.setDate(System.currentTimeMillis());
		
		//The comment is a root comment
		if (comment.getCommentParent() == null) {
			log.info("Adding new root comment");
			Entry entry = entryRepository.findOne(id_entry);
			if(entry != null) {
				entry.getComments().add(comment);
				/*Saving the modified entry: Cascade relationship between entry and comments
				  will add the new comment to CommentRepository*/
				entryRepository.save(entry);
				
				log.info("New comment succesfully added: {}", comment.toString());
				
				/*Entire entry is returned*/
				return new ResponseEntity<>(entry, HttpStatus.CREATED);
			} else {
				return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
			}
		}
		
		//The comment is a replay to another existing comment
		else{
			log.info("Adding new comment reply");
			Comment cParent = commentRepository.findOne(comment.getCommentParent().getId());
			if(cParent != null){
				cParent.getReplies().add(comment);
				/*Saving the modified parent comment: Cascade relationship between comment and 
				 its replies will add the new comment to CommentRepository*/
				commentRepository.save(cParent);
				Entry entry = entryRepository.findOne(id_entry);
				
				log.info("New comment succesfully added: {}", comment.toString());
				
				/*Entire entry is returned*/
				return new ResponseEntity<>(entry, HttpStatus.CREATED);
			}else{
				return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
			}
		}
	}

}