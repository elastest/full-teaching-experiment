package com.fullteaching.backend.notifications.message;

import com.fullteaching.backend.model.Comment;
import com.fullteaching.backend.model.User;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class NewCommentResponseMessage {
    private final Comment comment;
    private final User replier;
}
