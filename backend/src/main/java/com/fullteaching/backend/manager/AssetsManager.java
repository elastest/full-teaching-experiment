package com.fullteaching.backend.manager;

import org.springframework.core.io.Resource;

public interface AssetsManager {

    Resource getResource(String subPath, String resourceName);

}
