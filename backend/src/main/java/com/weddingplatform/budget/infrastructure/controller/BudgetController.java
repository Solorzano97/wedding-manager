package com.weddingplatform.budget.infrastructure.controller;
import com.weddingplatform.budget.application.dto.BudgetDtos.*;
import com.weddingplatform.budget.application.usecase.ManageBudgetUseCase;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;

@RestController @RequestMapping("/weddings/{weddingId}/budget")
@Tag(name = "Budget") @SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('COUPLE')")
public class BudgetController {
    private final ManageBudgetUseCase uc;
    public BudgetController(ManageBudgetUseCase uc) { this.uc = uc; }

    @GetMapping("/summary")
    public ResponseEntity<BudgetSummaryResponse> summary(@PathVariable Long weddingId,
        @RequestParam(required = false) BigDecimal totalBudget) {
        return ResponseEntity.ok(uc.getSummary(weddingId, totalBudget));
    }
    @PostMapping("/categories")
    public ResponseEntity<CategoryResponse> addCategory(@PathVariable Long weddingId, @Valid @RequestBody CreateCategoryRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(uc.addCategory(weddingId, req));
    }
    @PostMapping("/categories/{categoryId}/items")
    public ResponseEntity<ItemResponse> addItem(@PathVariable Long weddingId, @PathVariable Long categoryId,
        @Valid @RequestBody CreateItemRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(uc.addItem(categoryId, req));
    }
    @DeleteMapping("/categories/{categoryId}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long weddingId, @PathVariable Long categoryId) {
        uc.deleteCategory(categoryId); return ResponseEntity.noContent().build();
    }
    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long weddingId, @PathVariable Long itemId) {
        uc.deleteItem(itemId); return ResponseEntity.noContent().build();
    }
}
