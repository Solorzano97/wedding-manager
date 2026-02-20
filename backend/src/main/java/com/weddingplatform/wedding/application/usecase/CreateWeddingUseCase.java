package com.weddingplatform.wedding.application.usecase;
import com.weddingplatform.shared.domain.exception.ResourceNotFoundException;
import com.weddingplatform.wedding.application.dto.WeddingDtos.*;
import com.weddingplatform.wedding.domain.model.CoupleProfile;
import com.weddingplatform.wedding.domain.model.Wedding;
import com.weddingplatform.wedding.domain.repository.CoupleProfileRepository;
import com.weddingplatform.wedding.domain.repository.WeddingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.text.Normalizer;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
public class CreateWeddingUseCase {
    private final WeddingRepository weddingRepo;
    private final CoupleProfileRepository coupleRepo;
    public CreateWeddingUseCase(WeddingRepository weddingRepo, CoupleProfileRepository coupleRepo) {
        this.weddingRepo = weddingRepo; this.coupleRepo = coupleRepo;
    }
    @Transactional
    public Wedding execute(Long userId, CreateWeddingRequest req) {
        CoupleProfile profile = coupleRepo.findByUserId(userId)
            .orElseThrow(() -> new ResourceNotFoundException("CoupleProfile", "userId", userId));
        String slug = generateSlug(req.title());
        Wedding wedding = new Wedding(null, UUID.randomUUID().toString(), slug, profile.id(), null,
            req.title(), req.weddingDate(), req.ceremonyTime(), req.venueName(), req.venueAddress(),
            req.totalBudget(), req.currencyCode() != null ? req.currencyCode() : "GTQ", "DRAFT", null);
        return weddingRepo.save(wedding);
    }
    private String generateSlug(String title) {
        String base = Normalizer.normalize(title, Normalizer.Form.NFD);
        base = Pattern.compile("[\\p{InCombiningDiacriticalMarks}]").matcher(base).replaceAll("")
            .toLowerCase().replaceAll("[^a-z0-9\\s-]", "").replaceAll("\\s+", "-").replaceAll("-+", "-");
        String slug = base; int c = 1;
        while (weddingRepo.existsBySlug(slug)) { slug = base + "-" + c++; }
        return slug;
    }
}
