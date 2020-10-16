package com.fullteaching.backend.controller;

import com.fullteaching.backend.service.CourseService;
import com.fullteaching.backend.model.Session;
import com.fullteaching.backend.service.SessionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fullteaching.backend.model.Course;
import com.fullteaching.backend.security.AuthorizationService;
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api-sessions")
@Slf4j
public class SessionController {
	
	
	private final CourseService courseService;
	private final SessionService sessionService;
	private final AuthorizationService authorizationService;

	@Autowired
	public SessionController(CourseService courseService, SessionService sessionService, AuthorizationService authorizationService) {
		this.courseService = courseService;
		this.sessionService = sessionService;
		this.authorizationService = authorizationService;
	}

	@RequestMapping(value = "/course/{id}", method = RequestMethod.POST)
	public ResponseEntity<Object> newSession(@RequestBody Session session, @PathVariable(value="id") String id) {
		
		log.info("CRUD operation: Adding new session");
		
		ResponseEntity<Object> authorized = authorizationService.checkBackendLogged();
		if (authorized != null){
			return authorized;
		};
		
		long id_i = -1;
		try {
			id_i = Long.parseLong(id);
		} catch(NumberFormatException e){
			log.error("Session ID '{}' is not of type Long", id);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		
		Course course = courseService.getFromId(id_i);
		
		ResponseEntity<Object> teacherAuthorized = authorizationService.checkAuthorization(course, course.getTeacher());
		if (teacherAuthorized != null) { // If the user is not the teacher of the course
			return teacherAuthorized;
		} else {
			//Bi-directional saving
			session.setCourse(course);
			course.getSessions().add(session);
			
			//Saving the modified course: Cascade relationship between course and sessions
			//will add the new session to sessionService
			courseService.save(course);
			
			log.info("New session succesfully added: {}", session.toString());
			
			//Entire course is returned
			return new ResponseEntity<>(course, HttpStatus.CREATED);
		}
	}
	
	
	@RequestMapping(value = "/edit", method = RequestMethod.PUT)
	public ResponseEntity<Object> modifySession(@RequestBody Session session) {
		
		log.info("CRUD operation: Updating session");
		
		ResponseEntity<Object> authorized = authorizationService.checkBackendLogged();
		if (authorized != null){
			return authorized;
		};
		
		Session s = sessionService.getFromId(session.getId());
		
		log.info("Updating session. Previous value: {}", s.toString());
		
		ResponseEntity<Object> teacherAuthorized = authorizationService.checkAuthorization(s, s.getCourse().getTeacher());
		if (teacherAuthorized != null) { // If the user is not the teacher of the course
			return teacherAuthorized;
		} else {
			s.setTitle(session.getTitle());
			s.setDescription(session.getDescription());
			s.setDate(session.getDate());
			//Saving the modified session
			sessionService.save(s);
			
			log.info("Session succesfully updated. Modified value: {}", session.toString());
			
			return new ResponseEntity<>(s, HttpStatus.OK);
		}
	}
	
	
	@RequestMapping(value = "/delete/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<Object> deleteSession(@PathVariable(value="id") String id) {
		
		log.info("CRUD operation: Deleting session");
		
		ResponseEntity<Object> authorized = authorizationService.checkBackendLogged();
		if (authorized != null){
			return authorized;
		};
		
		long id_i = -1;
		try{
			id_i = Long.parseLong(id);
		}catch(NumberFormatException e){
			log.error("Session ID '{}' is not of type Long", id);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		
		Session session = sessionService.getFromId(id_i);
		
		ResponseEntity<Object> teacherAuthorized = authorizationService.checkAuthorization(session, session.getCourse().getTeacher());
		if (teacherAuthorized != null) { // If the user is not the teacher of the course
			return teacherAuthorized;
		} else {
		
			Course course = courseService.getFromId(session.getCourse().getId());
			if (course != null){
				
				log.info("Deleting session: {}", session.toString());
				
				course.getSessions().remove(session);
				sessionService.deleteById(id_i);
				courseService.save(course);
				
				log.info("Session successfully deleted");
				
				return new ResponseEntity<>(session, HttpStatus.OK);
			}
			else {
				//The Course that owns the deleted session does not exist
				//This code is presumed to be unreachable, because of the Cascade.ALL relationship from Course to Session
				sessionService.delete(session);
				return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
			}
		}
	}
	
}
