package com.weddingplatform.budget.infrastructure.persistence.repository;
import com.weddingplatform.budget.infrastructure.persistence.entity.BudgetItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface JpaBudgetItemRepository extends JpaRepository<BudgetItemEntity, Long> {
    List<BudgetItemEntity> findByBudgetCategoryId(Long budgetCategoryId);
}
