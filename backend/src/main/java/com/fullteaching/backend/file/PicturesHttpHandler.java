package com.fullteaching.backend.file;

import com.fullteaching.backend.controller.FileController;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@Configuration
public class PicturesHttpHandler extends WebMvcConfigurerAdapter {

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry.addResourceHandler("/assets/pictures/**").addResourceLocations("file://" + FileController.PICTURES_FOLDER + "/");
	}

}
