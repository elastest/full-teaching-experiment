package com.fullteaching.backend.forum;

import com.fullteaching.backend.entry.Entry;
import com.fullteaching.backend.struct.FTService;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Getter
@Service
@Slf4j
public class ForumService implements FTService<Forum, Long> {


    private final ForumRepository repo;


    @Autowired
    public ForumService(ForumRepository repo) {
        this.repo = repo;
    }

    public boolean removeEntry(Entry entry, Forum forum){
        forum.getEntries().remove(entry);
        this.getRepo().save(forum);
        log.info("Entry {} removed from forum {}", forum.getId(), entry.getId());
        return true;
    }

}
