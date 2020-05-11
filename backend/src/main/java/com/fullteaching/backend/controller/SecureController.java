package com.fullteaching.backend.controller;

import com.fullteaching.backend.security.AuthorizationService;
import com.fullteaching.backend.user.User;
import com.fullteaching.backend.user.UserComponent;
import org.springframework.http.ResponseEntity;

import java.util.Objects;

public abstract class SecureController {

    private final UserComponent userComponent;
    private final AuthorizationService authorizationService;

    public SecureController(UserComponent userComponent, AuthorizationService authorizationService) {
        this.userComponent = userComponent;
        this.authorizationService = authorizationService;
    }

    public ResponseEntity<?> authorize(Object...args){
        if(Objects.nonNull(args)){
            Object authObject = args[0];
            User user = this.userComponent.getLoggedUser();
            return this.authorizationService.checkAuthorization(authObject, user);
        }
        else{
            return this.authorizationService.checkBackendLogged();
        }
    }
}
