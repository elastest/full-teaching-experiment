package com.fullteaching.backend.course;

import com.fullteaching.backend.struct.FTService;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Getter
@Service
@Slf4j
public class CourseService implements FTService<Course, Long> {

    private final CourseRepository repo;


    @Autowired
    public CourseService(CourseRepository repo) {
        this.repo = repo;
    }
}
