package com.weddingplatform.iam.infrastructure.persistence.adapter;

import com.weddingplatform.iam.domain.service.PasswordService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class BcryptPasswordService implements PasswordService {
    private final PasswordEncoder passwordEncoder;
    public BcryptPasswordService(PasswordEncoder passwordEncoder) { this.passwordEncoder = passwordEncoder; }
    @Override public String encode(String raw) { return passwordEncoder.encode(raw); }
    @Override public boolean matches(String raw, String encoded) { return passwordEncoder.matches(raw, encoded); }
}
