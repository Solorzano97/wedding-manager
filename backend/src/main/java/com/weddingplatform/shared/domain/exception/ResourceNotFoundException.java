package com.weddingplatform.shared.domain.exception;

public class ResourceNotFoundException extends DomainException {
    public ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue) {
        super("RESOURCE_NOT_FOUND",
              String.format("%s no encontrado con %s: '%s'", resourceName, fieldName, fieldValue));
    }

    public ResourceNotFoundException(String resourceName, Long id) {
        this(resourceName, "id", id);
    }
}
