package com.kisanprocure.controller;

import com.kisanprocure.dto.auth.AuthDtos.*;
import com.kisanprocure.service.AuthService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService service;

    // -----------------------------
    // Farmer/Officer Registration
    // -----------------------------
    @PostMapping("/register")
    public RegisterResponse register(
            @Valid @RequestBody RegisterRequest request
    ) {
        return service.register(request);
    }

    // -----------------------------
    // Login
    // -----------------------------
    @PostMapping("/login")
    public LoginResponse login(
            @Valid @RequestBody LoginRequest request
    ) {
        return service.login(request);
    }

    // -----------------------------
    // Current Logged-in User
    // -----------------------------
    @GetMapping("/me")
    public MeResponse me(Authentication authentication) {

        return service.me(
                Long.valueOf(authentication.getName())
        );
    }
}