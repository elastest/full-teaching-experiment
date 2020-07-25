package com.fullteaching.backend.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.util.Date;

@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name="descriminatorColumn")
@Table(name="notification")
public abstract class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    private String message;
    @ManyToOne
    private User user;
    private Date date;
    @Enumerated(EnumType.ORDINAL)
    private NotificationType type;
    @ManyToOne
    private Course course;

    public Notification(String message, User user, Course course, NotificationType type) {
        this.message = message;
        this.user = user;
        this.course = course;
        this.date = new Date();
        this.type = type;
    }
}
