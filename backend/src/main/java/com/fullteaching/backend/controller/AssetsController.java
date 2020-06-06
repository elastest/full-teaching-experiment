package com.fullteaching.backend.controller;

import com.fullteaching.backend.annotation.LoginRequired;
import com.fullteaching.backend.service.AssetsService;
import com.fullteaching.backend.struct.FileType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Objects;


@RestController
@RequestMapping("/assets")
public class AssetsController {

    private final AssetsService assetsService;

    @Autowired
    public AssetsController(AssetsService assetsService) {
        this.assetsService = assetsService;
    }

    @LoginRequired
    @GetMapping("/pictures/{file_name}")
    public ResponseEntity<Resource> downloadPicture(@PathVariable("file_name") String fileName) throws IOException {
        Resource resource = this.assetsService.downloadAsset(fileName, FileType.PICTURE);
        if (Objects.nonNull(resource)) {
            return ResponseEntity.ok()
                    .contentLength(resource.contentLength())
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(resource);
        } else {
            return ResponseEntity.noContent().build();
        }
    }


}
