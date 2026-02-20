package com.weddingplatform.iam.application.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

public final class AuthDtos {
    private AuthDtos() {}

    public record RegisterRequest(
        @NotBlank(message = "El email es requerido") @Email(message = "Email invalido") String email,
        @NotBlank(message = "La contrasena es requerida") @Size(min = 8, max = 100) String password,
        @NotBlank(message = "El nombre es requerido") String firstName,
        @NotBlank(message = "El apellido es requerido") String lastName,
        @NotBlank(message = "El rol es requerido") String role
    ) {}

    public record LoginRequest(
        @NotBlank @Email String email,
        @NotBlank String password
    ) {}

    public record AuthResponse(String accessToken, String refreshToken, String tokenType, long expiresIn, UserInfo user) {
        public AuthResponse(String accessToken, String refreshToken, long expiresIn, UserInfo user) {
            this(accessToken, refreshToken, "Bearer", expiresIn, user);
        }
    }

    public record UserInfo(Long id, String uuid, String email, String firstName, String lastName, List<String> roles) {}
}
