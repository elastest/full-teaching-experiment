package com.fullteaching.backend.notifications;

import lombok.extern.java.Log;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import javax.management.Notification;
import java.util.HashSet;
import java.util.Set;

@Log4j2
@Component
public class NotificationDispatcher {
    private Set<String> listeners = new HashSet<>();
    private final SimpMessagingTemplate template;

    @Autowired
    public NotificationDispatcher(SimpMessagingTemplate template) {
        this.template = template;
    }

    public void add(String user){
        this.listeners.add(user);
    }

    @Scheduled(fixedDelay = 2000)
    public void dispatch() {
        for (String listener : listeners) {
            log.info("Sending notification to " + listener);
            SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor.create(SimpMessageType.MESSAGE);
            headerAccessor.setSessionId(listener);
            headerAccessor.setLeaveMutable(true);
            int value = (int) Math.round(Math.random() * 100d);
            template.convertAndSendToUser(
                    listener,
                    "/notification/item",
                    null,
                    headerAccessor.getMessageHeaders());
        }
    }

}
