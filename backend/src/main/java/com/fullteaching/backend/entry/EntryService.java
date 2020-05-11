package com.fullteaching.backend.entry;

import com.fullteaching.backend.comment.Comment;
import com.fullteaching.backend.comment.CommentService;
import com.fullteaching.backend.struct.FTService;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;

@Service
@Slf4j
@Getter //this will override the interface method: getRepo()
public class EntryService implements FTService<Entry, Long> {

    private final EntryRepository repo;

    private final CommentService commentService;

    @Autowired
    public EntryService(EntryRepository repo, CommentService commentService) {
        this.repo = repo;
        this.commentService = commentService;
    }

    public Entry removeCommentAndChildren(Entry entry, Comment comment){
        Collection<Comment> children = this.commentService.getChildren(comment);
        children.add(comment);
        entry.getComments().removeAll(children);
        return this.save(entry);
    }
}
