package com.weddingplatform.vendor.domain.model;
import java.math.BigDecimal;
import java.time.LocalDateTime;
public record VendorService(Long id, Long vendorProfileId, Long serviceCategoryId,
    String name, String description, BigDecimal basePrice, BigDecimal maxPrice,
    String currencyCode, String priceUnit, Integer minGuests, Integer maxGuests,
    boolean active, LocalDateTime createdAt) {}
