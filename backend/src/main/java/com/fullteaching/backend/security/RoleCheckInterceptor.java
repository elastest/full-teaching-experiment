package com.fullteaching.backend.security;

import com.fullteaching.backend.annotation.RoleFilter;
import com.fullteaching.backend.model.User;
import com.fullteaching.backend.security.user.UserComponent;
import com.fullteaching.backend.struct.Role;
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
public class RoleCheckInterceptor implements HandlerInterceptor {

    private final UserComponent userComponent;

    @Autowired
    public RoleCheckInterceptor(UserComponent userComponent) {
        this.userComponent = userComponent;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws IOException {
        if ((handler instanceof HandlerMethod)) {
            HandlerMethod handlerMethod = (HandlerMethod) handler;
            RoleFilter roleFilter = handlerMethod.getMethod().getAnnotation(RoleFilter.class);

            if (Objects.isNull(roleFilter)) {
                return true;
            }

            Role role = roleFilter.role();
            log.info("Filtering by role" + role.getName());

            User user = userComponent.getLoggedUser();

            if (Objects.isNull(user)) {
                log.info("User is not logged in!");
                response.setStatus(401);
                return false;
            }

            log.info(user.getRoles());

            boolean hasRole = user.isRole(role);

            if(hasRole){
                log.info("User has role: " + role.getName());
            }
            else{
                log.info("User has not the role: " + role.getName());
                response.setStatus(401);
                response.getWriter().print("You must have role: " + role.getName());
                response.flushBuffer();
            }

            return hasRole;
        }
        return true;
    }

}
