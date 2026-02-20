package com.weddingplatform.vendor.infrastructure.persistence.repository;
import com.weddingplatform.vendor.infrastructure.persistence.entity.VendorProfileEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;
public interface JpaVendorProfileRepository extends JpaRepository<VendorProfileEntity, Long> {
    Optional<VendorProfileEntity> findByUserIdAndDeletedAtIsNull(Long userId);
    Optional<VendorProfileEntity> findBySlugAndDeletedAtIsNull(String slug);
    @Query("SELECT DISTINCT v FROM VendorProfileEntity v LEFT JOIN v.serviceCategories sc WHERE v.deletedAt IS NULL " +
        "AND (:city IS NULL OR v.city = :city) " +
        "AND (:category IS NULL OR sc.slug = :category) " +
        "AND (:q IS NULL OR LOWER(v.businessName) LIKE LOWER(CONCAT('%',:q,'%')) OR LOWER(v.description) LIKE LOWER(CONCAT('%',:q,'%')))")
    Page<VendorProfileEntity> search(@Param("city") String city, @Param("category") String category,
        @Param("q") String query, Pageable pageable);
}
