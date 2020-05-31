package com.fullteaching.backend.repo;

import com.fullteaching.backend.model.Entry;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EntryRepository extends JpaRepository<Entry, Long> {

    Entry findById(long id);
}
