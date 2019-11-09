package com.fullteaching.backend.file;

import com.fullteaching.backend.struct.FTService;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@Getter
public class FileService implements FTService<File, Long> {


    private final FileRepository repo;


    @Autowired
    public FileService(FileRepository repo) {
        this.repo = repo;
    }
}
