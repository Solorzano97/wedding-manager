package com.weddingplatform.wedding.infrastructure.persistence.entity;
import com.weddingplatform.shared.infrastructure.persistence.BaseEntity;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity @Table(name = "weddings")
public class WeddingEntity extends BaseEntity {
    @Column(nullable = false, unique = true, length = 36) private String uuid;
    @Column(nullable = false, unique = true, length = 100) private String slug;
    @Column(name = "partner_one_id", nullable = false) private Long partnerOneId;
    @Column(name = "partner_two_id") private Long partnerTwoId;
    @Column(nullable = false, length = 200) private String title;
    @Column(name = "wedding_date") private LocalDate weddingDate;
    @Column(name = "ceremony_time") private LocalTime ceremonyTime;
    @Column(name = "venue_name", length = 200) private String venueName;
    @Column(name = "venue_address", length = 500) private String venueAddress;
    @Column(name = "total_budget", precision = 12, scale = 2) private BigDecimal totalBudget;
    @Column(name = "currency_code", nullable = false, length = 3) private String currencyCode = "GTQ";
    @Column(nullable = false, length = 20) private String status = "DRAFT";
    @Column(name = "deleted_at") private LocalDateTime deletedAt;

    public String getUuid() { return uuid; } public void setUuid(String v) { this.uuid = v; }
    public String getSlug() { return slug; } public void setSlug(String v) { this.slug = v; }
    public Long getPartnerOneId() { return partnerOneId; } public void setPartnerOneId(Long v) { this.partnerOneId = v; }
    public Long getPartnerTwoId() { return partnerTwoId; } public void setPartnerTwoId(Long v) { this.partnerTwoId = v; }
    public String getTitle() { return title; } public void setTitle(String v) { this.title = v; }
    public LocalDate getWeddingDate() { return weddingDate; } public void setWeddingDate(LocalDate v) { this.weddingDate = v; }
    public LocalTime getCeremonyTime() { return ceremonyTime; } public void setCeremonyTime(LocalTime v) { this.ceremonyTime = v; }
    public String getVenueName() { return venueName; } public void setVenueName(String v) { this.venueName = v; }
    public String getVenueAddress() { return venueAddress; } public void setVenueAddress(String v) { this.venueAddress = v; }
    public BigDecimal getTotalBudget() { return totalBudget; } public void setTotalBudget(BigDecimal v) { this.totalBudget = v; }
    public String getCurrencyCode() { return currencyCode; } public void setCurrencyCode(String v) { this.currencyCode = v; }
    public String getStatus() { return status; } public void setStatus(String v) { this.status = v; }
    public LocalDateTime getDeletedAt() { return deletedAt; }
}
