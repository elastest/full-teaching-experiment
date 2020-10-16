package com.fullteaching.backend.service;

import com.fullteaching.backend.manager.AssetsManager;
import com.fullteaching.backend.struct.FileType;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
@Slf4j
public class AssetsService {

    private final AssetsManager assetsManager;

    @Autowired
    public AssetsService(AssetsManager assetsManager) {
        this.assetsManager = assetsManager;
    }


    public Resource downloadAsset(String assetName, FileType fileType){
        String path = fileType.getPath();
        Resource resource = assetsManager.getResource(path, assetName);
        if(Objects.nonNull(resource)){
            log.info("Resource found: {}", assetName);
        }
        else{
            log.warn("Resource not found: {}", assetName);
        }
        return resource;
    }

}
