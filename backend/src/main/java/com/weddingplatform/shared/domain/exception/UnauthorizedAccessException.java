package com.weddingplatform.shared.domain.exception;

public class UnauthorizedAccessException extends DomainException {
    public UnauthorizedAccessException(String message) {
        super("UNAUTHORIZED_ACCESS", message);
    }
}
