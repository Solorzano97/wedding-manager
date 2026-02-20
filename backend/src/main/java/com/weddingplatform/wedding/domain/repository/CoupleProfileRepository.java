package com.weddingplatform.wedding.domain.repository;
import com.weddingplatform.wedding.domain.model.CoupleProfile;
import java.util.Optional;
public interface CoupleProfileRepository {
    CoupleProfile save(CoupleProfile profile);
    Optional<CoupleProfile> findById(Long id);
    Optional<CoupleProfile> findByUserId(Long userId);
}
