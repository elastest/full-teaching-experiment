package com.fullteaching.backend.service;

import com.fullteaching.backend.model.ChatMessage;
import com.fullteaching.backend.repo.ChatMessageRepo;
import com.fullteaching.backend.struct.FTService;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Getter
public class ChatMessageService implements FTService<ChatMessage, Long> {

    private final ChatMessageRepo repo;

    @Autowired
    public ChatMessageService(ChatMessageRepo repo) {
        this.repo = repo;
    }
}
