package com.fullteaching.backend.notifications.message;

import com.fullteaching.backend.model.Comment;
import com.fullteaching.backend.model.Course;
import com.fullteaching.backend.model.Entry;
import com.fullteaching.backend.model.User;
import com.fullteaching.backend.notifications.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
public class NewCommentResponseMessage extends NotificationMessage{
    private final Comment comment;
    private final User replier;
    private final Course commentCourse;
    private final Entry commentEntry;

    public NewCommentResponseMessage(Comment comment, User replier, Course commentCourse, Entry commentEntry) {
        super(NotificationType.COMMENT_REPLY);
        this.comment = comment;
        this.replier = replier;
        this.commentCourse = commentCourse;
        this.commentEntry = commentEntry;
    }
}
