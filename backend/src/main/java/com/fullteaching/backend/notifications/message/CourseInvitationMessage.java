package com.fullteaching.backend.notifications.message;

import com.fullteaching.backend.model.Course;
import com.fullteaching.backend.notifications.NotificationType;
import lombok.Getter;

@Getter
public class CourseInvitationMessage extends NotificationMessage{

    private final Course course;

    public CourseInvitationMessage(Course course) {
        super(NotificationType.COURSE_INVITATION);
        this.course = course;
    }
}
