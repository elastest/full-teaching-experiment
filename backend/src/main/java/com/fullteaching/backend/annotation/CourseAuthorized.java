package com.fullteaching.backend.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface CourseAuthorized {
    public String courseDetailsIdParam() default "";
    public String courseParam() default "";
    public boolean mustBeTeacherOfCourse() default false;
}
