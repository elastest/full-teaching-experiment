package com.fullteaching.backend.repo;

import com.fullteaching.backend.model.CourseInvitationNotification;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.transaction.Transactional;

public interface CourseInvitationNotificationRepo extends JpaRepository<CourseInvitationNotification, Long> {

    @Transactional
    void deleteAllByCourse_Id(long courseId);

}
