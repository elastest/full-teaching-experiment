package com.fullteaching.backend.service;

import com.fullteaching.backend.notifications.NotificationDispatcher;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class NotificationService {

    private final NotificationDispatcher dispatcher;

    @Autowired
    public NotificationService(NotificationDispatcher dispatcher) {
        this.dispatcher = dispatcher;
    }




}
