package com.fullteaching.backend.notifications;

import com.fullteaching.backend.model.*;
import com.fullteaching.backend.notifications.message.*;
import com.fullteaching.backend.service.NotificationsService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.util.Collection;

@Log4j2
@Component
public class NotificationDispatcher {
    private final SimpMessagingTemplate template;
    private final String DESTINATION = "/queue/reply";
    private final NotificationsService notificationService;

    @Autowired
    public NotificationDispatcher(SimpMessagingTemplate template, NotificationsService notificationService) {
        this.template = template;
        this.notificationService = notificationService;
    }

    public void notifyInvitedToCourse(User user, Course course) {
        String name = user.getName();
        log.info("Notifying user {} that was invited to course {}", user.getName(), course.getTitle());
        this.template.convertAndSendToUser(name, DESTINATION, new CourseInvitationMessage(course));
        Notification notification = new CourseInvitationNotification("You were invited to course: " + course.getTitle(), user, course);
        this.notificationService.save(notification);
    }

    public void notifySessionStarted(Session session) {
        Course course = session.getCourse();
        Collection<User> attenders = course.getAttenders();
        for (User user : attenders) {
            this.template.convertAndSendToUser(user.getName(), DESTINATION, new SessionStartedMessage(session, course));
            Notification notification = new SessionStartedNotification("The session: " + session.getTitle() + " has started!", user, session);
            this.notificationService.save(notification);
        }
    }

    public void notifyCommentAdded(Entry entry, Comment comment, User userCommenting, Course commentCourse) {
        this.template.convertAndSendToUser(entry.getUser().getName(), DESTINATION, new NewCommentInEntryMessage(entry, userCommenting, commentCourse));
        Notification notification = new NewCommentInEntryNotification("The user: " + userCommenting.getName() + " just commented in your entry in course: " + commentCourse.getTitle(), entry.getUser(), entry, comment, commentCourse);
        this.notificationService.save(notification);
    }

    public void notifyCommentReply(Comment parent, User replier, Course commentCourse, Entry commentEnry, Comment comment) {
        this.template.convertAndSendToUser(parent.getUser().getName(), DESTINATION, new NewCommentResponseMessage(parent, replier, commentCourse, commentEnry));
        Notification notification = new NewReplyNotification("The user: " + replier.getName() + " just replied to your message in course: " + commentCourse.getTitle(), parent.getUser(), commentEnry, comment, commentCourse);
        this.notificationService.save(notification);
    }

    public void notifyNewChatMessage(ChatConversation chatConversation, User recipient) {
        this.template.convertAndSendToUser(recipient.getName(), DESTINATION, new ChatNotificationMessage(chatConversation));
    }
}
