package com.weddingplatform.messaging.infrastructure.persistence.adapter;
import com.weddingplatform.messaging.domain.model.Conversation;
import com.weddingplatform.messaging.domain.repository.ConversationRepository;
import com.weddingplatform.messaging.infrastructure.persistence.entity.ConversationEntity;
import com.weddingplatform.messaging.infrastructure.persistence.repository.JpaConversationRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import java.util.Optional;

@Component
public class ConversationRepositoryAdapter implements ConversationRepository {
    private final JpaConversationRepository jpa;
    public ConversationRepositoryAdapter(JpaConversationRepository jpa) { this.jpa = jpa; }
    @Override public Conversation save(Conversation c) {
        ConversationEntity e;
        if (c.id() != null) { e = jpa.findById(c.id()).orElse(new ConversationEntity()); }
        else { e = new ConversationEntity(); }
        e.setUuid(c.uuid()); e.setWeddingId(c.weddingId()); e.setVendorProfileId(c.vendorProfileId());
        e.setCoupleProfileId(c.coupleProfileId()); e.setStatus(c.status()); e.setLastMessageAt(c.lastMessageAt());
        return toDomain(jpa.save(e));
    }
    @Override public Optional<Conversation> findById(Long id) { return jpa.findById(id).map(this::toDomain); }
    @Override public Optional<Conversation> findByUuid(String uuid) { return jpa.findByUuid(uuid).map(this::toDomain); }
    @Override public Optional<Conversation> findByWeddingIdAndVendorProfileId(Long wid, Long vpid) {
        return jpa.findByWeddingIdAndVendorProfileId(wid, vpid).map(this::toDomain);
    }
    @Override public Page<Conversation> findByCoupleProfileId(Long cpid, Pageable p) {
        return jpa.findByCoupleProfileIdOrderByLastMessageAtDesc(cpid, p).map(this::toDomain);
    }
    @Override public Page<Conversation> findByVendorProfileId(Long vpid, Pageable p) {
        return jpa.findByVendorProfileIdOrderByLastMessageAtDesc(vpid, p).map(this::toDomain);
    }
    private Conversation toDomain(ConversationEntity e) {
        return new Conversation(e.getId(), e.getUuid(), e.getWeddingId(), e.getVendorProfileId(),
            e.getCoupleProfileId(), e.getStatus(), e.getLastMessageAt(), e.getCreatedAt());
    }
}
