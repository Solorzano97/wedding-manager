package com.weddingplatform.vendor.application.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;
public final class VendorDtos {
    private VendorDtos() {}

    // --- Profile ---
    public record CreateVendorProfileRequest(@NotBlank String businessName, String description,
        String phone, String websiteUrl, String city, String state, List<String> serviceCategorySlugs) {}

    public record UpdateVendorProfileRequest(String businessName, String description,
        String phone, String websiteUrl, String city, String state, List<String> serviceCategorySlugs) {}

    public record VendorProfileResponse(Long id, String businessName, String slug, String description,
        String logoUrl, String coverImageUrl, String phone, String websiteUrl,
        String city, String state, String country, BigDecimal avgRating, int totalReviews,
        boolean verified, boolean featured, List<String> serviceCategories) {}

    // --- Services ---
    public record CreateVendorServiceRequest(@NotBlank String name, @NotNull Long serviceCategoryId,
        String description, @NotNull BigDecimal basePrice, BigDecimal maxPrice,
        String priceUnit, Integer minGuests, Integer maxGuests) {}

    public record VendorServiceResponse(Long id, Long vendorProfileId, Long serviceCategoryId,
        String name, String description, BigDecimal basePrice, BigDecimal maxPrice,
        String currencyCode, String priceUnit, Integer minGuests, Integer maxGuests, boolean active) {}

    // --- Categories ---
    public record ServiceCategoryResponse(Long id, String name, String slug, String iconUrl, String description) {}
}
