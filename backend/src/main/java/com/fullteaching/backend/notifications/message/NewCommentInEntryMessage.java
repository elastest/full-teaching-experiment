package com.fullteaching.backend.notifications.message;
import com.fullteaching.backend.model.Course;
import com.fullteaching.backend.model.Entry;
import com.fullteaching.backend.model.User;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class NewCommentInEntryMessage {
    private final Entry entry;
    private final User userCommenting;
    private final Course commentCourse;
}
