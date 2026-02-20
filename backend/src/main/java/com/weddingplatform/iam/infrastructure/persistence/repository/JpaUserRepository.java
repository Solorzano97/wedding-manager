package com.weddingplatform.iam.infrastructure.persistence.repository;

import com.weddingplatform.iam.infrastructure.persistence.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface JpaUserRepository extends JpaRepository<UserEntity, Long> {
    Optional<UserEntity> findByEmailAndDeletedAtIsNull(String email);
    Optional<UserEntity> findByIdAndDeletedAtIsNull(Long id);
    boolean existsByEmail(String email);

    @Modifying
    @Query("UPDATE UserEntity u SET u.lastLoginAt = CURRENT_TIMESTAMP WHERE u.id = :userId")
    void updateLastLogin(@Param("userId") Long userId);
}
