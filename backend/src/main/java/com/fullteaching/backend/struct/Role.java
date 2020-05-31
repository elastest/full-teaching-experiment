package com.fullteaching.backend.struct;

import lombok.Getter;

@Getter
public enum Role {
    TEACHER("ROLE_TEACHER"),
    STUDENT("ROLE_STUDENT");

    Role(String name) {
        this.name = name;
    }

    private final String name;

}
