package com.weddingplatform.messaging.infrastructure.persistence.repository;
import com.weddingplatform.messaging.infrastructure.persistence.entity.MessageEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
public interface JpaMessageRepository extends JpaRepository<MessageEntity, Long> {
    Page<MessageEntity> findByConversationIdOrderByCreatedAtDesc(Long conversationId, Pageable pageable);
    @Query("SELECT COUNT(m) FROM MessageEntity m WHERE m.conversationId = :cid AND m.senderUserId <> :uid AND m.read = false")
    long countUnreadByConversationIdAndNotSender(@Param("cid") Long conversationId, @Param("uid") Long userId);
    @Modifying
    @Query("UPDATE MessageEntity m SET m.read = true, m.readAt = CURRENT_TIMESTAMP WHERE m.conversationId = :cid AND m.senderUserId <> :uid AND m.read = false")
    void markAllAsRead(@Param("cid") Long conversationId, @Param("uid") Long readerUserId);
}
