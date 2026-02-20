package com.weddingplatform.iam.domain.repository;

import com.weddingplatform.iam.domain.model.User;
import java.util.Optional;

public interface UserRepository {
    User save(User user);
    Optional<User> findById(Long id);
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    void updateLastLogin(Long userId);
}
