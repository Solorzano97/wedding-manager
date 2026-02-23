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

    // === Profile ===
    @PostMapping("/vendors/profile") @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<VendorProfileResponse> createProfile(@AuthenticationPrincipal UserPrincipal p,
        @Valid @RequestBody CreateVendorProfileRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(uc.createProfile(p.getId(), req));
    }

    @GetMapping("/vendors/me") @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<VendorProfileResponse> getMyProfile(@AuthenticationPrincipal UserPrincipal p) {
        return ResponseEntity.ok(uc.getMyProfile(p.getId()));
    }

    @PutMapping("/vendors/me") @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<VendorProfileResponse> updateProfile(@AuthenticationPrincipal UserPrincipal p,
        @Valid @RequestBody UpdateVendorProfileRequest req) {
        return ResponseEntity.ok(uc.updateProfile(p.getId(), req));
    }

    // === Vendor Services ===
    @PostMapping("/vendors/me/services") @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<VendorServiceResponse> addService(@AuthenticationPrincipal UserPrincipal p,
        @Valid @RequestBody CreateVendorServiceRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(uc.addService(p.getId(), req));
    }

    @GetMapping("/vendors/me/services") @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<List<VendorServiceResponse>> getMyServices(@AuthenticationPrincipal UserPrincipal p) {
        return ResponseEntity.ok(uc.getMyServices(p.getId()));
    }

    @GetMapping("/vendors/{slug}/services")
    public ResponseEntity<List<VendorServiceResponse>> getVendorServices(@PathVariable String slug) {
        VendorProfileResponse profile = uc.getBySlug(slug);
        return ResponseEntity.ok(uc.getServicesByVendor(profile.id()));
    }

    @DeleteMapping("/vendors/me/services/{serviceId}") @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<Void> deleteService(@AuthenticationPrincipal UserPrincipal p, @PathVariable Long serviceId) {
        uc.deleteService(p.getId(), serviceId); return ResponseEntity.noContent().build();
    }

    // === Public catalog ===
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
