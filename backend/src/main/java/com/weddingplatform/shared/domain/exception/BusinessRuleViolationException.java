package com.weddingplatform.shared.domain.exception;

public class BusinessRuleViolationException extends DomainException {
    public BusinessRuleViolationException(String message) {
        super("BUSINESS_RULE_VIOLATION", message);
    }

    public BusinessRuleViolationException(String errorCode, String message) {
        super(errorCode, message);
    }
}
