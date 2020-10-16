package com.fullteaching.backend.repo;

import com.fullteaching.backend.model.Notification;
import com.fullteaching.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.Collection;

@Repository
public interface NotificationRepo extends JpaRepository<Notification, Long> {
    Collection<Notification> findAllByUser(User user);
    @Transactional
    void removeAllByUser(User user);
}
