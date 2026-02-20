package com.weddingplatform.vendor.domain.model;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
public record VendorProfile(Long id, Long userId, String businessName, String slug,
    String description, String logoUrl, String coverImageUrl, String phone, String websiteUrl,
    String city, String state, String country, BigDecimal avgRating, int totalReviews,
    boolean verified, boolean featured, List<String> serviceCategories, LocalDateTime createdAt) {}
