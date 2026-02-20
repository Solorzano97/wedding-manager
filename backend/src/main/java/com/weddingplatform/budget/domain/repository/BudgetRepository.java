package com.weddingplatform.budget.domain.repository;
import com.weddingplatform.budget.domain.model.BudgetCategory;
import com.weddingplatform.budget.domain.model.BudgetItem;
import java.util.List;
import java.util.Optional;
public interface BudgetRepository {
    BudgetCategory saveCategory(BudgetCategory cat);
    Optional<BudgetCategory> findCategoryById(Long id);
    List<BudgetCategory> findCategoriesByWeddingId(Long weddingId);
    void deleteCategoryById(Long id);
    BudgetItem saveItem(BudgetItem item);
    Optional<BudgetItem> findItemById(Long id);
    List<BudgetItem> findItemsByCategoryId(Long categoryId);
    void deleteItemById(Long id);
}
