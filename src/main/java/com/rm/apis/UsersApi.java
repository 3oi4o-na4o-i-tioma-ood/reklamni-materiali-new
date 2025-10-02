package com.rm.apis;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.rm.models.users.UserUpdateInfo;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.ResponseBody;

import com.rm.models.users.LoginBody;
import com.rm.models.users.LoginReponse;
import com.rm.models.users.User;
import com.rm.models.users.VerifyEmailBody;

@Tag(name = "Users")
public interface UsersApi {
    @Operation(summary = "Login")
    @PostMapping("/api/auth/login")
    @ResponseBody
    LoginReponse login(@RequestBody LoginBody body) throws RuntimeException;

    @Operation(summary = "Signup")
    @PostMapping("/api/auth/signup")
    @ResponseBody
    void signup(@RequestBody User body) throws RuntimeException;

    @Operation(summary = "Verify email")
    @PostMapping("/api/auth/verify-email")
    @ResponseBody
    LoginReponse verifyEmail(@RequestBody VerifyEmailBody body) throws RuntimeException;

    @Operation(summary = "Update user info")
    @PutMapping("/api/users")
    @ResponseBody
    void updateUserInfo(@RequestBody UserUpdateInfo userInfo,
                        @RequestHeader("Authorization") String authorization) throws IOException;

    @Operation(summary = "Refresh token")
    @PostMapping("/api/users/refresh-token")
    @ResponseBody
    String refreshToken(@RequestHeader("Authorization") String authorization) throws JsonProcessingException;
}
