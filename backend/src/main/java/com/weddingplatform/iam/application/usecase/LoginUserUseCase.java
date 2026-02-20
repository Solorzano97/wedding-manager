package com.weddingplatform.iam.application.usecase;

import com.weddingplatform.iam.application.dto.AuthDtos.*;
import com.weddingplatform.iam.domain.repository.UserRepository;
import com.weddingplatform.shared.infrastructure.security.JwtTokenProvider;
import com.weddingplatform.shared.infrastructure.security.UserPrincipal;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LoginUserUseCase {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    public LoginUserUseCase(AuthenticationManager authenticationManager,
                            JwtTokenProvider jwtTokenProvider, UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userRepository = userRepository;
    }

    @Transactional
    public AuthResponse execute(LoginRequest request) {
        Authentication auth = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        String accessToken = jwtTokenProvider.generateAccessToken(auth);
        UserPrincipal principal = (UserPrincipal) auth.getPrincipal();
        String refreshToken = jwtTokenProvider.generateRefreshToken(principal.getId());
        userRepository.updateLastLogin(principal.getId());
        UserInfo userInfo = new UserInfo(principal.getId(), principal.getUuid(), principal.getEmail(),
            null, null,
            principal.getAuthorities().stream()
                .map(a -> a.getAuthority().replace("ROLE_", "").toLowerCase()).toList());
        return new AuthResponse(accessToken, refreshToken, jwtTokenProvider.getAccessTokenExpirationMs() / 1000, userInfo);
    }
}
