package com.weddingplatform.booking.infrastructure.persistence.entity;
import com.weddingplatform.shared.infrastructure.persistence.BaseEntity;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity @Table(name = "quotes")
public class QuoteEntity extends BaseEntity {
    @Column(nullable = false, unique = true, length = 36) private String uuid;
    @Column(name = "wedding_id", nullable = false) private Long weddingId;
    @Column(name = "vendor_service_id", nullable = false) private Long vendorServiceId;
    @Column(name = "requested_by_id", nullable = false) private Long requestedById;
    @Column(nullable = false, length = 20) private String status = "draft";
    @Column(name = "event_date") private LocalDate eventDate;
    @Column(name = "guest_count") private Integer guestCount;
    @Column(name = "custom_requirements", columnDefinition = "TEXT") private String customRequirements;
    @Column(nullable = false, precision = 12, scale = 2) private BigDecimal subtotal = BigDecimal.ZERO;
    @Column(name = "discount_amount", nullable = false, precision = 12, scale = 2) private BigDecimal discountAmount = BigDecimal.ZERO;
    @Column(name = "tax_amount", nullable = false, precision = 12, scale = 2) private BigDecimal taxAmount = BigDecimal.ZERO;
    @Column(name = "total_amount", nullable = false, precision = 12, scale = 2) private BigDecimal totalAmount = BigDecimal.ZERO;
    @Column(name = "currency_code", nullable = false, length = 3) private String currencyCode = "GTQ";
    @Column(name = "valid_until") private LocalDate validUntil;
    @Column(columnDefinition = "TEXT") private String notes;

    public String getUuid() { return uuid; } public void setUuid(String v) { this.uuid = v; }
    public Long getWeddingId() { return weddingId; } public void setWeddingId(Long v) { this.weddingId = v; }
    public Long getVendorServiceId() { return vendorServiceId; } public void setVendorServiceId(Long v) { this.vendorServiceId = v; }
    public Long getRequestedById() { return requestedById; } public void setRequestedById(Long v) { this.requestedById = v; }
    public String getStatus() { return status; } public void setStatus(String v) { this.status = v; }
    public LocalDate getEventDate() { return eventDate; } public void setEventDate(LocalDate v) { this.eventDate = v; }
    public Integer getGuestCount() { return guestCount; } public void setGuestCount(Integer v) { this.guestCount = v; }
    public String getCustomRequirements() { return customRequirements; } public void setCustomRequirements(String v) { this.customRequirements = v; }
    public BigDecimal getSubtotal() { return subtotal; } public void setSubtotal(BigDecimal v) { this.subtotal = v; }
    public BigDecimal getDiscountAmount() { return discountAmount; } public void setDiscountAmount(BigDecimal v) { this.discountAmount = v; }
    public BigDecimal getTaxAmount() { return taxAmount; } public void setTaxAmount(BigDecimal v) { this.taxAmount = v; }
    public BigDecimal getTotalAmount() { return totalAmount; } public void setTotalAmount(BigDecimal v) { this.totalAmount = v; }
    public String getCurrencyCode() { return currencyCode; } public void setCurrencyCode(String v) { this.currencyCode = v; }
    public LocalDate getValidUntil() { return validUntil; } public void setValidUntil(LocalDate v) { this.validUntil = v; }
    public String getNotes() { return notes; } public void setNotes(String v) { this.notes = v; }
}
