package com.fullteaching.backend.controller;

import com.fullteaching.backend.annotation.LoginRequired;
import com.fullteaching.backend.model.User;
import com.fullteaching.backend.security.AuthorizationService;
import com.fullteaching.backend.security.user.UserComponent;
import com.fullteaching.backend.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.validator.routines.EmailValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.Objects;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api-users")
@Slf4j
public class UserController {

    private final UserService userService;
    private final UserComponent user;
    private final AuthorizationService authorizationService;

    //Between 8-20 characters long, at least one uppercase, one lowercase and one number
    private String passRegex = "^((?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,20})$";

    @Autowired
    public UserController(UserService userService, UserComponent user, AuthorizationService authorizationService) {
        this.userService = userService;
        this.user = user;
        this.authorizationService = authorizationService;
    }

    @GetMapping("/all")
    public ResponseEntity<Page<User>> getAll(@RequestParam int page, @RequestParam int size){
        Page<User> response = this.userService.getall(page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/byName/{name}")
    public ResponseEntity<Page<User>> getByName(@PathVariable String name, @RequestParam int page, @RequestParam int size){
        Page<User> response = this.userService.getByname(name, page, size);
        return ResponseEntity.ok(response);
    }

    //userData: [name, pass, nickName, captchaToken]
    @RequestMapping(value = "/new", method = RequestMethod.POST)
    public ResponseEntity<User> newUser(@RequestBody String[] userData) throws Exception {

        log.info("Signing up a user...");

        //If the email is not already in use
        if (!this.userService.existsByName(userData[0])) {

            //If the password has a valid format (at least 8 characters long and contains one uppercase, one lowercase and a number)
            if (userData[1].matches(this.passRegex)) {

                //If the email has a valid format
                if (EmailValidator.getInstance().isValid(userData[0])) {
                    log.info("Email, password and captcha are valid");
                    User newUser = new User(userData[0], userData[1], userData[2], "", "ROLE_STUDENT");
                    userService.save(newUser);
                    log.info("User successfully signed up");

                    return new ResponseEntity<>(newUser, HttpStatus.CREATED);
                } else {
                    log.error("Email NOT valid");
                    return new ResponseEntity<>(HttpStatus.FORBIDDEN);
                }
            } else {
                log.error("Password NOT valid");
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

        } else {
            log.error("Email already in use");
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
    }

    //userData: [oldPassword, newPassword]
    @RequestMapping(value = "/changePassword", method = RequestMethod.PUT)
    public ResponseEntity<Object> changePassword(@RequestBody String[] userData) {

        log.info("Updating password...");

        ResponseEntity<Object> authorized = authorizationService.checkBackendLogged();
        if (authorized != null) {
            return authorized;
        }
        ;

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        //If the stored current password and the given current password match
        if (encoder.matches(userData[0], user.getLoggedUser().getPasswordHash())) {

            //If the password has a valid format (at least 8 characters long and contains one uppercase, one lowercase and a number)
            if (userData[1].matches(this.passRegex)) {
                User modifiedUser = userService.getByEmail(user.getLoggedUser().getName());
                modifiedUser.setPasswordHash(encoder.encode(userData[1]));
                userService.save(modifiedUser);

                log.info("Password successfully updated");

                return new ResponseEntity<>(true, HttpStatus.OK);
            } else {
                log.error("New password NOT valid");
                return new ResponseEntity<>(HttpStatus.NOT_MODIFIED);
            }
        } else {
            log.error("Invalid current password");
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
    }


    @RequestMapping(value = "/isRegistered/{emails}", method = RequestMethod.GET)
    public ResponseEntity<?> isEmailRegistered(@PathVariable("email") String email) {
        User user = this.userService.getByEmail(email);
        if (Objects.nonNull(user)) {
            return ResponseEntity.ok(true);
        } else {
            return ResponseEntity.ok(false);
        }
    }

}
