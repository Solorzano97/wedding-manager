package com.weddingplatform.messaging.domain.repository;
import com.weddingplatform.messaging.domain.model.Conversation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Optional;
public interface ConversationRepository {
    Conversation save(Conversation conversation);
    Optional<Conversation> findById(Long id);
    Optional<Conversation> findByUuid(String uuid);
    Optional<Conversation> findByWeddingIdAndVendorProfileId(Long weddingId, Long vendorProfileId);
    Page<Conversation> findByCoupleProfileId(Long coupleProfileId, Pageable pageable);
    Page<Conversation> findByVendorProfileId(Long vendorProfileId, Pageable pageable);
}
