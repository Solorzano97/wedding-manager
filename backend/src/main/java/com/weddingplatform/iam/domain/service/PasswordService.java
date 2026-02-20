package com.weddingplatform.iam.domain.service;

public interface PasswordService {
    String encode(String rawPassword);
    boolean matches(String rawPassword, String encodedPassword);
}
