package com.fullteaching.backend.security;

import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Security configuration. In this class can be configured several aspects
 * related to security:
 * Security behavior: Login method, session management, CSRF, etc..
 * Authentication provider: Responsible to authenticate users. In this
 * example, we use an instance of UserRepositoryAuthProvider, that authenticate
 * users stored in a Spring Data database.
 * URL Access Authorization: Access to http URLs depending on Authenticated
 * vs anonymous users and also based on user role.
 * <p>
 * <p>
 * NOTE: The only part of this class intended for app developer customization is
 * the method configureUrlAuthorization. App developer should
 * decide what URLs are accessible by what user role.
 */
@Configuration
@AllArgsConstructor
public class SecurityConfig extends WebSecurityConfigurerAdapter implements WebMvcConfigurer {

    public final UserRepositoryAuthProvider userRepoAuthProvider;
    private final LoginInterceptor loginInterceptor;
    private final RoleCheckInterceptor roleCheckInterceptor;
    private final CourseAuthorizerInterceptor courseAuthorizerInterceptor;

    @Override
    protected void configure(HttpSecurity http) throws Exception {

        configureUrlAuthorization(http);

        // Use Http Basic Authentication
        http.httpBasic();

        // Do not redirect when logout
        http.logout().logoutSuccessHandler((rq, rs, a) -> {
        });
    }

    private void configureUrlAuthorization(HttpSecurity http) throws Exception {

        http.httpBasic();

        http.csrf().disable();

        // APP: This rules have to be changed by app developer

        // URLs that need authentication to access to it
        //Courses API
        http.authorizeRequests().antMatchers(HttpMethod.GET, "/courses/**").hasAnyRole("TEACHER", "STUDENT");
        http.authorizeRequests().antMatchers(HttpMethod.POST, "/courses/**").hasRole("TEACHER");
        http.authorizeRequests().antMatchers(HttpMethod.PUT, "/courses/**").hasRole("TEACHER");
        http.authorizeRequests().antMatchers(HttpMethod.DELETE, "/courses/**").hasRole("TEACHER");
        //Forum API
        http.authorizeRequests().antMatchers(HttpMethod.POST, "/entries/**").hasAnyRole("TEACHER", "STUDENT");
        http.authorizeRequests().antMatchers(HttpMethod.POST, "/comments/**").hasAnyRole("TEACHER", "STUDENT");
        //Session API
        http.authorizeRequests().antMatchers(HttpMethod.POST, "/sessions/**").hasRole("TEACHER");
        http.authorizeRequests().antMatchers(HttpMethod.PUT, "/sessions/**").hasRole("TEACHER");
        http.authorizeRequests().antMatchers(HttpMethod.DELETE, "/sessions/**").hasRole("TEACHER");
        //Files API
        http.authorizeRequests().antMatchers(HttpMethod.POST, "/files/**").hasRole("TEACHER");
        http.authorizeRequests().antMatchers(HttpMethod.PUT, "/files/**").hasRole("TEACHER");
        http.authorizeRequests().antMatchers(HttpMethod.DELETE, "/files/**").hasRole("TEACHER");
        //Files upload/download API
        http.authorizeRequests().antMatchers(HttpMethod.POST, "/load-files/upload/course/**").hasRole("TEACHER");
        http.authorizeRequests().antMatchers(HttpMethod.POST, "/load-files/upload/picture/**").hasAnyRole("TEACHER", "STUDENT");
        http.authorizeRequests().antMatchers(HttpMethod.GET, "/load-files/course/**").hasAnyRole("TEACHER", "STUDENT");

        // Pictures
        http.authorizeRequests().antMatchers(HttpMethod.GET, "/assets/pictures/*").authenticated();

        // Other URLs can be accessed without authentication
        http.authorizeRequests().anyRequest().permitAll();
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {

        // Database authentication provider
        auth.authenticationProvider(userRepoAuthProvider);
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/*").allowedOrigins("*");
    }

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOrigin("*");
        config.addAllowedHeader("*");
        config.addAllowedMethod("OPTIONS");
        config.addAllowedMethod("GET");
        config.addAllowedMethod("POST");
        config.addAllowedMethod("PUT");
        config.addAllowedMethod("DELETE");
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // checks if user is logged in
        registry.addInterceptor(loginInterceptor).addPathPatterns("/**");

        // checks if user is logged in, also checks if he has the needed role
        registry.addInterceptor(roleCheckInterceptor).addPathPatterns("/**");

        // checks if user/teacher belongs to a course
        registry.addInterceptor(courseAuthorizerInterceptor).addPathPatterns("/**");
    }
}
