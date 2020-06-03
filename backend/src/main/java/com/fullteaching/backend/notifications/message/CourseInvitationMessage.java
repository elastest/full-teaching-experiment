package com.fullteaching.backend.notifications.message;

import com.fullteaching.backend.model.Course;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CourseInvitationMessage {

    private final Course course;

}
