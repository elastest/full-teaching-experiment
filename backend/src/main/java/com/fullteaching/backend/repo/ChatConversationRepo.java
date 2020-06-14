package com.fullteaching.backend.repo;

import com.fullteaching.backend.model.ChatConversation;
import com.fullteaching.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;

@Repository
public interface ChatConversationRepo extends JpaRepository<ChatConversation, Long> {
    Collection<ChatConversation> findAllByUsersContaining(User user);
    Collection<ChatConversation> findAllByUsersContainingAndUsersContaining(User user1, User user2);
}
