package com.fullteaching.backend.notifications.message;

import com.fullteaching.backend.model.Course;
import com.fullteaching.backend.model.Entry;
import com.fullteaching.backend.model.User;
import com.fullteaching.backend.notifications.NotificationType;
import lombok.Getter;

@Getter
public class NewCommentInEntryMessage extends NotificationMessage {
    private final Entry entry;
    private final User userCommenting;
    private final Course commentCourse;

    public NewCommentInEntryMessage(Entry entry, User userCommenting, Course commentCourse) {
        super(NotificationType.COMMENT_IN_ENTRY);
        this.entry = entry;
        this.userCommenting = userCommenting;
        this.commentCourse = commentCourse;
    }
}
