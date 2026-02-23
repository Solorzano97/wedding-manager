package com.weddingplatform.vendor.infrastructure.persistence.entity;
import com.weddingplatform.shared.infrastructure.persistence.BaseEntity;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity @Table(name = "vendor_services")
public class VendorServiceEntity extends BaseEntity {
    @Column(name = "vendor_profile_id", nullable = false) private Long vendorProfileId;
    @Column(name = "service_category_id", nullable = false) private Long serviceCategoryId;
    @Column(nullable = false, length = 200) private String name;
    @Column(columnDefinition = "TEXT") private String description;
    @Column(name = "base_price", nullable = false, precision = 12, scale = 2) private BigDecimal basePrice;
    @Column(name = "max_price", precision = 12, scale = 2) private BigDecimal maxPrice;
    @Column(name = "currency_code", nullable = false, length = 3) private String currencyCode = "GTQ";
    @Column(name = "price_unit", length = 50) private String priceUnit;
    @Column(name = "min_guests") private Integer minGuests;
    @Column(name = "max_guests") private Integer maxGuests;
    @Column(name = "is_active", nullable = false) private boolean active = true;

    public Long getVendorProfileId() { return vendorProfileId; } public void setVendorProfileId(Long v) { this.vendorProfileId = v; }
    public Long getServiceCategoryId() { return serviceCategoryId; } public void setServiceCategoryId(Long v) { this.serviceCategoryId = v; }
    public String getName() { return name; } public void setName(String v) { this.name = v; }
    public String getDescription() { return description; } public void setDescription(String v) { this.description = v; }
    public BigDecimal getBasePrice() { return basePrice; } public void setBasePrice(BigDecimal v) { this.basePrice = v; }
    public BigDecimal getMaxPrice() { return maxPrice; } public void setMaxPrice(BigDecimal v) { this.maxPrice = v; }
    public String getCurrencyCode() { return currencyCode; } public void setCurrencyCode(String v) { this.currencyCode = v; }
    public String getPriceUnit() { return priceUnit; } public void setPriceUnit(String v) { this.priceUnit = v; }
    public Integer getMinGuests() { return minGuests; } public void setMinGuests(Integer v) { this.minGuests = v; }
    public Integer getMaxGuests() { return maxGuests; } public void setMaxGuests(Integer v) { this.maxGuests = v; }
    public boolean isActive() { return active; } public void setActive(boolean v) { this.active = v; }
}
