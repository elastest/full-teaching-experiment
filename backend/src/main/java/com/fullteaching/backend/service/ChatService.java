package com.fullteaching.backend.service;

import com.fullteaching.backend.model.ChatConversation;
import com.fullteaching.backend.model.ChatMessage;
import com.fullteaching.backend.model.User;
import com.fullteaching.backend.notifications.NotificationDispatcher;
import com.fullteaching.backend.repo.ChatConversationRepo;
import com.fullteaching.backend.struct.FTService;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Objects;

@Service
@Getter
public class ChatService implements FTService<ChatConversation, Long> {

    private final ChatConversationRepo repo;
    private final ChatMessageService chatMessageService;
    private final NotificationDispatcher notificationDispatcher;

    @Autowired
    public ChatService(ChatConversationRepo repo, ChatMessageService chatMessageService, NotificationDispatcher notificationDispatcher) {
        this.repo = repo;
        this.chatMessageService = chatMessageService;
        this.notificationDispatcher = notificationDispatcher;
    }

    public Collection<ChatConversation> getAllFromUser(User user) {
        return this.getRepo().findAllByUsersContaining(user);
    }

    public ChatConversation sendMessage(ChatMessage message, ChatConversation chatConversation) {
        ChatMessage saved = this.chatMessageService.save(message);
        chatConversation.getMessages().add(saved);
        chatConversation = this.getRepo().save(chatConversation);

        // notify others
        for (User user : chatConversation.getUsers()) {
            if (!user.equals(message.getUser())) {
                this.notificationDispatcher.notifyNewChatMessage(chatConversation, user);
            }
        }
        return chatConversation;
    }

    public ChatConversation newConversation(User user, User recipient, ChatMessage firstMessage) {
        ChatConversation chatConversation = new ChatConversation();
        chatConversation.getUsers().add(user);
        chatConversation.getUsers().add(recipient);
        chatConversation = this.repo.save(chatConversation);
        return this.sendMessage(firstMessage, chatConversation);
    }

    public Collection<ChatConversation> getConversationsOfUserWithOther(User me, User user) {
        Collection<ChatConversation> conversations = this.getRepo().findAllByUsersContainingAndUsersContaining(me, user);
        if (conversations.isEmpty()) {
            ChatConversation chatConversation = new ChatConversation();
            chatConversation.getUsers().add(user);
            chatConversation.getUsers().add(me);
            chatConversation = this.getRepo().save(chatConversation);
            conversations.add(chatConversation);
        }
        return conversations;
    }

    public long getUnseenMessagesCount(User me, User other) {
        ChatConversation chatConversation = this.getConversationsOfUserWithOther(me, other).stream().findFirst().orElse(null);
        if(Objects.nonNull(chatConversation)){
            return chatConversation.getMessages()
                    .stream()
                    .filter(chatMessage -> chatMessage.getDateSeen() != null)
                    .count();
        }
        return 0;
    }
}
