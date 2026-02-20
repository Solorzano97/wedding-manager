package com.weddingplatform.wedding.domain.repository;
import com.weddingplatform.wedding.domain.model.Wedding;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Optional;
public interface WeddingRepository {
    Wedding save(Wedding wedding);
    Optional<Wedding> findByUuid(String uuid);
    Optional<Wedding> findBySlug(String slug);
    Page<Wedding> findByPartnerId(Long coupleProfileId, Pageable pageable);
    boolean existsBySlug(String slug);
}
