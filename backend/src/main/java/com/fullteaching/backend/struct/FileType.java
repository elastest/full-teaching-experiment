package com.fullteaching.backend.struct;

public enum  FileType {

    VIDEO("/videos/"),
    PICTURE("/pictures/"),
    DOCUMENT("/files/");

    private String path;

    FileType(String path) {
        this.path = path;
    }

    public String getPath() {
        return path;
    }
}
