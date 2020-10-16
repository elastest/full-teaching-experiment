package com.fullteaching.backend.controller;

import com.fullteaching.backend.annotation.LoginRequired;
import com.fullteaching.backend.model.ChatConversation;
import com.fullteaching.backend.model.ChatMessage;
import com.fullteaching.backend.model.User;
import com.fullteaching.backend.security.user.UserComponent;
import com.fullteaching.backend.service.ChatService;
import com.fullteaching.backend.service.UserService;
import com.fullteaching.backend.view.UserChatView;
import lombok.extern.java.Log;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.Objects;

@RestController
@RequestMapping("/api-chat")
@Slf4j
public class ChatController {

    private final UserComponent userComponent;
    private final ChatService chatService;
    private final UserService userService;

    @Autowired
    public ChatController(UserComponent userComponent, ChatService chatService, UserService userService) {
        this.userComponent = userComponent;
        this.chatService = chatService;
        this.userService = userService;
    }

    @PutMapping("/messagesSeen/from/{from}/to/{to}")
    public ResponseEntity<Boolean> sawMessages(@PathVariable long from, @PathVariable long to){
        log.info("Updating messages seen from {} to {}", from, to);
        User userFrom = userService.getFromId(from);
        User userTo = userService.getFromId(to);
        boolean resp = this.chatService.messagesSeen(userFrom, userTo);
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/all/chatUsers")
    public ResponseEntity<Page<UserChatView>> getAllChatUsers(@RequestParam int page, @RequestParam int size){
        User me = this.userComponent.getLoggedUser();
        // gets all chat users relative to me
        Page<UserChatView> userChatViews = this.chatService.getAllChatUsers(me, page, size);
        return ResponseEntity.ok(userChatViews);
    }

    @GetMapping("/all/chatUsers/byName/{name}")
    public ResponseEntity<Page<UserChatView>> getAllChatUsers(@PathVariable String name, @RequestParam int page, @RequestParam int size){
        User me = this.userComponent.getLoggedUser();
        // gets all chat users relative to me
        Page<UserChatView> userChatViews = this.chatService.getAllChatUsersByName(me, name, page, size);
        return ResponseEntity.ok(userChatViews);
    }

    @GetMapping("/all")
    public ResponseEntity<Collection<ChatConversation>> getAll() {
        User user = this.userComponent.getLoggedUser();
        Collection<ChatConversation> chatConversations = this.chatService.getAllFromUser(user);
        return ResponseEntity.ok(chatConversations);
    }

    @PostMapping("/new/user/{userId}")
    public ResponseEntity<ChatConversation> newConversation(@PathVariable long userId, @RequestBody ChatMessage firstMessage) {

        User user = this.userComponent.getLoggedUser();
        User recipient = this.userService.getFromId(userId);

        if (Objects.nonNull(recipient)) {
            ChatConversation chatConversation = this.chatService.newConversation(user, recipient, firstMessage);
            return ResponseEntity.ok(chatConversation);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/conversation/withuser/{userId}")
    public ResponseEntity<Collection<ChatConversation>> getChatHistory(@PathVariable("userId") long userId) {
        User user = this.userService.getFromId(userId);
        User me = this.userComponent.getLoggedUser();
        Collection<ChatConversation> chatConversations = this.chatService.getConversationsOfUserWithOther(me, user);
        if (Objects.nonNull(chatConversations)) {
            return ResponseEntity.ok(chatConversations);
        } else {
            log.warn("No conversations with user: {} not found", userId);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/message/conversation/{id}")
    public ResponseEntity<ChatConversation> sendMessage(@PathVariable long id, @RequestBody ChatMessage chatMessage) {
        ChatConversation chatConversation = this.chatService.getFromId(id);
        if (Objects.nonNull(chatConversation)) {
            chatConversation = this.chatService.sendMessage(chatMessage, chatConversation);
            return ResponseEntity.ok(chatConversation);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/unseen/count/user/{userId}")
    public ResponseEntity<Long> getCountOfUnseenMessages(@PathVariable long userId){
        User me = this.userComponent.getLoggedUser();
        User other = this.userService.getFromId(userId);
        if(Objects.nonNull(other)){
            long unseen = this.chatService.getUnseenMessagesCount(me, other);
            return ResponseEntity.ok(unseen);
        }
        else{
            return ResponseEntity.notFound().build();
        }
    }

}
