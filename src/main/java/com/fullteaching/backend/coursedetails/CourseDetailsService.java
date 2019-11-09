package com.fullteaching.backend.coursedetails;

import com.fullteaching.backend.struct.FTService;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@Getter
public class CourseDetailsService implements FTService<CourseDetails, Long> {

    private final CourseDetailsRepository repo;

    @Autowired
    public CourseDetailsService(CourseDetailsRepository repo) {
        this.repo = repo;
    }
}
