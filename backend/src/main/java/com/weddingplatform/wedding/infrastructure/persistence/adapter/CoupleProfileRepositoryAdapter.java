package com.weddingplatform.wedding.infrastructure.persistence.adapter;
import com.weddingplatform.wedding.domain.model.CoupleProfile;
import com.weddingplatform.wedding.domain.repository.CoupleProfileRepository;
import com.weddingplatform.wedding.infrastructure.persistence.entity.CoupleProfileEntity;
import com.weddingplatform.wedding.infrastructure.persistence.repository.JpaCoupleProfileRepository;
import org.springframework.stereotype.Component;
import java.util.Optional;

@Component
public class CoupleProfileRepositoryAdapter implements CoupleProfileRepository {
    private final JpaCoupleProfileRepository jpa;
    public CoupleProfileRepositoryAdapter(JpaCoupleProfileRepository jpa) { this.jpa = jpa; }
    @Override public CoupleProfile save(CoupleProfile p) {
        CoupleProfileEntity e = new CoupleProfileEntity();
        e.setUserId(p.userId()); e.setFirstName(p.firstName()); e.setLastName(p.lastName());
        e.setPhone(p.phone()); e.setAvatarUrl(p.avatarUrl());
        return toDomain(jpa.save(e));
    }
    @Override public Optional<CoupleProfile> findById(Long id) { return jpa.findById(id).map(this::toDomain); }
    @Override public Optional<CoupleProfile> findByUserId(Long uid) { return jpa.findByUserId(uid).map(this::toDomain); }
    private CoupleProfile toDomain(CoupleProfileEntity e) {
        return new CoupleProfile(e.getId(), e.getUserId(), e.getFirstName(), e.getLastName(), e.getPhone(), e.getAvatarUrl(), e.getCreatedAt());
    }
}
