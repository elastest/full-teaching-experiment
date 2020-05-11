package com.fullteaching.backend.comment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Collection;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    Comment findById(long id);
    Collection<Comment> getAllByCommentParent(Comment commentParent);
}
