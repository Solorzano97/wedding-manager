package com.weddingplatform.vendor.domain.repository;
import com.weddingplatform.vendor.domain.model.VendorProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Optional;
public interface VendorProfileRepository {
    VendorProfile save(VendorProfile profile);
    Optional<VendorProfile> findById(Long id);
    Optional<VendorProfile> findByUserId(Long userId);
    Optional<VendorProfile> findBySlug(String slug);
    Page<VendorProfile> search(String city, String category, String query, Pageable pageable);
}
