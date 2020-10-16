package com.fullteaching.backend.repo;

import com.fullteaching.backend.model.FileGroup;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FileGroupRepository extends JpaRepository<FileGroup, Long> {


    FileGroup findById(long id);


}
