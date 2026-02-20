package com.weddingplatform.iam.infrastructure.persistence.adapter;

import com.weddingplatform.iam.domain.model.User;
import com.weddingplatform.iam.domain.repository.UserRepository;
import com.weddingplatform.iam.infrastructure.persistence.entity.RoleEntity;
import com.weddingplatform.iam.infrastructure.persistence.entity.UserEntity;
import com.weddingplatform.iam.infrastructure.persistence.repository.JpaRoleRepository;
import com.weddingplatform.iam.infrastructure.persistence.repository.JpaUserRepository;
import com.weddingplatform.shared.domain.exception.ResourceNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class UserRepositoryAdapter implements UserRepository {

    private final JpaUserRepository jpaUserRepo;
    private final JpaRoleRepository jpaRoleRepo;

    public UserRepositoryAdapter(JpaUserRepository jpaUserRepo, JpaRoleRepository jpaRoleRepo) {
        this.jpaUserRepo = jpaUserRepo;
        this.jpaRoleRepo = jpaRoleRepo;
    }

    @Override @Transactional
    public User save(User user) {
        UserEntity entity = new UserEntity();
        entity.setUuid(user.uuid());
        entity.setEmail(user.email());
        entity.setPasswordHash(user.passwordHash());
        entity.setActive(user.active());
        entity.setEmailVerifiedAt(user.emailVerifiedAt());
        entity.setLastLoginAt(user.lastLoginAt());
        if (user.roles() != null && !user.roles().isEmpty()) {
            Set<RoleEntity> roleEntities = user.roles().stream()
                .map(name -> jpaRoleRepo.findByName(name)
                    .orElseThrow(() -> new ResourceNotFoundException("Role", "name", name)))
                .collect(Collectors.toSet());
            entity.setRoles(roleEntities);
        }
        return toDomain(jpaUserRepo.save(entity));
    }

    @Override public Optional<User> findById(Long id) {
        return jpaUserRepo.findByIdAndDeletedAtIsNull(id).map(this::toDomain);
    }
    @Override public Optional<User> findByEmail(String email) {
        return jpaUserRepo.findByEmailAndDeletedAtIsNull(email).map(this::toDomain);
    }
    @Override public boolean existsByEmail(String email) { return jpaUserRepo.existsByEmail(email); }
    @Override @Transactional public void updateLastLogin(Long userId) { jpaUserRepo.updateLastLogin(userId); }

    private User toDomain(UserEntity e) {
        return new User(e.getId(), e.getUuid(), e.getEmail(), e.getPasswordHash(),
            e.isActive(), e.getEmailVerifiedAt(), e.getLastLoginAt(),
            e.getRoles().stream().map(RoleEntity::getName).toList(), e.getCreatedAt());
    }
}
