package com.weddingplatform.messaging.domain.repository;
import com.weddingplatform.messaging.domain.model.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
public interface MessageRepository {
    Message save(Message message);
    Page<Message> findByConversationId(Long conversationId, Pageable pageable);
    long countUnreadByConversationIdAndNotSender(Long conversationId, Long senderUserId);
    void markAllAsRead(Long conversationId, Long readerUserId);
}
