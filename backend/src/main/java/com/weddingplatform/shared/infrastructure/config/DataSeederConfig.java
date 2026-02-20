package com.weddingplatform.shared.infrastructure.config;

import com.weddingplatform.iam.infrastructure.persistence.entity.RoleEntity;
import com.weddingplatform.iam.infrastructure.persistence.repository.JpaRoleRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.List;

@Configuration
public class DataSeederConfig {
    private static final Logger log = LoggerFactory.getLogger(DataSeederConfig.class);

    @Bean
    CommandLineRunner seedData(JpaRoleRepository roleRepository) {
        return args -> {
            if (roleRepository.count() == 0) {
                log.info("Seeding roles...");
                roleRepository.saveAll(List.of(
                    new RoleEntity(null, "admin", "Administrador"),
                    new RoleEntity(null, "couple", "Novio/Novia"),
                    new RoleEntity(null, "vendor", "Proveedor"),
                    new RoleEntity(null, "guest", "Invitado")
                ));
                log.info("Roles seeded");
            }
        };
    }
}
