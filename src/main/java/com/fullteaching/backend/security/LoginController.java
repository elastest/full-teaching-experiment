package com.fullteaching.backend.security;

import javax.servlet.http.HttpSession;

import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fullteaching.backend.user.User;
import com.fullteaching.backend.user.UserComponent;

/**
 * This class is used to provide REST endpoints to logIn and logOut to the
 * service. These endpoints are used by Angular 2 SPA client application.
 * 
 * NOTE: This class is not intended to be modified by app developer.
 */
@RestController
@Slf4j
public class LoginController {

	private final UserComponent userComponent;

	@Autowired
	public LoginController(UserComponent userComponent) {
		this.userComponent = userComponent;
	}

	@RequestMapping("/api-logIn")
	public ResponseEntity<User> logIn() {
		
		log.info("Logging in ...");

		if (!userComponent.isLoggedUser()) {
			log.info("Not user logged");
			return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
		} else {
			User loggedUser = userComponent.getLoggedUser();
			log.info("Logged as {}", loggedUser.getName());
			return new ResponseEntity<>(loggedUser, HttpStatus.OK);
		}
	}

	@RequestMapping("/api-logOut")
	public ResponseEntity<Boolean> logOut(HttpSession session) {
		
		log.info("Logging out...");

		if (!userComponent.isLoggedUser()) {
			log.info("No user logged");
			return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
		} else {
			String name = userComponent.getLoggedUser().getName();
			session.invalidate();
			log.info("Logged out user {}", name);
			return new ResponseEntity<>(true, HttpStatus.OK);
		}
	}

}