package com.fullteaching.backend.service;

import com.fullteaching.backend.model.File;
import com.fullteaching.backend.model.FileGroup;
import com.fullteaching.backend.repo.FileGroupRepository;
import com.fullteaching.backend.struct.FTService;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@Getter
public class FileGroupService implements FTService<FileGroup, Long> {

    private final FileGroupRepository repo;
    private final FileService fileService;


    @Autowired
    public FileGroupService(FileGroupRepository repo, FileService fileService) {
        this.repo = repo;
        this.fileService = fileService;
    }

    public FileGroup addWebLink(FileGroup fileGroup, File file) {
        File created = fileService.save(file);
        log.info("File saved!");
        fileGroup.getFiles().add(created);
        return this.save(fileGroup);
    }
}
