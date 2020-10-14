package com.fullteaching.backend.security;

import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
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
    private final RoleCheckInterceptor roleCheckInterceptor;
    private final CourseAuthorizerInterceptor courseAuthorizerInterceptor;
    private final String ALLOWED_ORIGINS = "https://localhost:4200";

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.httpBasic();
        http.csrf().disable();
        http
                .authorizeRequests()
                .antMatchers("/", "/api-logIn").permitAll()
                .anyRequest().authenticated();
    }


    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {

        // Database authentication provider
        auth.authenticationProvider(userRepoAuthProvider);
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/*").allowedOrigins(this.ALLOWED_ORIGINS);
    }

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOrigin(this.ALLOWED_ORIGINS);
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
        // checks if user is logged in, also checks if he has the needed role
        registry.addInterceptor(roleCheckInterceptor).addPathPatterns("/**");

        // checks if user/teacher belongs to a course
        registry.addInterceptor(courseAuthorizerInterceptor).addPathPatterns("/**");
    }
}
