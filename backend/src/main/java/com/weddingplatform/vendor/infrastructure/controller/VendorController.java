package com.weddingplatform.vendor.infrastructure.controller;
import com.weddingplatform.shared.application.dto.PageResponse;
import com.weddingplatform.shared.infrastructure.security.UserPrincipal;
import com.weddingplatform.vendor.application.dto.VendorDtos.*;
import com.weddingplatform.vendor.application.usecase.ManageVendorsUseCase;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @Tag(name = "Vendors")
public class VendorController {
    private final ManageVendorsUseCase uc;
    public VendorController(ManageVendorsUseCase uc) { this.uc = uc; }

    @PostMapping("/vendors/profile") @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<VendorProfileResponse> createProfile(@AuthenticationPrincipal UserPrincipal p,
        @Valid @RequestBody CreateVendorProfileRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(uc.createProfile(p.getId(), req));
    }

    @GetMapping("/vendors")
    public ResponseEntity<PageResponse<VendorProfileResponse>> search(
        @RequestParam(required = false) String city, @RequestParam(required = false) String category,
        @RequestParam(required = false) String q,
        @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "12") int size) {
        return ResponseEntity.ok(uc.search(city, category, q, PageRequest.of(page, size, Sort.by("avgRating").descending())));
    }

    @GetMapping("/vendors/{slug}")
    public ResponseEntity<VendorProfileResponse> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(uc.getBySlug(slug));
    }

    @GetMapping("/service-categories")
    public ResponseEntity<List<ServiceCategoryResponse>> getCategories() {
        return ResponseEntity.ok(uc.getAllCategories());
    }
}
