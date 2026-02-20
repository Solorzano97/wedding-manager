package com.weddingplatform.budget.domain.model;
import java.math.BigDecimal;
import java.time.LocalDateTime;
public record BudgetCategory(Long id, Long weddingId, String name, BigDecimal allocatedAmount,
    int sortOrder, LocalDateTime createdAt) {}
