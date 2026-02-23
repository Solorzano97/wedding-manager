package com.weddingplatform.vendor.infrastructure.persistence.repository;
import com.weddingplatform.vendor.infrastructure.persistence.entity.VendorServiceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface JpaVendorServiceRepository extends JpaRepository<VendorServiceEntity, Long> {
    List<VendorServiceEntity> findByVendorProfileIdAndActiveTrue(Long vendorProfileId);
}
