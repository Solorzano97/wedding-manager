package com.weddingplatform.messaging.infrastructure.persistence.repository;
import com.weddingplatform.messaging.infrastructure.persistence.entity.ConversationEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface JpaConversationRepository extends JpaRepository<ConversationEntity, Long> {
    Optional<ConversationEntity> findByUuid(String uuid);
    Optional<ConversationEntity> findByWeddingIdAndVendorProfileId(Long weddingId, Long vendorProfileId);
    Page<ConversationEntity> findByCoupleProfileIdOrderByLastMessageAtDesc(Long coupleProfileId, Pageable pageable);
    Page<ConversationEntity> findByVendorProfileIdOrderByLastMessageAtDesc(Long vendorProfileId, Pageable pageable);
}
