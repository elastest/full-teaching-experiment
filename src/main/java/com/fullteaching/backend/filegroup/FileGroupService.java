package com.fullteaching.backend.filegroup;

import com.fullteaching.backend.struct.FTService;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@Getter
public class FileGroupService implements FTService<FileGroup, Long> {

    private final FileGroupRepository repo;


    public FileGroupService(FileGroupRepository repo) {
        this.repo = repo;
    }
}
