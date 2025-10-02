package com.rm.models.users;

public record SignupBody(
    String username,
    String password,
    String email,
    Integer phone
) {
    
}
