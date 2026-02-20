package com.weddingplatform.budget.application.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;
public final class BudgetDtos {
    private BudgetDtos() {}
    public record CreateCategoryRequest(@NotBlank String name, @NotNull BigDecimal allocatedAmount, int sortOrder) {}
    public record CreateItemRequest(@NotBlank String name, @NotNull BigDecimal estimatedCost,
        BigDecimal actualCost, boolean paid, String notes) {}
    public record CategoryResponse(Long id, String name, BigDecimal allocatedAmount, int sortOrder,
        BigDecimal totalEstimated, BigDecimal totalActual, List<ItemResponse> items) {}
    public record ItemResponse(Long id, String name, BigDecimal estimatedCost, BigDecimal actualCost,
        boolean paid, String notes) {}
    public record BudgetSummaryResponse(BigDecimal totalBudget, BigDecimal totalAllocated,
        BigDecimal totalEstimated, BigDecimal totalActual, BigDecimal totalPaid,
        BigDecimal remaining, List<CategoryResponse> categories) {}
}
