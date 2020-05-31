package com.fullteaching.backend.repo;

import com.fullteaching.backend.model.Forum;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ForumRepository extends JpaRepository<Forum, Long> {

}
