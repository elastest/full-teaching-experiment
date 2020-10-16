package com.fullteaching.backend.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class NewReplyNotification extends Notification {

    @ManyToOne
    private Entry entry;

    @ManyToOne
    private Comment comment;

    public NewReplyNotification(String message, User user, Entry entry, Comment comment, Course course) {
        super(message, user, course, NotificationType.NEW_REPLY);
        this.entry = entry;
        this.comment = comment;
    }
}
