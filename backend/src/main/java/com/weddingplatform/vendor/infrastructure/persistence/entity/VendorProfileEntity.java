package com.weddingplatform.vendor.infrastructure.persistence.entity;
import com.weddingplatform.shared.infrastructure.persistence.BaseEntity;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity @Table(name = "vendor_profiles")
public class VendorProfileEntity extends BaseEntity {
    @Column(name = "user_id", nullable = false, unique = true) private Long userId;
    @Column(name = "business_name", nullable = false, length = 200) private String businessName;
    @Column(nullable = false, unique = true, length = 200) private String slug;
    @Column(columnDefinition = "TEXT") private String description;
    @Column(name = "logo_url", length = 500) private String logoUrl;
    @Column(name = "cover_image_url", length = 500) private String coverImageUrl;
    @Column(length = 20) private String phone;
    @Column(name = "website_url", length = 500) private String websiteUrl;
    @Column(length = 100) private String city;
    @Column(length = 100) private String state;
    @Column(nullable = false, length = 100) private String country = "Guatemala";
    @Column(name = "avg_rating", nullable = false, precision = 3, scale = 2) private BigDecimal avgRating = BigDecimal.ZERO;
    @Column(name = "total_reviews", nullable = false) private int totalReviews;
    @Column(name = "is_verified", nullable = false) private boolean verified;
    @Column(name = "is_featured", nullable = false) private boolean featured;
    @Column(name = "deleted_at") private LocalDateTime deletedAt;
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "vendor_service_categories",
        joinColumns = @JoinColumn(name = "vendor_profile_id"),
        inverseJoinColumns = @JoinColumn(name = "service_category_id"))
    private Set<ServiceCategoryEntity> serviceCategories = new HashSet<>();

    public Long getUserId() { return userId; } public void setUserId(Long v) { this.userId = v; }
    public String getBusinessName() { return businessName; } public void setBusinessName(String v) { this.businessName = v; }
    public String getSlug() { return slug; } public void setSlug(String v) { this.slug = v; }
    public String getDescription() { return description; } public void setDescription(String v) { this.description = v; }
    public String getLogoUrl() { return logoUrl; } public void setLogoUrl(String v) { this.logoUrl = v; }
    public String getCoverImageUrl() { return coverImageUrl; } public void setCoverImageUrl(String v) { this.coverImageUrl = v; }
    public String getPhone() { return phone; } public void setPhone(String v) { this.phone = v; }
    public String getWebsiteUrl() { return websiteUrl; } public void setWebsiteUrl(String v) { this.websiteUrl = v; }
    public String getCity() { return city; } public void setCity(String v) { this.city = v; }
    public String getState() { return state; } public void setState(String v) { this.state = v; }
    public String getCountry() { return country; } public void setCountry(String v) { this.country = v; }
    public BigDecimal getAvgRating() { return avgRating; } public void setAvgRating(BigDecimal v) { this.avgRating = v; }
    public int getTotalReviews() { return totalReviews; } public void setTotalReviews(int v) { this.totalReviews = v; }
    public boolean isVerified() { return verified; } public void setVerified(boolean v) { this.verified = v; }
    public boolean isFeatured() { return featured; } public void setFeatured(boolean v) { this.featured = v; }
    public Set<ServiceCategoryEntity> getServiceCategories() { return serviceCategories; } public void setServiceCategories(Set<ServiceCategoryEntity> v) { this.serviceCategories = v; }
}
