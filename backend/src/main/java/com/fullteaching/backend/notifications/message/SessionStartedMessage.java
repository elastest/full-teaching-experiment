package com.fullteaching.backend.notifications.message;

import com.fullteaching.backend.model.Course;
import com.fullteaching.backend.model.Session;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;

@Getter
@AllArgsConstructor
@EqualsAndHashCode
public class SessionStartedMessage {

    private final Session session;
    private final Course sessionCourse;

}
