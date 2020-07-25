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
public class NewCommentInEntryNotification extends Notification {

    @ManyToOne
    private Entry entry;

    @ManyToOne
    private Comment comment;

    public NewCommentInEntryNotification(String message, User user, Entry entry, Comment comment, Course course) {
        super(message, user, course, NotificationType.NEW_COMMENT_IN_ENTRY);
        this.entry = entry;
        this.comment = comment;
    }
}
