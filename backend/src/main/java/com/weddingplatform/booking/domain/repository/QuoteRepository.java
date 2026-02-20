package com.weddingplatform.booking.domain.repository;
import com.weddingplatform.booking.domain.model.Quote;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Optional;
public interface QuoteRepository {
    Quote save(Quote quote);
    Optional<Quote> findById(Long id);
    Optional<Quote> findByUuid(String uuid);
    Page<Quote> findByWeddingId(Long weddingId, Pageable pageable);
    Page<Quote> findByVendorServiceId(Long vendorServiceId, Pageable pageable);
}
