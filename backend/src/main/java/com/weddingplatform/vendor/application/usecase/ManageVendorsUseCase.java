package com.weddingplatform.vendor.application.usecase;
import com.weddingplatform.shared.application.dto.PageResponse;
import com.weddingplatform.shared.domain.exception.ResourceNotFoundException;
import com.weddingplatform.vendor.application.dto.VendorDtos.*;
import com.weddingplatform.vendor.domain.model.ServiceCategory;
import com.weddingplatform.vendor.domain.model.VendorProfile;
import com.weddingplatform.vendor.domain.repository.ServiceCategoryRepository;
import com.weddingplatform.vendor.domain.repository.VendorProfileRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.text.Normalizer;
import java.util.List;
import java.util.regex.Pattern;

@Service
public class ManageVendorsUseCase {
    private final VendorProfileRepository vendorRepo;
    private final ServiceCategoryRepository categoryRepo;
    public ManageVendorsUseCase(VendorProfileRepository vendorRepo, ServiceCategoryRepository categoryRepo) {
        this.vendorRepo = vendorRepo; this.categoryRepo = categoryRepo;
    }

    @Transactional
    public VendorProfileResponse createProfile(Long userId, CreateVendorProfileRequest req) {
        String slug = generateSlug(req.businessName());
        VendorProfile profile = new VendorProfile(null, userId, req.businessName(), slug,
            req.description(), null, null, req.phone(), req.websiteUrl(),
            req.city(), req.state(), "Guatemala", BigDecimal.ZERO, 0, false, false,
            req.serviceCategorySlugs() != null ? req.serviceCategorySlugs() : List.of(), null);
        return toResponse(vendorRepo.save(profile));
    }

    @Transactional(readOnly = true)
    public VendorProfileResponse getBySlug(String slug) {
        return toResponse(vendorRepo.findBySlug(slug)
            .orElseThrow(() -> new ResourceNotFoundException("VendorProfile", "slug", slug)));
    }

    @Transactional(readOnly = true)
    public PageResponse<VendorProfileResponse> search(String city, String category, String query, Pageable pageable) {
        return PageResponse.of(vendorRepo.search(city, category, query, pageable).map(this::toResponse));
    }

    @Transactional(readOnly = true)
    public List<ServiceCategoryResponse> getAllCategories() {
        return categoryRepo.findAllActive().stream()
            .map(c -> new ServiceCategoryResponse(c.id(), c.name(), c.slug(), c.iconUrl(), c.description()))
            .toList();
    }

    private VendorProfileResponse toResponse(VendorProfile v) {
        return new VendorProfileResponse(v.id(), v.businessName(), v.slug(), v.description(),
            v.logoUrl(), v.coverImageUrl(), v.phone(), v.websiteUrl(),
            v.city(), v.state(), v.country(), v.avgRating(), v.totalReviews(),
            v.verified(), v.featured(), v.serviceCategories());
    }

    private String generateSlug(String name) {
        String base = Normalizer.normalize(name, Normalizer.Form.NFD);
        return Pattern.compile("[\\p{InCombiningDiacriticalMarks}]").matcher(base).replaceAll("")
            .toLowerCase().replaceAll("[^a-z0-9\\s-]", "").replaceAll("\\s+", "-").replaceAll("-+", "-");
    }
}
