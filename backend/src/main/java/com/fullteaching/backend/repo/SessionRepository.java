package com.fullteaching.backend.repo;

import com.fullteaching.backend.model.Session;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SessionRepository extends JpaRepository<Session, Long> {

    Session findById(long id);
}
