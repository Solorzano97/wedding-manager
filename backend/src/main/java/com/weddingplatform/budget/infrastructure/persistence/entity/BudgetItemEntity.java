package com.weddingplatform.budget.infrastructure.persistence.entity;
import com.weddingplatform.shared.infrastructure.persistence.BaseEntity;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity @Table(name = "budget_items")
public class BudgetItemEntity extends BaseEntity {
    @Column(name = "budget_category_id", nullable = false) private Long budgetCategoryId;
    @Column(name = "vendor_service_id") private Long vendorServiceId;
    @Column(nullable = false, length = 200) private String name;
    @Column(name = "estimated_cost", nullable = false, precision = 12, scale = 2) private BigDecimal estimatedCost = BigDecimal.ZERO;
    @Column(name = "actual_cost", precision = 12, scale = 2) private BigDecimal actualCost;
    @Column(name = "is_paid", nullable = false) private boolean paid;
    @Column(length = 500) private String notes;
    public Long getBudgetCategoryId() { return budgetCategoryId; } public void setBudgetCategoryId(Long v) { this.budgetCategoryId = v; }
    public Long getVendorServiceId() { return vendorServiceId; } public void setVendorServiceId(Long v) { this.vendorServiceId = v; }
    public String getName() { return name; } public void setName(String v) { this.name = v; }
    public BigDecimal getEstimatedCost() { return estimatedCost; } public void setEstimatedCost(BigDecimal v) { this.estimatedCost = v; }
    public BigDecimal getActualCost() { return actualCost; } public void setActualCost(BigDecimal v) { this.actualCost = v; }
    public boolean isPaid() { return paid; } public void setPaid(boolean v) { this.paid = v; }
    public String getNotes() { return notes; } public void setNotes(String v) { this.notes = v; }
}
