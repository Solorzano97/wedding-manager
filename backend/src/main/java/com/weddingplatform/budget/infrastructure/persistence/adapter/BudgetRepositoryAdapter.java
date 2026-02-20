package com.weddingplatform.budget.infrastructure.persistence.adapter;
import com.weddingplatform.budget.domain.model.BudgetCategory;
import com.weddingplatform.budget.domain.model.BudgetItem;
import com.weddingplatform.budget.domain.repository.BudgetRepository;
import com.weddingplatform.budget.infrastructure.persistence.entity.BudgetCategoryEntity;
import com.weddingplatform.budget.infrastructure.persistence.entity.BudgetItemEntity;
import com.weddingplatform.budget.infrastructure.persistence.repository.JpaBudgetCategoryRepository;
import com.weddingplatform.budget.infrastructure.persistence.repository.JpaBudgetItemRepository;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Optional;

@Component
public class BudgetRepositoryAdapter implements BudgetRepository {
    private final JpaBudgetCategoryRepository catJpa;
    private final JpaBudgetItemRepository itemJpa;
    public BudgetRepositoryAdapter(JpaBudgetCategoryRepository catJpa, JpaBudgetItemRepository itemJpa) {
        this.catJpa = catJpa; this.itemJpa = itemJpa;
    }
    @Override public BudgetCategory saveCategory(BudgetCategory c) {
        BudgetCategoryEntity e = c.id() != null ? catJpa.findById(c.id()).orElse(new BudgetCategoryEntity()) : new BudgetCategoryEntity();
        e.setWeddingId(c.weddingId()); e.setName(c.name()); e.setAllocatedAmount(c.allocatedAmount()); e.setSortOrder(c.sortOrder());
        return toCatDomain(catJpa.save(e));
    }
    @Override public Optional<BudgetCategory> findCategoryById(Long id) { return catJpa.findById(id).map(this::toCatDomain); }
    @Override public List<BudgetCategory> findCategoriesByWeddingId(Long wid) { return catJpa.findByWeddingIdOrderBySortOrder(wid).stream().map(this::toCatDomain).toList(); }
    @Override public void deleteCategoryById(Long id) { catJpa.deleteById(id); }
    @Override public BudgetItem saveItem(BudgetItem i) {
        BudgetItemEntity e = i.id() != null ? itemJpa.findById(i.id()).orElse(new BudgetItemEntity()) : new BudgetItemEntity();
        e.setBudgetCategoryId(i.budgetCategoryId()); e.setVendorServiceId(i.vendorServiceId());
        e.setName(i.name()); e.setEstimatedCost(i.estimatedCost()); e.setActualCost(i.actualCost());
        e.setPaid(i.paid()); e.setNotes(i.notes());
        return toItemDomain(itemJpa.save(e));
    }
    @Override public Optional<BudgetItem> findItemById(Long id) { return itemJpa.findById(id).map(this::toItemDomain); }
    @Override public List<BudgetItem> findItemsByCategoryId(Long cid) { return itemJpa.findByBudgetCategoryId(cid).stream().map(this::toItemDomain).toList(); }
    @Override public void deleteItemById(Long id) { itemJpa.deleteById(id); }
    private BudgetCategory toCatDomain(BudgetCategoryEntity e) { return new BudgetCategory(e.getId(), e.getWeddingId(), e.getName(), e.getAllocatedAmount(), e.getSortOrder(), e.getCreatedAt()); }
    private BudgetItem toItemDomain(BudgetItemEntity e) { return new BudgetItem(e.getId(), e.getBudgetCategoryId(), e.getVendorServiceId(), e.getName(), e.getEstimatedCost(), e.getActualCost(), e.isPaid(), e.getNotes(), e.getCreatedAt()); }
}
