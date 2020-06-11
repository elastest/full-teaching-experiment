package com.fullteaching.backend.struct;

public enum  FileType {

    VIDEO("/videos/"),
    PICTURE("/pictures/"),
    AUDIO("/audios/"),
    DOCUMENT("/files/");

    private String path;

    FileType(String path) {
        this.path = path;
    }

    public String getPath() {
        return path;
    }
}
