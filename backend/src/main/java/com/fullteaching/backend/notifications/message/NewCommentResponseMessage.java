package com.fullteaching.backend.notifications.message;

import com.fullteaching.backend.model.Comment;
import com.fullteaching.backend.model.Course;
import com.fullteaching.backend.model.Entry;
import com.fullteaching.backend.model.User;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class NewCommentResponseMessage {
    private final Comment comment;
    private final User replier;
    private final Course commentCourse;
    private final Entry commentEntry;
}
