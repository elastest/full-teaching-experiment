package com.fullteaching.backend.controller;

import com.fullteaching.backend.annotation.LoginRequired;
import com.fullteaching.backend.model.Notification;
import com.fullteaching.backend.security.AuthorizationService;
import com.fullteaching.backend.security.user.UserComponent;
import com.fullteaching.backend.service.NotificationsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.Objects;

@RestController
@RequestMapping("/api-notifications")
@Slf4j
public class NotificationsController extends SecureController {

    private final NotificationsService notificationService;

    @Autowired
    public NotificationsController(NotificationsService notificationService, UserComponent userComponent, AuthorizationService authorizationService) {
        super(userComponent, authorizationService);
        this.notificationService = notificationService;
    }

    @GetMapping("/all")
    @LoginRequired
    public ResponseEntity<Collection<Notification>> getAll() {
        log.info("Getting all notifications from user: {}", this.user.getLoggedUser().getName());
        return ResponseEntity.ok(this.notificationService.getAllFromUser(user.getLoggedUser()));
    }

    @DeleteMapping("/all")
    @LoginRequired
    public ResponseEntity<?> removeAllNotifications() {
        try {
            this.notificationService.unseeAll(user.getLoggedUser());
            return ResponseEntity
                    .ok()
                    .build();
        } catch (Exception e) {
            log.error("Error removing all notifications", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/byId/{id}")
    @LoginRequired
    public ResponseEntity<?> removeById(@PathVariable long id) {
        try {

            Notification notification = notificationService.getFromId(id);

            ResponseEntity<?> unauthorized = authorizationService.checkAuthorization(notification, notification.getUser());
            if (Objects.nonNull(unauthorized)) {
                log.warn("User {} is not authorized to unsee notification: {}", user.getLoggedUser().getName(), id);
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }

            this.notificationService.unsee(id);
            return ResponseEntity
                    .ok()
                    .build();
        } catch (Exception e) {
            log.error("Error removing all notifications", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}
