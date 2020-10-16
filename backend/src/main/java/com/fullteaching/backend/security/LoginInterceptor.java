package com.fullteaching.backend.security;

import com.fullteaching.backend.annotation.LoginRequired;
import com.fullteaching.backend.security.user.UserComponent;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Objects;

@Log4j2
@Component
public class LoginInterceptor implements HandlerInterceptor {

    private final UserComponent userComponent;

    @Autowired
    public LoginInterceptor(UserComponent userComponent) {
        this.userComponent = userComponent;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws IOException {
        if ((handler instanceof HandlerMethod)) {
            HandlerMethod handlerMethod = (HandlerMethod) handler;
            LoginRequired loginRequired = handlerMethod.getMethod().getAnnotation(LoginRequired.class);
            if (Objects.isNull(loginRequired)) {
                log.info("Login not required");
                return true;
            }
            log.info("Checking user logged in interceptor");
            if (userComponent.isLoggedUser()) {
                log.info("User is correctly logged!");
                return true;
            }
            log.info("User is not logged");
            response.sendError(401, "User is not logged");
            return false;
        }
        return true;
    }

}
