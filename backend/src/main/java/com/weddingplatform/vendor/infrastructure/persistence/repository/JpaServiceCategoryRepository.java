package com.weddingplatform.vendor.infrastructure.persistence.repository;
import com.weddingplatform.vendor.infrastructure.persistence.entity.ServiceCategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
public interface JpaServiceCategoryRepository extends JpaRepository<ServiceCategoryEntity, Long> {
    List<ServiceCategoryEntity> findByActiveTrueOrderBySortOrder();
    Optional<ServiceCategoryEntity> findBySlug(String slug);
}
