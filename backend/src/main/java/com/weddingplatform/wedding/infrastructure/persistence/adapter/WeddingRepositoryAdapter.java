package com.weddingplatform.wedding.infrastructure.persistence.adapter;
import com.weddingplatform.wedding.domain.model.Wedding;
import com.weddingplatform.wedding.domain.repository.WeddingRepository;
import com.weddingplatform.wedding.infrastructure.persistence.entity.WeddingEntity;
import com.weddingplatform.wedding.infrastructure.persistence.repository.JpaWeddingRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import java.util.Optional;

@Component
public class WeddingRepositoryAdapter implements WeddingRepository {
    private final JpaWeddingRepository jpa;
    public WeddingRepositoryAdapter(JpaWeddingRepository jpa) { this.jpa = jpa; }

    @Override public Wedding save(Wedding w) {
        WeddingEntity e = new WeddingEntity();
        e.setUuid(w.uuid()); e.setSlug(w.slug()); e.setPartnerOneId(w.partnerOneId());
        e.setPartnerTwoId(w.partnerTwoId()); e.setTitle(w.title()); e.setWeddingDate(w.weddingDate());
        e.setCeremonyTime(w.ceremonyTime()); e.setVenueName(w.venueName()); e.setVenueAddress(w.venueAddress());
        e.setTotalBudget(w.totalBudget()); e.setCurrencyCode(w.currencyCode()); e.setStatus(w.status());
        return toDomain(jpa.save(e));
    }
    @Override public Optional<Wedding> findByUuid(String uuid) { return jpa.findByUuidAndDeletedAtIsNull(uuid).map(this::toDomain); }
    @Override public Optional<Wedding> findBySlug(String slug) { return jpa.findBySlugAndDeletedAtIsNull(slug).map(this::toDomain); }
    @Override public Page<Wedding> findByPartnerId(Long pid, Pageable p) { return jpa.findByPartnerId(pid, p).map(this::toDomain); }
    @Override public boolean existsBySlug(String slug) { return jpa.existsBySlug(slug); }

    private Wedding toDomain(WeddingEntity e) {
        return new Wedding(e.getId(), e.getUuid(), e.getSlug(), e.getPartnerOneId(), e.getPartnerTwoId(),
            e.getTitle(), e.getWeddingDate(), e.getCeremonyTime(), e.getVenueName(), e.getVenueAddress(),
            e.getTotalBudget(), e.getCurrencyCode(), e.getStatus(), e.getCreatedAt());
    }
}
