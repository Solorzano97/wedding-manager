package com.weddingplatform.vendor.infrastructure.persistence.adapter;
import com.weddingplatform.vendor.domain.model.VendorService;
import com.weddingplatform.vendor.domain.repository.VendorServiceRepository;
import com.weddingplatform.vendor.infrastructure.persistence.entity.VendorServiceEntity;
import com.weddingplatform.vendor.infrastructure.persistence.repository.JpaVendorServiceRepository;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Optional;

@Component
public class VendorServiceRepositoryAdapter implements VendorServiceRepository {
    private final JpaVendorServiceRepository jpa;
    public VendorServiceRepositoryAdapter(JpaVendorServiceRepository jpa) { this.jpa = jpa; }
    @Override public VendorService save(VendorService s) {
        VendorServiceEntity e = s.id() != null ? jpa.findById(s.id()).orElse(new VendorServiceEntity()) : new VendorServiceEntity();
        e.setVendorProfileId(s.vendorProfileId()); e.setServiceCategoryId(s.serviceCategoryId());
        e.setName(s.name()); e.setDescription(s.description()); e.setBasePrice(s.basePrice());
        e.setMaxPrice(s.maxPrice()); e.setCurrencyCode(s.currencyCode()); e.setPriceUnit(s.priceUnit());
        e.setMinGuests(s.minGuests()); e.setMaxGuests(s.maxGuests()); e.setActive(s.active());
        return toDomain(jpa.save(e));
    }
    @Override public Optional<VendorService> findById(Long id) { return jpa.findById(id).map(this::toDomain); }
    @Override public List<VendorService> findByVendorProfileId(Long vpid) { return jpa.findByVendorProfileIdAndActiveTrue(vpid).stream().map(this::toDomain).toList(); }
    @Override public void deleteById(Long id) { jpa.deleteById(id); }
    private VendorService toDomain(VendorServiceEntity e) {
        return new VendorService(e.getId(), e.getVendorProfileId(), e.getServiceCategoryId(),
            e.getName(), e.getDescription(), e.getBasePrice(), e.getMaxPrice(),
            e.getCurrencyCode(), e.getPriceUnit(), e.getMinGuests(), e.getMaxGuests(),
            e.isActive(), e.getCreatedAt());
    }
}
