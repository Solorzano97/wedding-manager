package com.weddingplatform.iam.infrastructure.persistence.adapter;

import com.weddingplatform.iam.infrastructure.persistence.entity.RoleEntity;
import com.weddingplatform.iam.infrastructure.persistence.entity.UserEntity;
import com.weddingplatform.iam.infrastructure.persistence.repository.JpaUserRepository;
import com.weddingplatform.shared.infrastructure.security.UserPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final JpaUserRepository userRepository;
    public CustomUserDetailsService(JpaUserRepository userRepository) { this.userRepository = userRepository; }

    @Override @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String usernameOrId) throws UsernameNotFoundException {
        UserEntity user;
        try {
            Long userId = Long.parseLong(usernameOrId);
            user = userRepository.findByIdAndDeletedAtIsNull(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + userId));
        } catch (NumberFormatException e) {
            user = userRepository.findByEmailAndDeletedAtIsNull(usernameOrId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + usernameOrId));
        }
        return UserPrincipal.of(user.getId(), user.getUuid(), user.getEmail(),
            user.getPasswordHash(), user.isActive(),
            user.getRoles().stream().map(RoleEntity::getName).toList());
    }
}
