package com.weddingplatform.wedding.application.usecase;
import com.weddingplatform.shared.application.dto.PageResponse;
import com.weddingplatform.shared.domain.exception.ResourceNotFoundException;
import com.weddingplatform.wedding.application.dto.WeddingDtos.*;
import com.weddingplatform.wedding.domain.model.Wedding;
import com.weddingplatform.wedding.domain.repository.CoupleProfileRepository;
import com.weddingplatform.wedding.domain.repository.WeddingRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service @Transactional(readOnly = true)
public class GetWeddingUseCase {
    private final WeddingRepository weddingRepo;
    private final CoupleProfileRepository coupleRepo;
    public GetWeddingUseCase(WeddingRepository weddingRepo, CoupleProfileRepository coupleRepo) {
        this.weddingRepo = weddingRepo; this.coupleRepo = coupleRepo;
    }
    public WeddingResponse getByUuid(String uuid) {
        return toResponse(weddingRepo.findByUuid(uuid)
            .orElseThrow(() -> new ResourceNotFoundException("Wedding", "uuid", uuid)));
    }
    public WeddingResponse getBySlug(String slug) {
        return toResponse(weddingRepo.findBySlug(slug)
            .orElseThrow(() -> new ResourceNotFoundException("Wedding", "slug", slug)));
    }
    public PageResponse<WeddingResponse> getMyWeddings(Long userId, Pageable pageable) {
        var profile = coupleRepo.findByUserId(userId)
            .orElseThrow(() -> new ResourceNotFoundException("CoupleProfile", "userId", userId));
        return PageResponse.of(weddingRepo.findByPartnerId(profile.id(), pageable).map(this::toResponse));
    }
    private WeddingResponse toResponse(Wedding w) {
        return new WeddingResponse(w.id(), w.uuid(), w.slug(), w.title(), w.weddingDate(),
            w.venueName(), w.totalBudget(), w.currencyCode(), w.status());
    }
}
