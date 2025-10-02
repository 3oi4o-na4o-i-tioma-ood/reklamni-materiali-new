package com.rm.interceptors;

import com.rm.exceptions.UnauthorizedException;
import com.rm.models.users.Role;
import com.rm.models.users.User;
import com.rm.util.JWTManager;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.servlet.HandlerInterceptor;

public class AdminInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer")) {
            throw new UnauthorizedException();
        }

        Role userRole = JWTManager.decodeClaim(authorizationHeader.substring(7), "role", Role.class);

        if (userRole != Role.ADMIN) {
            throw new UnauthorizedException();
        }

        return true;
    }
}
