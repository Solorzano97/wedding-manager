package com.weddingplatform.messaging.infrastructure.persistence.adapter;
import com.weddingplatform.messaging.domain.model.Message;
import com.weddingplatform.messaging.domain.repository.MessageRepository;
import com.weddingplatform.messaging.infrastructure.persistence.entity.MessageEntity;
import com.weddingplatform.messaging.infrastructure.persistence.repository.JpaMessageRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

@Component
public class MessageRepositoryAdapter implements MessageRepository {
    private final JpaMessageRepository jpa;
    public MessageRepositoryAdapter(JpaMessageRepository jpa) { this.jpa = jpa; }
    @Override public Message save(Message m) {
        MessageEntity e = new MessageEntity();
        e.setConversationId(m.conversationId()); e.setSenderUserId(m.senderUserId());
        e.setContent(m.content()); e.setMessageType(m.messageType());
        e.setAttachmentUrl(m.attachmentUrl()); e.setRead(m.read()); e.setReadAt(m.readAt());
        return toDomain(jpa.save(e));
    }
    @Override public Page<Message> findByConversationId(Long cid, Pageable p) {
        return jpa.findByConversationIdOrderByCreatedAtDesc(cid, p).map(this::toDomain);
    }
    @Override public long countUnreadByConversationIdAndNotSender(Long cid, Long uid) {
        return jpa.countUnreadByConversationIdAndNotSender(cid, uid);
    }
    @Override public void markAllAsRead(Long cid, Long uid) { jpa.markAllAsRead(cid, uid); }
    private Message toDomain(MessageEntity e) {
        return new Message(e.getId(), e.getConversationId(), e.getSenderUserId(),
            e.getContent(), e.getMessageType(), e.getAttachmentUrl(),
            e.isRead(), e.getReadAt(), e.getCreatedAt());
    }
}
