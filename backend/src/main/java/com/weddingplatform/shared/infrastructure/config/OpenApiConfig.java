package com.weddingplatform.shared.infrastructure.config;

import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@SecurityScheme(name = "bearerAuth", type = SecuritySchemeType.HTTP, scheme = "bearer", bearerFormat = "JWT")
public class OpenApiConfig {
    @Bean
    public OpenAPI weddingPlatformOpenAPI() {
        return new OpenAPI().info(new Info()
            .title("Wedding Platform API")
            .description("Plataforma de Gestion de Bodas Digital")
            .version("1.0.0"));
    }
}
