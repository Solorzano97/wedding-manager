package com.weddingplatform.shared.infrastructure.web;

import com.weddingplatform.shared.application.dto.ApiErrorResponse;
import com.weddingplatform.shared.domain.exception.*;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleNotFound(ResourceNotFoundException ex, HttpServletRequest req) {
        log.warn("Not found: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(ApiErrorResponse.of(404, ex.getErrorCode(), ex.getMessage(), req.getRequestURI()));
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ApiErrorResponse> handleDuplicate(DuplicateResourceException ex, HttpServletRequest req) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
            .body(ApiErrorResponse.of(409, ex.getErrorCode(), ex.getMessage(), req.getRequestURI()));
    }

    @ExceptionHandler(BusinessRuleViolationException.class)
    public ResponseEntity<ApiErrorResponse> handleBusinessRule(BusinessRuleViolationException ex, HttpServletRequest req) {
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY)
            .body(ApiErrorResponse.of(422, ex.getErrorCode(), ex.getMessage(), req.getRequestURI()));
    }

    @ExceptionHandler(UnauthorizedAccessException.class)
    public ResponseEntity<ApiErrorResponse> handleUnauthorized(UnauthorizedAccessException ex, HttpServletRequest req) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
            .body(ApiErrorResponse.of(403, ex.getErrorCode(), ex.getMessage(), req.getRequestURI()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest req) {
        List<ApiErrorResponse.FieldError> errors = ex.getBindingResult().getFieldErrors().stream()
            .map(fe -> new ApiErrorResponse.FieldError(fe.getField(), fe.getDefaultMessage())).toList();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(ApiErrorResponse.withFieldErrors(400, "Error de validacion", req.getRequestURI(), errors));
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiErrorResponse> handleBadCredentials(BadCredentialsException ex, HttpServletRequest req) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(ApiErrorResponse.of(401, "BAD_CREDENTIALS", "Credenciales invalidas", req.getRequestURI()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGeneral(Exception ex, HttpServletRequest req) {
        log.error("Unhandled exception: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ApiErrorResponse.of(500, "INTERNAL_ERROR", "Error interno del servidor", req.getRequestURI()));
    }
}
