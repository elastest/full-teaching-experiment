package com.fullteaching.backend.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class SessionStartedNotification extends Notification {

    @ManyToOne
    private Session session;

    public SessionStartedNotification(String message, User user, Session session) {
        super(message, user, session.getCourse(), NotificationType.SESSION_STARTED);
        this.session = session;
    }
}
