package com.weddingplatform.vendor.infrastructure.persistence.adapter;
import com.weddingplatform.vendor.domain.model.VendorProfile;
import com.weddingplatform.vendor.domain.repository.VendorProfileRepository;
import com.weddingplatform.vendor.infrastructure.persistence.entity.ServiceCategoryEntity;
import com.weddingplatform.vendor.infrastructure.persistence.entity.VendorProfileEntity;
import com.weddingplatform.vendor.infrastructure.persistence.repository.JpaServiceCategoryRepository;
import com.weddingplatform.vendor.infrastructure.persistence.repository.JpaVendorProfileRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class VendorProfileRepositoryAdapter implements VendorProfileRepository {
    private final JpaVendorProfileRepository jpa;
    private final JpaServiceCategoryRepository catJpa;
    public VendorProfileRepositoryAdapter(JpaVendorProfileRepository jpa, JpaServiceCategoryRepository catJpa) {
        this.jpa = jpa; this.catJpa = catJpa;
    }
    @Override public VendorProfile save(VendorProfile v) {
        VendorProfileEntity e = v.id() != null ? jpa.findById(v.id()).orElse(new VendorProfileEntity()) : new VendorProfileEntity();
        e.setUserId(v.userId()); e.setBusinessName(v.businessName()); e.setSlug(v.slug());
        e.setDescription(v.description()); e.setLogoUrl(v.logoUrl()); e.setCoverImageUrl(v.coverImageUrl());
        e.setPhone(v.phone()); e.setWebsiteUrl(v.websiteUrl()); e.setCity(v.city()); e.setState(v.state());
        e.setCountry(v.country()); e.setAvgRating(v.avgRating()); e.setTotalReviews(v.totalReviews());
        e.setVerified(v.verified()); e.setFeatured(v.featured());
        if (v.serviceCategories() != null && !v.serviceCategories().isEmpty()) {
            Set<ServiceCategoryEntity> cats = v.serviceCategories().stream()
                .map(slug -> catJpa.findBySlug(slug).orElse(null)).filter(c -> c != null).collect(Collectors.toSet());
            e.setServiceCategories(cats);
        }
        return toDomain(jpa.save(e));
    }
    @Override public Optional<VendorProfile> findById(Long id) { return jpa.findById(id).map(this::toDomain); }
    @Override public Optional<VendorProfile> findByUserId(Long uid) { return jpa.findByUserIdAndDeletedAtIsNull(uid).map(this::toDomain); }
    @Override public Optional<VendorProfile> findBySlug(String slug) { return jpa.findBySlugAndDeletedAtIsNull(slug).map(this::toDomain); }
    @Override public Page<VendorProfile> search(String city, String cat, String q, Pageable p) {
        return jpa.search(city, cat, q, p).map(this::toDomain);
    }
    private VendorProfile toDomain(VendorProfileEntity e) {
        return new VendorProfile(e.getId(), e.getUserId(), e.getBusinessName(), e.getSlug(),
            e.getDescription(), e.getLogoUrl(), e.getCoverImageUrl(), e.getPhone(), e.getWebsiteUrl(),
            e.getCity(), e.getState(), e.getCountry(), e.getAvgRating(), e.getTotalReviews(),
            e.isVerified(), e.isFeatured(),
            e.getServiceCategories().stream().map(ServiceCategoryEntity::getName).toList(), e.getCreatedAt());
    }
}
