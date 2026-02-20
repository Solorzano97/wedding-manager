package com.weddingplatform.shared.application.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.Instant;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiErrorResponse(
    Instant timestamp,
    int status,
    String errorCode,
    String message,
    String path,
    List<FieldError> fieldErrors
) {
    public record FieldError(String field, String message) {}

    public static ApiErrorResponse of(int status, String errorCode, String message, String path) {
        return new ApiErrorResponse(Instant.now(), status, errorCode, message, path, null);
    }

    public static ApiErrorResponse withFieldErrors(int status, String message, String path, List<FieldError> fieldErrors) {
        return new ApiErrorResponse(Instant.now(), status, "VALIDATION_ERROR", message, path, fieldErrors);
    }
}
