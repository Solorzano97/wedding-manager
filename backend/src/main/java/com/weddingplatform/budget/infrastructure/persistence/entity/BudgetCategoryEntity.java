package com.weddingplatform.budget.infrastructure.persistence.entity;
import com.weddingplatform.shared.infrastructure.persistence.BaseEntity;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity @Table(name = "budget_categories")
public class BudgetCategoryEntity extends BaseEntity {
    @Column(name = "wedding_id", nullable = false) private Long weddingId;
    @Column(nullable = false, length = 100) private String name;
    @Column(name = "allocated_amount", nullable = false, precision = 12, scale = 2) private BigDecimal allocatedAmount = BigDecimal.ZERO;
    @Column(name = "sort_order", nullable = false) private int sortOrder;
    public Long getWeddingId() { return weddingId; } public void setWeddingId(Long v) { this.weddingId = v; }
    public String getName() { return name; } public void setName(String v) { this.name = v; }
    public BigDecimal getAllocatedAmount() { return allocatedAmount; } public void setAllocatedAmount(BigDecimal v) { this.allocatedAmount = v; }
    public int getSortOrder() { return sortOrder; } public void setSortOrder(int v) { this.sortOrder = v; }
}
