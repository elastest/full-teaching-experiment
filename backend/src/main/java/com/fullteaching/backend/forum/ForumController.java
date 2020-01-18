package com.fullteaching.backend.forum;

import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fullteaching.backend.coursedetails.CourseDetails;
import com.fullteaching.backend.coursedetails.CourseDetailsRepository;
import com.fullteaching.backend.security.AuthorizationService;
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api-forum")
@Slf4j
public class ForumController {
	
	private final AuthorizationService authorizationService;
	private final CourseDetailsRepository courseDetailsRepository;

	@Autowired
	public ForumController(AuthorizationService authorizationService, CourseDetailsRepository courseDetailsRepository) {
		this.authorizationService = authorizationService;
		this.courseDetailsRepository = courseDetailsRepository;
	}

	@RequestMapping(value = "/edit/{courseDetailsId}", method = RequestMethod.PUT)
	public ResponseEntity<Object> modifyForum(@RequestBody boolean activated, @PathVariable(value="courseDetailsId") String courseDetailsId) {
		
		log.info("CRUD operation: Updating forum");
		
		ResponseEntity<Object> authorized = authorizationService.checkBackendLogged();
		if (authorized != null){
			return authorized;
		};
		
		long id_i = -1;
		try{
			id_i = Long.parseLong(courseDetailsId);
		}catch(NumberFormatException e){
			log.error("CourseDetails ID '{}' is not of type Long", courseDetailsId);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}

		CourseDetails cd = courseDetailsRepository.findById(id_i);
		
		log.info("Updating forum. Previous value: {}", cd.getForum());
		
		ResponseEntity<Object> teacherAuthorized = authorizationService.checkAuthorization(cd, cd.getCourse().getTeacher());
		if (teacherAuthorized != null) { // If the user is not the teacher of the course
			return teacherAuthorized;
		} else {
		
			//Modifying the forum
			cd.getForum().setActivated(activated);
			//Saving the modified course
			courseDetailsRepository.save(cd);
			
			log.info("Forum succesfully updated. Modified value: {}", cd.getForum());
			
			return new ResponseEntity<>(new Boolean(activated), HttpStatus.OK);
		}
	}

}
