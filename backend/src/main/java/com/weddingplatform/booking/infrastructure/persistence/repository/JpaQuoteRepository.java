package com.weddingplatform.booking.infrastructure.persistence.repository;
import com.weddingplatform.booking.infrastructure.persistence.entity.QuoteEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface JpaQuoteRepository extends JpaRepository<QuoteEntity, Long> {
    Optional<QuoteEntity> findByUuid(String uuid);
    Page<QuoteEntity> findByWeddingId(Long weddingId, Pageable pageable);
    Page<QuoteEntity> findByVendorServiceId(Long vendorServiceId, Pageable pageable);
    Page<QuoteEntity> findByVendorProfileId(Long vendorProfileId, Pageable pageable);
}
