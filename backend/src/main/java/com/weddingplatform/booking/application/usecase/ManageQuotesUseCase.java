package com.weddingplatform.booking.application.usecase;
import com.weddingplatform.booking.application.dto.BookingDtos.*;
import com.weddingplatform.booking.domain.model.Quote;
import com.weddingplatform.booking.domain.repository.QuoteRepository;
import com.weddingplatform.shared.application.dto.PageResponse;
import com.weddingplatform.shared.domain.exception.ResourceNotFoundException;
import com.weddingplatform.wedding.domain.repository.CoupleProfileRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.UUID;

@Service
public class ManageQuotesUseCase {
    private final QuoteRepository quoteRepo;
    private final CoupleProfileRepository coupleRepo;
    public ManageQuotesUseCase(QuoteRepository quoteRepo, CoupleProfileRepository coupleRepo) {
        this.quoteRepo = quoteRepo; this.coupleRepo = coupleRepo;
    }

    @Transactional
    public QuoteResponse createQuote(Long userId, Long weddingId, CreateQuoteRequest req) {
        var profile = coupleRepo.findByUserId(userId)
            .orElseThrow(() -> new ResourceNotFoundException("CoupleProfile", "userId", userId));
        Quote quote = new Quote(null, UUID.randomUUID().toString(), weddingId, req.vendorServiceId(),
            profile.id(), "draft", req.eventDate(), req.guestCount(), req.customRequirements(),
            BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, "GTQ",
            null, req.notes(), null);
        return toResponse(quoteRepo.save(quote));
    }

    @Transactional(readOnly = true)
    public PageResponse<QuoteResponse> getByWedding(Long weddingId, Pageable pageable) {
        return PageResponse.of(quoteRepo.findByWeddingId(weddingId, pageable).map(this::toResponse));
    }

    @Transactional
    public QuoteResponse updateStatus(String uuid, UpdateQuoteStatusRequest req) {
        Quote q = quoteRepo.findByUuid(uuid).orElseThrow(() -> new ResourceNotFoundException("Quote", "uuid", uuid));
        Quote updated = new Quote(q.id(), q.uuid(), q.weddingId(), q.vendorServiceId(), q.requestedById(),
            req.status(), q.eventDate(), q.guestCount(), q.customRequirements(),
            q.subtotal(), q.discountAmount(), q.taxAmount(), q.totalAmount(),
            q.currencyCode(), q.validUntil(), q.notes(), q.createdAt());
        return toResponse(quoteRepo.save(updated));
    }

    private QuoteResponse toResponse(Quote q) {
        return new QuoteResponse(q.id(), q.uuid(), q.weddingId(), q.vendorServiceId(),
            q.status(), q.eventDate(), q.guestCount(), q.totalAmount(),
            q.currencyCode(), q.validUntil(), q.notes(), q.createdAt());
    }
}
