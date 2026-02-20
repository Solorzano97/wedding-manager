package com.weddingplatform.vendor.application.dto;
import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;
import java.util.List;
public final class VendorDtos {
    private VendorDtos() {}
    public record CreateVendorProfileRequest(@NotBlank String businessName, String description,
        String phone, String websiteUrl, String city, String state, List<String> serviceCategorySlugs) {}
    public record VendorProfileResponse(Long id, String businessName, String slug, String description,
        String logoUrl, String coverImageUrl, String phone, String websiteUrl,
        String city, String state, String country, BigDecimal avgRating, int totalReviews,
        boolean verified, boolean featured, List<String> serviceCategories) {}
    public record ServiceCategoryResponse(Long id, String name, String slug, String iconUrl, String description) {}
}
