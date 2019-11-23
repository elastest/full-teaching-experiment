package com.fullteaching.backend.file;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

public interface FileRepository extends JpaRepository<File, Long> {

    File findById(long id);
}
