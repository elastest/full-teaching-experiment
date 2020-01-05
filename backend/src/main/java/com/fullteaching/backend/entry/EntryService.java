package com.fullteaching.backend.entry;

import com.fullteaching.backend.struct.FTService;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@Getter //this will override the interface method: getRepo()
public class EntryService implements FTService<Entry, Long> {

    private final EntryRepository repo;

    @Autowired
    public EntryService(EntryRepository repo) {
        this.repo = repo;
    }
}
