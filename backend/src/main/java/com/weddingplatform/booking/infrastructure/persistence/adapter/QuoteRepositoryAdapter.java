package com.weddingplatform.booking.infrastructure.persistence.adapter;
import com.weddingplatform.booking.domain.model.Quote;
import com.weddingplatform.booking.domain.repository.QuoteRepository;
import com.weddingplatform.booking.infrastructure.persistence.entity.QuoteEntity;
import com.weddingplatform.booking.infrastructure.persistence.repository.JpaQuoteRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import java.util.Optional;

@Component
public class QuoteRepositoryAdapter implements QuoteRepository {
    private final JpaQuoteRepository jpa;
    public QuoteRepositoryAdapter(JpaQuoteRepository jpa) { this.jpa = jpa; }
    @Override public Quote save(Quote q) {
        QuoteEntity e = q.id() != null ? jpa.findById(q.id()).orElse(new QuoteEntity()) : new QuoteEntity();
        e.setUuid(q.uuid()); e.setWeddingId(q.weddingId()); e.setVendorProfileId(q.vendorProfileId());
        e.setVendorServiceId(q.vendorServiceId()); e.setRequestedById(q.requestedById());
        e.setStatus(q.status()); e.setEventDate(q.eventDate()); e.setGuestCount(q.guestCount());
        e.setCustomRequirements(q.customRequirements()); e.setSubtotal(q.subtotal());
        e.setDiscountAmount(q.discountAmount()); e.setTaxAmount(q.taxAmount());
        e.setTotalAmount(q.totalAmount()); e.setCurrencyCode(q.currencyCode());
        e.setValidUntil(q.validUntil()); e.setNotes(q.notes());
        return toDomain(jpa.save(e));
    }
    @Override public Optional<Quote> findById(Long id) { return jpa.findById(id).map(this::toDomain); }
    @Override public Optional<Quote> findByUuid(String uuid) { return jpa.findByUuid(uuid).map(this::toDomain); }
    @Override public Page<Quote> findByWeddingId(Long wid, Pageable p) { return jpa.findByWeddingId(wid, p).map(this::toDomain); }
    @Override public Page<Quote> findByVendorServiceId(Long vsid, Pageable p) { return jpa.findByVendorServiceId(vsid, p).map(this::toDomain); }
    @Override public Page<Quote> findByVendorProfileId(Long vpid, Pageable p) { return jpa.findByVendorProfileId(vpid, p).map(this::toDomain); }
    private Quote toDomain(QuoteEntity e) {
        return new Quote(e.getId(), e.getUuid(), e.getWeddingId(), e.getVendorProfileId(),
            e.getVendorServiceId(), e.getRequestedById(), e.getStatus(), e.getEventDate(),
            e.getGuestCount(), e.getCustomRequirements(), e.getSubtotal(), e.getDiscountAmount(),
            e.getTaxAmount(), e.getTotalAmount(), e.getCurrencyCode(), e.getValidUntil(),
            e.getNotes(), e.getCreatedAt());
    }
}
