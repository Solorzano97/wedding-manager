package com.weddingplatform.budget.application.usecase;
import com.weddingplatform.budget.application.dto.BudgetDtos.*;
import com.weddingplatform.budget.domain.model.BudgetCategory;
import com.weddingplatform.budget.domain.model.BudgetItem;
import com.weddingplatform.budget.domain.repository.BudgetRepository;
import com.weddingplatform.shared.domain.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;

@Service
public class ManageBudgetUseCase {
    private final BudgetRepository budgetRepo;
    public ManageBudgetUseCase(BudgetRepository budgetRepo) { this.budgetRepo = budgetRepo; }

    @Transactional
    public CategoryResponse addCategory(Long weddingId, CreateCategoryRequest req) {
        BudgetCategory cat = new BudgetCategory(null, weddingId, req.name(), req.allocatedAmount(), req.sortOrder(), null);
        BudgetCategory saved = budgetRepo.saveCategory(cat);
        return toCategoryResponse(saved, List.of());
    }

    @Transactional
    public ItemResponse addItem(Long categoryId, CreateItemRequest req) {
        budgetRepo.findCategoryById(categoryId).orElseThrow(() -> new ResourceNotFoundException("BudgetCategory", categoryId));
        BudgetItem item = new BudgetItem(null, categoryId, null, req.name(), req.estimatedCost(),
            req.actualCost(), req.paid(), req.notes(), null);
        return toItemResponse(budgetRepo.saveItem(item));
    }

    @Transactional(readOnly = true)
    public BudgetSummaryResponse getSummary(Long weddingId, BigDecimal totalBudget) {
        List<BudgetCategory> categories = budgetRepo.findCategoriesByWeddingId(weddingId);
        BigDecimal totalAllocated = BigDecimal.ZERO, totalEstimated = BigDecimal.ZERO,
                   totalActual = BigDecimal.ZERO, totalPaid = BigDecimal.ZERO;
        List<CategoryResponse> catResponses = new java.util.ArrayList<>();
        for (BudgetCategory cat : categories) {
            List<BudgetItem> items = budgetRepo.findItemsByCategoryId(cat.id());
            BigDecimal catEstimated = items.stream().map(BudgetItem::estimatedCost).reduce(BigDecimal.ZERO, BigDecimal::add);
            BigDecimal catActual = items.stream().map(i -> i.actualCost() != null ? i.actualCost() : BigDecimal.ZERO).reduce(BigDecimal.ZERO, BigDecimal::add);
            totalAllocated = totalAllocated.add(cat.allocatedAmount());
            totalEstimated = totalEstimated.add(catEstimated);
            totalActual = totalActual.add(catActual);
            totalPaid = totalPaid.add(items.stream().filter(BudgetItem::paid).map(i -> i.actualCost() != null ? i.actualCost() : i.estimatedCost()).reduce(BigDecimal.ZERO, BigDecimal::add));
            catResponses.add(toCategoryResponse(cat, items));
        }
        BigDecimal budget = totalBudget != null ? totalBudget : BigDecimal.ZERO;
        return new BudgetSummaryResponse(budget, totalAllocated, totalEstimated, totalActual, totalPaid,
            budget.subtract(totalActual), catResponses);
    }

    @Transactional public void deleteCategory(Long id) { budgetRepo.deleteCategoryById(id); }
    @Transactional public void deleteItem(Long id) { budgetRepo.deleteItemById(id); }

    private CategoryResponse toCategoryResponse(BudgetCategory c, List<BudgetItem> items) {
        BigDecimal est = items.stream().map(BudgetItem::estimatedCost).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal act = items.stream().map(i -> i.actualCost() != null ? i.actualCost() : BigDecimal.ZERO).reduce(BigDecimal.ZERO, BigDecimal::add);
        return new CategoryResponse(c.id(), c.name(), c.allocatedAmount(), c.sortOrder(), est, act,
            items.stream().map(this::toItemResponse).toList());
    }
    private ItemResponse toItemResponse(BudgetItem i) {
        return new ItemResponse(i.id(), i.name(), i.estimatedCost(), i.actualCost(), i.paid(), i.notes());
    }
}
