package com.fullteaching.backend.notifications.message;

import com.fullteaching.backend.notifications.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public abstract class NotificationMessage {
    private final NotificationType type;
}
