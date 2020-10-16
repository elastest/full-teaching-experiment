package com.fullteaching.backend.manager;

import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
@Slf4j
public class LocalAssetsManager implements AssetsManager {

    private final Path mainPath = Paths.get(System.getProperty("user.dir"), "/assets");

    private Path build(String subpath) {
        return Paths.get(mainPath.toAbsolutePath() + subpath);
    }

    private Path build(String subpath, String assetName){
        return Paths.get(this.build(subpath).toAbsolutePath() + File.separator + assetName);
    }

    @Override
    public Resource getResource(String subPath, String resourceName) {
        Path path = build(subPath, resourceName);
        File ioFile = path.toFile();
        log.info("Looking for resource in path: {}", path.toAbsolutePath());

        if(ioFile.exists()){
            return new FileSystemResource(ioFile);
        }
        return null;
    }
}
