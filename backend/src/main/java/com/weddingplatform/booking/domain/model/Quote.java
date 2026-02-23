package com.weddingplatform.booking.domain.model;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
public record Quote(Long id, String uuid, Long weddingId, Long vendorProfileId, Long vendorServiceId,
    Long requestedById, String status, LocalDate eventDate, Integer guestCount, String customRequirements,
    BigDecimal subtotal, BigDecimal discountAmount, BigDecimal taxAmount, BigDecimal totalAmount,
    String currencyCode, LocalDate validUntil, String notes, LocalDateTime createdAt) {}
