package com.fullteaching.backend.notifications;

import com.fullteaching.backend.model.*;
import com.fullteaching.backend.notifications.message.CourseInvitationMessage;
import com.fullteaching.backend.notifications.message.NewCommentInEntryMessage;
import com.fullteaching.backend.notifications.message.NewCommentResponseMessage;
import com.fullteaching.backend.notifications.message.SessionStartedMessage;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.util.Collection;

@Log4j2
@Component
public class NotificationDispatcher {
    private final SimpMessagingTemplate template;

    @Autowired
    public NotificationDispatcher(SimpMessagingTemplate template) {
        this.template = template;
    }

    public void notifyInvitedToCourse(User user, Course course) {
        String name = user.getName();
        log.info("Notifying user {} that was invited to course {}", user.getName(), course.getTitle());
        this.template.convertAndSendToUser(name, "/queue/reply", new CourseInvitationMessage(course));
    }

    public void notifySessionStarted(Session session){
        Course course = session.getCourse();
        Collection<User> attenders = course.getAttenders();
        for(User user : attenders){
            this.template.convertAndSendToUser(user.getName(), "/queue/reply", new SessionStartedMessage(session, course));
        }
    }

    public void notifyCommentAdded(Entry entry, User userCommenting, Course commentCourse){
        this.template.convertAndSendToUser(entry.getUser().getName(), "/queue/reply", new NewCommentInEntryMessage(entry, userCommenting, commentCourse));
    }

    public void notifyCommentReply(Comment parent, User replier, Course commentCourse, Entry commentEnry){
        this.template.convertAndSendToUser(parent.getUser().getName(), "/queue/reply", new NewCommentResponseMessage(parent, replier, commentCourse, commentEnry));
    }
}
