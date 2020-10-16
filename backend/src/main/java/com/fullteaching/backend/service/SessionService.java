package com.fullteaching.backend.service;

import com.fullteaching.backend.model.Session;
import com.fullteaching.backend.repo.SessionNotificationRepo;
import com.fullteaching.backend.repo.SessionRepository;
import com.fullteaching.backend.struct.FTService;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@Getter
public class SessionService implements FTService<Session, Long> {

    private final SessionRepository repo;
    private final SessionNotificationRepo sessionNotificationRepo;

    @Autowired
    public SessionService(SessionRepository repo, SessionNotificationRepo sessionNotificationRepo) {
        this.repo = repo;
        this.sessionNotificationRepo = sessionNotificationRepo;
    }


    @Override
    public void deleteById(Long sessId) {
        sessionNotificationRepo.deleteAllBySession_Id(sessId);
        this.repo.deleteById(sessId);
    }

    @Override
    public void deleteAll(Iterable<Session> entities) {
        for (Session session : entities){
            this.delete(session);
        }
    }

    @Override
    public void delete(Session entity) {
        this.deleteById(entity.getId());
    }
}
