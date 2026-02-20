package com.weddingplatform.shared.domain.exception;

public class DuplicateResourceException extends DomainException {
    public DuplicateResourceException(String resourceName, String fieldName, Object fieldValue) {
        super("DUPLICATE_RESOURCE",
              String.format("%s ya existe con %s: '%s'", resourceName, fieldName, fieldValue));
    }
}
