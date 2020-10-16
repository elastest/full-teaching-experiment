package com.fullteaching.backend.notifications.message;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fullteaching.backend.model.ChatConversation;
import com.fullteaching.backend.notifications.NotificationType;
import lombok.Getter;

@Getter
public class ChatNotificationMessage extends NotificationMessage {
    @JsonIgnoreProperties("users")
    private final ChatConversation chatConversation;

    public ChatNotificationMessage(ChatConversation chatConversation) {
        super(NotificationType.CHAT_MESSAGE);
        this.chatConversation = chatConversation;
    }
}
