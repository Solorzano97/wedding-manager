package com.weddingplatform.iam.infrastructure.controller;

import com.weddingplatform.iam.application.dto.AuthDtos.*;
import com.weddingplatform.iam.application.usecase.LoginUserUseCase;
import com.weddingplatform.iam.application.usecase.RegisterUserUseCase;
import com.weddingplatform.iam.domain.model.User;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@Tag(name = "Auth", description = "Autenticacion")
public class AuthController {

    private final RegisterUserUseCase registerUseCase;
    private final LoginUserUseCase loginUseCase;

    public AuthController(RegisterUserUseCase registerUseCase, LoginUserUseCase loginUseCase) {
        this.registerUseCase = registerUseCase;
        this.loginUseCase = loginUseCase;
    }

    @PostMapping("/register")
    public ResponseEntity<UserInfo> register(@Valid @RequestBody RegisterRequest request) {
        User user = registerUseCase.execute(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(new UserInfo(user.id(), user.uuid(), user.email(), null, null, user.roles()));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(loginUseCase.execute(request));
    }
}
