package com.weddingplatform.budget.infrastructure.persistence.repository;
import com.weddingplatform.budget.infrastructure.persistence.entity.BudgetCategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface JpaBudgetCategoryRepository extends JpaRepository<BudgetCategoryEntity, Long> {
    List<BudgetCategoryEntity> findByWeddingIdOrderBySortOrder(Long weddingId);
}
