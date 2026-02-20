package com.weddingplatform.iam.domain.model;

import java.time.LocalDateTime;
import java.util.List;

public record User(
    Long id, String uuid, String email, String passwordHash,
    boolean active, LocalDateTime emailVerifiedAt, LocalDateTime lastLoginAt,
    List<String> roles, LocalDateTime createdAt
) {
    public boolean hasRole(String roleName) {
        return roles != null && roles.contains(roleName);
    }
}
