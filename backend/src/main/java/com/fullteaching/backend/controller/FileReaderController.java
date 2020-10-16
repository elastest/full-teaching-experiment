package com.fullteaching.backend.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import com.fullteaching.backend.service.CourseService;
import com.fullteaching.backend.file.FileReader;
import com.fullteaching.backend.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.validator.routines.EmailValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.fullteaching.backend.model.Course;
import com.fullteaching.backend.file.FileOperationsService;
import com.fullteaching.backend.security.AuthorizationService;
import com.fullteaching.backend.model.User;
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api-file-reader")
@Slf4j
public class FileReaderController {

	@Autowired
	public FileReaderController(UserService userService, CourseService courseService, AuthorizationService authorizationService, FileOperationsService fileOperationsService) {
		this.userService = userService;
		this.courseService = courseService;
		this.authorizationService = authorizationService;
		this.fileOperationsService = fileOperationsService;
	}

	private class AddAttendersByFileResponse {
		public Collection<User> attendersAdded;
		public Collection<User> attendersAlreadyAdded;
		public Collection<String> emailsValidNotRegistered;

		@Override
		public String toString() {
			return "[#Attenders added: " + attendersAdded.size() + ", #Attenders already added: "
					+ attendersAlreadyAdded.size() + ", #Emails valid but not registered: "
					+ emailsValidNotRegistered.size() + "]";
		}
	}

	private final UserService userService;
	private final CourseService courseService;
	private final AuthorizationService authorizationService;
	private final FileOperationsService fileOperationsService;

	FileReader fileReader = new FileReader();

	@RequestMapping(value = "/upload/course/{courseId}", method = RequestMethod.POST)
	public ResponseEntity<Object> handleFileReaderUpload(MultipartHttpServletRequest request,
			@PathVariable(value = "courseId") String courseId) throws IOException {

		log.info("Adding attenders from file");

		ResponseEntity<Object> authorized = authorizationService.checkBackendLogged();
		if (authorized != null) {
			return authorized;
		}
		;

		long id_course = -1;
		try {
			id_course = Long.parseLong(courseId);
		} catch (NumberFormatException e) {
			log.error("Course ID '{}' is not of type Long", courseId);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}

		Course c = courseService.getFromId(id_course);

		ResponseEntity<Object> teacherAuthorized = authorizationService.checkAuthorization(c, c.getTeacher());
		if (teacherAuthorized != null) { // If the user is not the teacher of the course
			return teacherAuthorized;
		} else {

			Iterator<String> i = request.getFileNames();
			while (i.hasNext()) {
				String name = i.next();
				MultipartFile file = request.getFile(name);

				if (file.isEmpty()) {
					log.error("The file is empty");
					throw new RuntimeException("The file is empty");
				}

				if (!Files.exists(FileController.FILES_FOLDER)) {
					log.debug("Creating local directory '{}'", FileController.FILES_FOLDER);
					Files.createDirectories(FileController.FILES_FOLDER);
				}

				String fileName = file.getOriginalFilename();
				File uploadedFile = new File(FileController.FILES_FOLDER.toFile(), fileName);

				file.transferTo(uploadedFile);
				
				AddAttendersByFileResponse response = null;
				
				try {
					log.info("Parsing file '{}'", fileName);
					response = this.addAttendersFromFile(c,
							this.fileReader.parseToPlainText(uploadedFile));
				} catch (Exception e) {
					log.error("Exception while parsing the file: {}", e.getMessage());
					fileOperationsService.deleteLocalFile(uploadedFile.getName(), FileController.FILES_FOLDER);
					e.printStackTrace();
				}
				
				log.info("File successfully parsed. Result: {}", response);
				
				fileOperationsService.deleteLocalFile(uploadedFile.getName(), FileController.FILES_FOLDER);
				return new ResponseEntity<>(response, HttpStatus.OK);
			}

			log.error("Empty file request");
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}

	private AddAttendersByFileResponse addAttendersFromFile(Course c, String s) {

		String[] stringArray = s.split("\\s");
		List<String> stringList = new ArrayList<String>(Arrays.asList(stringArray));
		stringList.removeAll(Arrays.asList("", null));

		// Strings with a valid email format
		Set<String> attenderEmailsValid = new HashSet<>();
		// Strings with a valid email format but no registered in the application
		Set<String> attenderEmailsNotRegistered = new HashSet<>();

		EmailValidator emailValidator = EmailValidator.getInstance();

		// Getting all the emails in the document and storing them in a String set
		for (String word : stringList) {
			if (emailValidator.isValid(word)) {
				attenderEmailsValid.add(word);
			}
		}

		Collection<User> newPossibleAttenders = userService.findByNameIn(attenderEmailsValid);
		Collection<User> newAddedAttenders = new HashSet<>();
		Collection<User> alreadyAddedAttenders = new HashSet<>();

		for (String email : attenderEmailsValid) {
			if (!this.userListContainsEmail(newPossibleAttenders, email)) {
				attenderEmailsNotRegistered.add(email);
			}
		}

		for (User attender : newPossibleAttenders) {
			boolean newAtt = true;
			if (!attender.getCourses().contains(c))
				attender.getCourses().add(c);
			else
				newAtt = false;
			if (!c.getAttenders().contains(attender))
				c.getAttenders().add(attender);
			else
				newAtt = false;
			if (newAtt)
				newAddedAttenders.add(attender);
			else
				alreadyAddedAttenders.add(attender);
		}

		// Saving the attenders (all of them, just in case a field of the bidirectional
		// relationship is missing in a Course or a User)
		userService.saveAll(newPossibleAttenders);
		// Saving the modified course
		courseService.save(c);

		AddAttendersByFileResponse customResponse = new AddAttendersByFileResponse();
		customResponse.attendersAdded = newAddedAttenders;
		customResponse.attendersAlreadyAdded = alreadyAddedAttenders;
		customResponse.emailsValidNotRegistered = attenderEmailsNotRegistered;

		return customResponse;
	}

	// Checks if a User collection contains a user with certain email
	private boolean userListContainsEmail(Collection<User> users, String email) {
		boolean isContained = false;
		for (User u : users) {
			if (u.getName().equals(email)) {
				isContained = true;
				break;
			}
		}
		return isContained;
	}
	
}
