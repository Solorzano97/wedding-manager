package com.weddingplatform.budget.domain.model;
import java.math.BigDecimal;
import java.time.LocalDateTime;
public record BudgetItem(Long id, Long budgetCategoryId, Long vendorServiceId,
    String name, BigDecimal estimatedCost, BigDecimal actualCost, boolean paid,
    String notes, LocalDateTime createdAt) {}
