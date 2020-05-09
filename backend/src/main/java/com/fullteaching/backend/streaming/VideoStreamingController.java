package com.fullteaching.backend.streaming;

import com.fullteaching.backend.file.File;
import com.fullteaching.backend.file.FileService;
import com.fullteaching.backend.file.MultipartFileSender;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.nio.file.Paths;
import java.util.Objects;

@RestController
@RequestMapping("streaming/video")
@Slf4j
public class VideoStreamingController {

    public static final String VIDEOS_FOLDER = "C:\\Users\\Dani\\Desktop\\FT\\2019-FullTeaching\\assets\\files";
    private final FileService fileService;

    @Autowired
    public VideoStreamingController(FileService fileService) {
        this.fileService = fileService;
    }

    @GetMapping(value = "/play/{fileId}")
    public void getTestVideo(HttpServletRequest request, HttpServletResponse response, @PathVariable long fileId) throws Exception {
        File file = fileService.getFromId(fileId);

        if (Objects.nonNull(file)) {

            log.info("File found!");

            String videoPath = VIDEOS_FOLDER + "/" + file.getNameIdent();
            log.info(videoPath);

            MultipartFileSender.fromPath(Paths.get(videoPath))
                    .with(request)
                    .with(response)
                    .serveResource();
        } else {
            log.info("File not found with id: {}", fileId);
        }
    }


}
