package com.weddingplatform.vendor.application.usecase;
import com.weddingplatform.shared.application.dto.PageResponse;
import com.weddingplatform.shared.domain.exception.ResourceNotFoundException;
import com.weddingplatform.vendor.application.dto.VendorDtos.*;
import com.weddingplatform.vendor.domain.model.VendorProfile;
import com.weddingplatform.vendor.domain.model.VendorService;
import com.weddingplatform.vendor.domain.repository.ServiceCategoryRepository;
import com.weddingplatform.vendor.domain.repository.VendorProfileRepository;
import com.weddingplatform.vendor.domain.repository.VendorServiceRepository;
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
    private final VendorServiceRepository serviceRepo;
    public ManageVendorsUseCase(VendorProfileRepository vendorRepo, ServiceCategoryRepository categoryRepo,
                                VendorServiceRepository serviceRepo) {
        this.vendorRepo = vendorRepo; this.categoryRepo = categoryRepo; this.serviceRepo = serviceRepo;
    }

    // === Profile ===
    @Transactional
    public VendorProfileResponse createProfile(Long userId, CreateVendorProfileRequest req) {
        String slug = generateSlug(req.businessName());
        VendorProfile profile = new VendorProfile(null, userId, req.businessName(), slug,
            req.description(), null, null, req.phone(), req.websiteUrl(),
            req.city(), req.state(), "Guatemala", BigDecimal.ZERO, 0, false, false,
            req.serviceCategorySlugs() != null ? req.serviceCategorySlugs() : List.of(), null);
        return toProfileResponse(vendorRepo.save(profile));
    }

    @Transactional
    public VendorProfileResponse updateProfile(Long userId, UpdateVendorProfileRequest req) {
        VendorProfile existing = vendorRepo.findByUserId(userId)
            .orElseThrow(() -> new ResourceNotFoundException("VendorProfile", "userId", userId));
        String newSlug = req.businessName() != null && !req.businessName().equals(existing.businessName())
            ? generateSlug(req.businessName()) : existing.slug();
        VendorProfile updated = new VendorProfile(existing.id(), existing.userId(),
            req.businessName() != null ? req.businessName() : existing.businessName(), newSlug,
            req.description() != null ? req.description() : existing.description(),
            existing.logoUrl(), existing.coverImageUrl(),
            req.phone() != null ? req.phone() : existing.phone(),
            req.websiteUrl() != null ? req.websiteUrl() : existing.websiteUrl(),
            req.city() != null ? req.city() : existing.city(),
            req.state() != null ? req.state() : existing.state(),
            existing.country(), existing.avgRating(), existing.totalReviews(),
            existing.verified(), existing.featured(),
            req.serviceCategorySlugs() != null ? req.serviceCategorySlugs() : existing.serviceCategories(),
            existing.createdAt());
        return toProfileResponse(vendorRepo.save(updated));
    }

    @Transactional(readOnly = true)
    public VendorProfileResponse getMyProfile(Long userId) {
        return toProfileResponse(vendorRepo.findByUserId(userId)
            .orElseThrow(() -> new ResourceNotFoundException("VendorProfile", "userId", userId)));
    }

    @Transactional(readOnly = true)
    public VendorProfileResponse getBySlug(String slug) {
        return toProfileResponse(vendorRepo.findBySlug(slug)
            .orElseThrow(() -> new ResourceNotFoundException("VendorProfile", "slug", slug)));
    }

    @Transactional(readOnly = true)
    public PageResponse<VendorProfileResponse> search(String city, String category, String query, Pageable pageable) {
        return PageResponse.of(vendorRepo.search(city, category, query, pageable).map(this::toProfileResponse));
    }

    @Transactional(readOnly = true)
    public List<ServiceCategoryResponse> getAllCategories() {
        return categoryRepo.findAllActive().stream()
            .map(c -> new ServiceCategoryResponse(c.id(), c.name(), c.slug(), c.iconUrl(), c.description()))
            .toList();
    }

    // === Vendor Services ===
    @Transactional
    public VendorServiceResponse addService(Long userId, CreateVendorServiceRequest req) {
        VendorProfile profile = vendorRepo.findByUserId(userId)
            .orElseThrow(() -> new ResourceNotFoundException("VendorProfile", "userId", userId));
        VendorService svc = new VendorService(null, profile.id(), req.serviceCategoryId(),
            req.name(), req.description(), req.basePrice(), req.maxPrice(),
            "GTQ", req.priceUnit(), req.minGuests(), req.maxGuests(), true, null);
        return toServiceResponse(serviceRepo.save(svc));
    }

    @Transactional(readOnly = true)
    public List<VendorServiceResponse> getMyServices(Long userId) {
        VendorProfile profile = vendorRepo.findByUserId(userId)
            .orElseThrow(() -> new ResourceNotFoundException("VendorProfile", "userId", userId));
        return serviceRepo.findByVendorProfileId(profile.id()).stream().map(this::toServiceResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<VendorServiceResponse> getServicesByVendor(Long vendorProfileId) {
        return serviceRepo.findByVendorProfileId(vendorProfileId).stream().map(this::toServiceResponse).toList();
    }

    @Transactional
    public void deleteService(Long userId, Long serviceId) {
        VendorProfile profile = vendorRepo.findByUserId(userId)
            .orElseThrow(() -> new ResourceNotFoundException("VendorProfile", "userId", userId));
        VendorService svc = serviceRepo.findById(serviceId)
            .orElseThrow(() -> new ResourceNotFoundException("VendorService", "id", serviceId));
        if (!svc.vendorProfileId().equals(profile.id())) throw new IllegalArgumentException("Not your service");
        serviceRepo.deleteById(serviceId);
    }

    private VendorProfileResponse toProfileResponse(VendorProfile v) {
        return new VendorProfileResponse(v.id(), v.businessName(), v.slug(), v.description(),
            v.logoUrl(), v.coverImageUrl(), v.phone(), v.websiteUrl(),
            v.city(), v.state(), v.country(), v.avgRating(), v.totalReviews(),
            v.verified(), v.featured(), v.serviceCategories());
    }

    private VendorServiceResponse toServiceResponse(VendorService s) {
        return new VendorServiceResponse(s.id(), s.vendorProfileId(), s.serviceCategoryId(),
            s.name(), s.description(), s.basePrice(), s.maxPrice(),
            s.currencyCode(), s.priceUnit(), s.minGuests(), s.maxGuests(), s.active());
    }

    private String generateSlug(String name) {
        String base = Normalizer.normalize(name, Normalizer.Form.NFD);
        return Pattern.compile("[\\p{InCombiningDiacriticalMarks}]").matcher(base).replaceAll("")
            .toLowerCase().replaceAll("[^a-z0-9\\s-]", "").replaceAll("\\s+", "-").replaceAll("-+", "-");
    }
}
