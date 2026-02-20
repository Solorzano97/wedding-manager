package com.weddingplatform.vendor.infrastructure.persistence.adapter;
import com.weddingplatform.vendor.domain.model.ServiceCategory;
import com.weddingplatform.vendor.domain.repository.ServiceCategoryRepository;
import com.weddingplatform.vendor.infrastructure.persistence.entity.ServiceCategoryEntity;
import com.weddingplatform.vendor.infrastructure.persistence.repository.JpaServiceCategoryRepository;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Optional;

@Component
public class ServiceCategoryRepositoryAdapter implements ServiceCategoryRepository {
    private final JpaServiceCategoryRepository jpa;
    public ServiceCategoryRepositoryAdapter(JpaServiceCategoryRepository jpa) { this.jpa = jpa; }
    @Override public List<ServiceCategory> findAllActive() {
        return jpa.findByActiveTrueOrderBySortOrder().stream().map(this::toDomain).toList();
    }
    @Override public Optional<ServiceCategory> findBySlug(String slug) { return jpa.findBySlug(slug).map(this::toDomain); }
    private ServiceCategory toDomain(ServiceCategoryEntity e) {
        return new ServiceCategory(e.getId(), e.getName(), e.getSlug(), e.getIconUrl(), e.getDescription(), e.getSortOrder(), e.isActive());
    }
}
