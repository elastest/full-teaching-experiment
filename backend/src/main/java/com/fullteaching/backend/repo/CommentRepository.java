package com.fullteaching.backend.repo;

import com.fullteaching.backend.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    Comment findById(long id);
    Collection<Comment> getAllByCommentParent(Comment commentParent);
}
