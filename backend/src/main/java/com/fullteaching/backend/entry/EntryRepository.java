package com.fullteaching.backend.entry;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

public interface EntryRepository extends JpaRepository<Entry, Long> {

    Entry findById(long id);
}
