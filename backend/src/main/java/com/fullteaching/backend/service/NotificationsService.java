package com.fullteaching.backend.service;

import com.fullteaching.backend.model.Notification;
import com.fullteaching.backend.model.User;
import com.fullteaching.backend.repo.NotificationRepo;
import com.fullteaching.backend.struct.FTService;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collection;

@Service
@Getter
@Slf4j
public class NotificationsService implements FTService<Notification, Long> {

    private final NotificationRepo repo;

    @Autowired
    public NotificationsService(NotificationRepo repo) {
        this.repo = repo;
    }

    public Collection<Notification> getAllFromUser(User user) {
        return this.getRepo().findAllByUser(user);
    }

    public void unseeAll(User user) {
        log.info("Removing all notifications of user: {}", user.getName());
        this.repo.removeAllByUser(user);
    }

    public void unsee(long notificationId) {
        log.info("Removing notification: {}", notificationId);
        this.repo.deleteById(notificationId);
        log.info("Notification {} successfully removed!", notificationId);
    }

}
