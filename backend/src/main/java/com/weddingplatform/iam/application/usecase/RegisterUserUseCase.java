package com.weddingplatform.iam.application.usecase;

import com.weddingplatform.iam.application.dto.AuthDtos.RegisterRequest;
import com.weddingplatform.iam.domain.model.User;
import com.weddingplatform.iam.domain.repository.UserRepository;
import com.weddingplatform.iam.domain.service.PasswordService;
import com.weddingplatform.shared.domain.exception.BusinessRuleViolationException;
import com.weddingplatform.shared.domain.exception.DuplicateResourceException;
import com.weddingplatform.wedding.domain.model.CoupleProfile;
import com.weddingplatform.wedding.domain.repository.CoupleProfileRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class RegisterUserUseCase {

    private static final Logger log = LoggerFactory.getLogger(RegisterUserUseCase.class);
    private static final Set<String> ALLOWED_ROLES = Set.of("couple", "vendor");
    private final UserRepository userRepository;
    private final PasswordService passwordService;
    private final CoupleProfileRepository coupleProfileRepository;

    public RegisterUserUseCase(UserRepository userRepository, PasswordService passwordService , CoupleProfileRepository coupleProfileRepository) {
        this.userRepository = userRepository;
        this.passwordService = passwordService;
        this.coupleProfileRepository = coupleProfileRepository;
    }

    @Transactional
    public User execute(RegisterRequest request) {
        if (!ALLOWED_ROLES.contains(request.role())) {
            throw new BusinessRuleViolationException("INVALID_ROLE", "El rol debe ser 'couple' o 'vendor'");
        }
        if (userRepository.existsByEmail(request.email())) {
            throw new DuplicateResourceException("Usuario", "email", request.email());
        }
        User newUser = new User(null, UUID.randomUUID().toString(),
            request.email().toLowerCase().trim(),
            passwordService.encode(request.password()),
            true, null, null, List.of(request.role()), null);
        User saved = userRepository.save(newUser);

        if ("couple".equals(request.role())) {
            CoupleProfile profile = new CoupleProfile(
                    null, saved.id(),
                    request.firstName(), request.lastName(),
                    null, null, null
            );
            coupleProfileRepository.save(profile);
            log.info("CoupleProfile created for user: {}", saved.email());
        }
        log.info("User registered: {} role: {}", saved.email(), request.role());
        return saved;
    }
}
