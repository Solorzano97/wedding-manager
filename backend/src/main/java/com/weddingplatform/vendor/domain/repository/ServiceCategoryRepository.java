package com.weddingplatform.vendor.domain.repository;
import com.weddingplatform.vendor.domain.model.ServiceCategory;
import java.util.List;
import java.util.Optional;
public interface ServiceCategoryRepository {
    List<ServiceCategory> findAllActive();
    Optional<ServiceCategory> findBySlug(String slug);
}
