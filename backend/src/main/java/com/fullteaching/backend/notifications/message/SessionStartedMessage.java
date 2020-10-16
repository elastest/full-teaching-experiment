package com.fullteaching.backend.notifications.message;

import com.fullteaching.backend.model.Course;
import com.fullteaching.backend.model.Session;
import com.fullteaching.backend.notifications.NotificationType;
import lombok.Getter;

@Getter
public class SessionStartedMessage extends NotificationMessage {

    private final Session session;
    private final Course sessionCourse;

    public SessionStartedMessage(Session session, Course sessionCourse) {
        super(NotificationType.SESSION_STARTED);
        this.session = session;
        this.sessionCourse = sessionCourse;
    }
}
