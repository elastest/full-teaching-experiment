package com.fullteaching.backend.comment;

import com.fullteaching.backend.struct.FTService;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Getter
@Slf4j
public class CommentService implements FTService<Comment, Long> {
    private final CommentRepository repo;

    @Autowired
    public CommentService(CommentRepository repo) {
        this.repo = repo;
    }
}
