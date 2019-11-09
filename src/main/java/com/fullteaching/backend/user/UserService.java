package com.fullteaching.backend.user;

import com.fullteaching.backend.struct.FTService;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Getter
@Slf4j
@Service
public class UserService implements FTService<User, Long> {

    private final UserRepository repo;


    @Autowired
    public UserService(UserRepository repo) {
        this.repo = repo;
    }
}
