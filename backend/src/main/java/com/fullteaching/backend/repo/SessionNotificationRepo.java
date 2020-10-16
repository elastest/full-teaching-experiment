package com.fullteaching.backend.repo;

import com.fullteaching.backend.model.Session;
import com.fullteaching.backend.model.SessionStartedNotification;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.transaction.Transactional;

public interface SessionNotificationRepo extends JpaRepository<SessionStartedNotification, Long> {

    @Transactional
    void deleteAllBySession_Id(Long sessionId);

}
