package com.fullteaching.backend.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import com.fullteaching.backend.annotation.LoginRequired;
import com.fullteaching.backend.annotation.RoleFilter;
import com.fullteaching.backend.service.CourseService;
import com.fullteaching.backend.service.CourseDetailsService;
import com.fullteaching.backend.file.*;
import com.fullteaching.backend.model.File;
import com.fullteaching.backend.model.FileGroup;
import com.fullteaching.backend.service.FileGroupService;
import com.fullteaching.backend.service.FileService;
import com.fullteaching.backend.struct.Role;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fullteaching.backend.model.Course;
import com.fullteaching.backend.model.CourseDetails;
import com.fullteaching.backend.security.AuthorizationService;
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api-files")
@Slf4j
public class FileGroupController {
	
	
	private final FileGroupService fileGroupService;
	private final FileService fileService;
	private final CourseService courseService;
	private final CourseDetailsService courseDetailsService;
	private final AuthorizationService authorizationService;
	private final FileOperationsService fileOperationsService;
	
	@Value("${profile.stage}")
    private String profileStage;

	public FileGroupController(FileGroupService fileGroupService, FileService fileService, CourseService courseService, CourseDetailsService courseDetailsService, AuthorizationService authorizationService, FileOperationsService fileOperationsService) {
		this.fileGroupService = fileGroupService;
		this.fileService = fileService;
		this.courseService = courseService;
		this.courseDetailsService = courseDetailsService;
		this.authorizationService = authorizationService;
		this.fileOperationsService = fileOperationsService;
	}

	@RoleFilter(role = Role.TEACHER)
	@PostMapping("/web-link/{courseId}/{fileGroupId}")
	public ResponseEntity<?> addNewWebLink(@PathVariable long courseId, @PathVariable long fileGroupId, @RequestBody File file){

		Course course = this.courseService.getFromId(courseId);
		FileGroup fileGroup = this.fileGroupService.getFromId(fileGroupId);

		if(Objects.isNull(fileGroup) || Objects.isNull(course)){
			log.info("Course or filegroup not found!");
			return ResponseEntity.notFound().build();
		}

		log.info("Adding new web-link to course!");
		ResponseEntity<Object> teacherAuthorized = authorizationService.checkAuthorization(course, course.getTeacher());

		if(Objects.nonNull(teacherAuthorized)){
			log.info("Teacher unathorized");
			return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
		}

		try {
			FileGroup toReturn = this.fileGroupService.addWebLink(fileGroup, file);
			return ResponseEntity.ok(toReturn);
		}
		catch (Exception e){
			log.error("Error adding web-link", e);
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.POST)
	public ResponseEntity<Object> newFileGroup(@RequestBody FileGroup fileGroup, @PathVariable(value="id") String courseDetailsId) {
		
		log.info("CRUD operation: Adding new file group");

		long id_i = -1;
		try {
			id_i = Long.parseLong(courseDetailsId);
		} catch(NumberFormatException e){
			log.error("CourseDetails ID '{}' is not of type Long", courseDetailsId);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		
		CourseDetails cd = courseDetailsService.getFromId(id_i);
		
		ResponseEntity<Object> teacherAuthorized = authorizationService.checkAuthorization(cd, cd.getCourse().getTeacher());
		if (teacherAuthorized != null) { // If the user is not the teacher of the course
			return teacherAuthorized;
		} else {
		
			//fileGroup is a root FileGroup
			if (fileGroup.getFileGroupParent() == null){
				cd.getFiles().add(fileGroup);
				/*Saving the modified courseDetails: Cascade relationship between courseDetails
				  and fileGroups will add the new fileGroup to fileGroupService*/
				courseDetailsService.save(cd);
				
				log.info("New root file group succesfully added: {}", fileGroup.toString());
				
				/*Entire courseDetails is returned*/
				return new ResponseEntity<>(cd, HttpStatus.CREATED);
			}
			
			//fileGroup is a child of an existing FileGroup
			else{
				FileGroup fParent = fileGroupService.getFromId(fileGroup.getFileGroupParent().getId());
				if(fParent != null){
					fParent.getFileGroups().add(fileGroup);
					/*Saving the modified parent FileGroup: Cascade relationship between FileGroup and 
					 its FileGroup children will add the new fileGroup to fileGroupService*/
					fileGroupService.save(fParent);
					CourseDetails cd2 = courseDetailsService.getFromId(id_i);
					
					log.info("New file sub-group succesfully added: {}", fileGroup.toString());
					
					/*Entire courseDetails is returned*/
					return new ResponseEntity<>(cd2, HttpStatus.CREATED);
				}else{
					return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
				}
			}
		}
	}
	
	
	@RequestMapping(value = "/edit/file-group/course/{courseId}", method = RequestMethod.PUT)
	public ResponseEntity<Object> modifyFileGroup(@RequestBody FileGroup fileGroup, @PathVariable(value="courseId") String courseId) {
		
		log.info("CRUD operation: Updating filegroup");
		
		ResponseEntity<Object> authorized = authorizationService.checkBackendLogged();
		if (authorized != null){
			return authorized;
		};
		
		long id_course = -1;
		try{
			id_course = Long.parseLong(courseId);
		}catch(NumberFormatException e){
			log.error("Course ID '{}' is not of type Long", courseId);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		
		Course c = courseService.getFromId(id_course);
		
		ResponseEntity<Object> teacherAuthorized = authorizationService.checkAuthorization(c, c.getTeacher());
		if (teacherAuthorized != null) { // If the user is not the teacher of the course
			return teacherAuthorized;
		} else {
		
			FileGroup fg = fileGroupService.getFromId(fileGroup.getId());
			
			if (fg != null){
				
				log.info("Updating filegroup. Previous value: {}", fg.toString());
				
				fg.setTitle(fileGroup.getTitle());

				// save new files
				for(File tmp : fileGroup.getFiles()){
					if(!fg.getFiles().contains(tmp)){
						File file = this.fileService.save(tmp);
						fg.getFiles().add(file);
					}
				}

				fileGroupService.save(fg);
				
				log.info("FileGroup succesfully updated. Modified value: {}", fg.toString());
				
				//Returning the root FileGroup of the added file
				return new ResponseEntity<>(this.getRootFileGroup(fg), HttpStatus.OK);
			} else {
				log.error("FileGroup with id '{}' doesn't exist", fileGroup.getId());
				return new ResponseEntity<>(HttpStatus.NOT_FOUND); 
			}
		}
	}
	
	
	@RequestMapping(value = "/delete/file-group/{fileGroupId}/course/{courseId}", method = RequestMethod.DELETE)
	public ResponseEntity<Object> deleteFileGroup(
			@PathVariable(value="fileGroupId") String fileGroupId,
			@PathVariable(value="courseId") String courseId
	) {
		
		log.info("CRUD operation: Deleting filegroup");
		
		ResponseEntity<Object> authorized = authorizationService.checkBackendLogged();
		if (authorized != null){
			return authorized;
		};
		
		long id_fileGroup = -1;
		long id_course = -1;
		try {
			id_fileGroup = Long.parseLong(fileGroupId);
			id_course = Long.parseLong(courseId);
		} catch(NumberFormatException e){
			log.error("Course ID '{}' or FileGroup ID '{}' are not of type Long", courseId, fileGroupId);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		
		
		Course c = courseService.getFromId(id_course);
		
		ResponseEntity<Object> teacherAuthorized = authorizationService.checkAuthorization(c, c.getTeacher());
		if (teacherAuthorized != null) { // If the user is not the teacher of the course
			return teacherAuthorized;
		} else {
		
			FileGroup fg = fileGroupService.getFromId(id_fileGroup);
			
			if (fg != null){
				
				log.info("Deleting filegroup: {}", fg.toString());
				
				if (this.isProductionStage()){
					//Removing all the S3 stored files of the tree structure...
					for (File f : fg.getFiles()){
						fileOperationsService.deleteRemoteFile(f.getNameIdent(), "/files");
					}
					fileOperationsService.recursiveS3StoredFileDeletion(fg.getFileGroups());
				}
				else {
					//Removing all the locally stored files of the tree structure...
					for (File f : fg.getFiles()){
						fileOperationsService.deleteLocalFile(f.getNameIdent(), FileController.FILES_FOLDER);
					}
					fileOperationsService.recursiveLocallyStoredFileDeletion(fg.getFileGroups());
				}
				
				//It is necessary to remove the FileGroup from the CourseDetails that owns it
				CourseDetails cd = c.getCourseDetails();
				cd.getFiles().remove(fg);
				courseDetailsService.save(cd);
				fileGroupService.delete(fg);
				
				log.info("Filegroup successfully deleted");
				
				return new ResponseEntity<>(fg, HttpStatus.OK);
			}
			else{
				return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
			}
		}
	}
	
	
	@RequestMapping(value = "/edit/file-order/course/{courseId}/file/{fileId}/from/{sourceID}/to/{targetId}/pos/{position}", method = RequestMethod.PUT)
	public ResponseEntity<Object> editFileOrder(
			@PathVariable(value="courseId") String courseId,
			@PathVariable(value="fileId") String fileId,
			@PathVariable(value="sourceID") String sourceId,
			@PathVariable(value="targetId") String targetId,
			@PathVariable(value="position") String position
		) {
		
		log.info("CRUD operation: Editing file order in filegroup");
		
		ResponseEntity<Object> authorized = authorizationService.checkBackendLogged();
		if (authorized != null){
			return authorized;
		};
		
		long id_course = -1;
		long id_file = -1;
		long id_source = -1;
		long id_target = -1;
		int pos = 0;
		try{
			id_course = Long.parseLong(courseId);
			id_file = Long.parseLong(fileId);
			id_source = Long.parseLong(sourceId);
			id_target = Long.parseLong(targetId);
			pos = Integer.parseInt(position);
		}catch(NumberFormatException e){
			log.error("Course ID '{}' or File ID '{}' or source ID '{}' or target ID '{}' are not of type Long; or position is not of type Integer",
					courseId, fileId, sourceId, targetId, pos);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		
		Course c = courseService.getFromId(id_course);
		
		ResponseEntity<Object> teacherAuthorized = authorizationService.checkAuthorization(c, c.getTeacher());
		if (teacherAuthorized != null) { // If the user is not the teacher of the course
			return teacherAuthorized;
		} else {
		
			FileGroup sourceFg = fileGroupService.getFromId(id_source);
			FileGroup targetFg = fileGroupService.getFromId(id_target);
			File fileMoved = fileService.getFromId(id_file);
			
			log.info("Moving file {} from filegroup {} to filegroup {} into position {}", fileMoved, sourceFg, targetFg, pos);
			
			sourceFg.getFiles().remove(fileMoved);
			targetFg.getFiles().add(pos, fileMoved);
			
			sourceFg.updateFileIndexOrder();
			targetFg.updateFileIndexOrder();
			
			List<FileGroup> l = new ArrayList<>();
			l.add(sourceFg);
			l.add(targetFg);
			fileGroupService.saveAll(l);
			
			log.info("File order succesfully updated");
			
			//Returning the FileGroups of the course
			return new ResponseEntity<>(c.getCourseDetails().getFiles(), HttpStatus.OK);
		}
	}
	
	
	@RequestMapping(value = "/edit/file/file-group/{fileGroupId}/course/{courseId}", method = RequestMethod.PUT)
	public ResponseEntity<Object> modifyFile(
			@RequestBody File file,
			@PathVariable(value="fileGroupId") String fileGroupId,
			@PathVariable(value="courseId") String courseId) 
	{
		
		log.info("CRUD operation: Updating file");
		
		ResponseEntity<Object> authorized = authorizationService.checkBackendLogged();
		if (authorized != null){
			return authorized;
		};
		
		long id_fileGroup = -1;
		long id_course = -1;
		try{
			id_fileGroup = Long.parseLong(fileGroupId);
			id_course = Long.parseLong(courseId);
		}catch(NumberFormatException e){
			log.error("Course ID '{}' or FileGroup ID '{}' are not of type Long", courseId, fileGroupId);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		
		Course c = courseService.getFromId(id_course);
		
		ResponseEntity<Object> teacherAuthorized = authorizationService.checkAuthorization(c, c.getTeacher());
		if (teacherAuthorized != null) { // If the user is not the teacher of the course
			return teacherAuthorized;
		} else {
		
			FileGroup fg = fileGroupService.getFromId(id_fileGroup);
			
			if (fg != null){
				for (int i = 0; i < fg.getFiles().size(); i++){
					if (fg.getFiles().get(i).getId() == file.getId()){
						
						log.info("Updating file. Previous value: {}", fg.getFiles().get(i));
						
						fg.getFiles().get(i).setName(file.getName());
						fileGroupService.save(fg);
						
						log.info("File succesfully updated. Modified value: {}", fg.getFiles().get(i));
						
						//Returning the root FileGroup of the added file
						return new ResponseEntity<>(this.getRootFileGroup(fg), HttpStatus.OK);
					}
				}
				
				log.error("File not found");
				return new ResponseEntity<>(HttpStatus.NOT_MODIFIED); 
			} else {
				log.error("FileGroup not found");
				return new ResponseEntity<>(HttpStatus.NOT_MODIFIED); 
			}
		}
	}
	
	
	@RequestMapping(value = "/delete/file/{fileId}/file-group/{fileGroupId}/course/{courseId}", method = RequestMethod.DELETE)
	public ResponseEntity<Object> deleteFile(
			@PathVariable(value="fileId") String fileId,
			@PathVariable(value="fileGroupId") String fileGroupId,
			@PathVariable(value="courseId") String courseId
	) {
		
		log.info("CRUD operation: Deleting file");
		
		ResponseEntity<Object> authorized = authorizationService.checkBackendLogged();
		if (authorized != null){
			return authorized;
		};
		
		long id_file = -1;
		long id_fileGroup = -1;
		long id_course = -1;
		try {
			id_file = Long.parseLong(fileId);
			id_fileGroup = Long.parseLong(fileGroupId);
			id_course = Long.parseLong(courseId);
		} catch(NumberFormatException e) {
			log.error("Course ID '{}' or FileGroup ID '{}' or File ID '{}' are not of type Long", courseId, fileGroupId, fileId);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		
		Course c = courseService.getFromId(id_course);
		
		ResponseEntity<Object> teacherAuthorized = authorizationService.checkAuthorization(c, c.getTeacher());
		if (teacherAuthorized != null) { // If the user is not the teacher of the course
			return teacherAuthorized;
		} else {
		
			FileGroup fg = fileGroupService.getFromId(id_fileGroup);
			
			if (fg != null){
				File file = null;
				for(File f : fg.getFiles()) {
			        if(f.getId() == id_file) {
			            file = f;
			            break;
			        }
			    }
				if (file != null){
					
					log.info("Deleting file: {}", file.toString());
					
					if (this.isProductionStage()){
						//ONLY ON PRODUCTION
						//Deleting S3 stored file...
						fileOperationsService.deleteRemoteFile(file.getNameIdent(), "/files");
						//ONLY ON PRODUCTION
					} else {
						//ONLY ON DEVELOPMENT
						//Deleting locally stored file...
						fileOperationsService.deleteLocalFile(file.getNameIdent(), FileController.FILES_FOLDER);
						//ONLY ON DEVELOPMENT
					}
					
					fg.getFiles().remove(file);
					fg.updateFileIndexOrder();
					
					fileGroupService.save(fg);
					
					log.info("File successfully deleted");
					
					return new ResponseEntity<>(file, HttpStatus.OK);
					
				}else{
					//The file to delete does not exist or does not have a fileGroup parent
					fileService.deleteById(id_file);
					return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
				}
			}else{
				//The fileGroup parent does not exist
				fileService.deleteById(id_file);
				return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
			}
		}
	}
	
	//Method to get the root FileGroup of a FileGroup tree structure, given a FileGroup
	private FileGroup getRootFileGroup(FileGroup fg) {
		while(fg.getFileGroupParent() != null){
			fg = fg.getFileGroupParent();
		}
		return fg;
	}
	
	private boolean isProductionStage(){
		return this.profileStage.equals("prod");
	}

}
