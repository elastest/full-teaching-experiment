package com.fullteaching.backend.service;

import com.fullteaching.backend.model.ChatConversation;
import com.fullteaching.backend.model.ChatMessage;
import com.fullteaching.backend.model.User;
import com.fullteaching.backend.notifications.NotificationDispatcher;
import com.fullteaching.backend.repo.ChatConversationRepo;
import com.fullteaching.backend.struct.FTService;
import com.fullteaching.backend.view.UserChatView;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Getter
@Slf4j
public class ChatService implements FTService<ChatConversation, Long> {

    private final ChatConversationRepo repo;
    private final ChatMessageService chatMessageService;
    private final NotificationDispatcher notificationDispatcher;
    private final UserService userService;

    @Autowired
    public ChatService(ChatConversationRepo repo, ChatMessageService chatMessageService, NotificationDispatcher notificationDispatcher, UserService userService) {
        this.repo = repo;
        this.chatMessageService = chatMessageService;
        this.notificationDispatcher = notificationDispatcher;
        this.userService = userService;
    }

    private Page<UserChatView> convertToUserChatView(Page<User> usersPage, User me) {
        List<UserChatView> userChatViews = usersPage
                .stream()
                .filter(user -> user.getId() != me.getId()) // prevent from sending me as a chat view
                .map(user -> {
                    long unseen = this.getUnseenMessagesCount(me, user);
                    return new UserChatView(user, unseen);
                })
                .collect(Collectors.toList());
        return new PageImpl<>(userChatViews, usersPage.getPageable(), usersPage.getTotalElements());
    }

    public Page<UserChatView> getAllChatUsers(User me, int page, int size) {
        Page<User> usersPage = this.userService.getall(page, size);
        return this.convertToUserChatView(usersPage, me);
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
        if (Objects.nonNull(chatConversation)) {
            return chatConversation.getMessages()
                    .stream()
                    .filter(chatMessage -> chatMessage.getDateSeen() == null)
                    .count();
        }
        return 0;
    }

    public Page<UserChatView> getAllChatUsersByName(User me, String name, int page, int size) {
        Page<User> userPage = this.userService.getByname(name, page, size);
        return this.convertToUserChatView(userPage, me);
    }

    public boolean messagesSeen(User userFrom, User userTo) {
        Collection<ChatConversation> chatConversations = this.getRepo().findAllByUsersContainingAndUsersContaining(userFrom, userTo);
        for (ChatConversation conversation : chatConversations) {

            Collection<ChatMessage> messages = new HashSet<>();

            for(ChatMessage message : conversation.getMessages()){
                if(Objects.isNull(message.getDateSeen()) && message.getUser().getId() == userFrom.getId()){
                    message.setDateSeen(new Date());
                    messages.add(message);
                }
            }

            this.chatMessageService.saveAll(messages);
            log.info("Seen date updated for {} messages", messages.size());
        }
        return true;
    }
}
