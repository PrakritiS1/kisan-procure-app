package com.kisanprocure.dto.auth;

import com.kisanprocure.dto.auth.AuthDtos.FarmerSummary;
import com.kisanprocure.dto.auth.AuthDtos.UserSummary;

import jakarta.validation.constraints.*;

public final class AuthDtos {
    private AuthDtos() {}
    public record RegisterRequest(@NotBlank String name,@NotBlank @Pattern(regexp="^[0-9]{10}$") String phone,@Email String email,@NotBlank @Size(min=6) String password,@NotBlank String village,@NotBlank String district,@NotBlank String state) {}
    public record LoginRequest(@NotBlank String phone,@NotBlank String password) {}
    public record UserSummary(Long id,String name,String phone,String email,String role) {}
    public record FarmerSummary(Long id,String farmerCode,String village,String district,String state) {}
    public record RegisterResponse(boolean success,String message,Long userId) {}
    public record LoginResponse(boolean success,String token,UserSummary user) {}
    public record OfficerSummary(Long id,String employeeId,Long centreId,String centreName) {}
    public record MeResponse(UserSummary user, FarmerSummary farmer, OfficerSummary officer) {}
}