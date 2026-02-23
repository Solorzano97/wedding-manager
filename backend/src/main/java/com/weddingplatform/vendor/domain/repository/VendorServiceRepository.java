package com.weddingplatform.vendor.domain.repository;
import com.weddingplatform.vendor.domain.model.VendorService;
import java.util.List;
import java.util.Optional;
public interface VendorServiceRepository {
    VendorService save(VendorService svc);
    Optional<VendorService> findById(Long id);
    List<VendorService> findByVendorProfileId(Long vendorProfileId);
    void deleteById(Long id);
}
