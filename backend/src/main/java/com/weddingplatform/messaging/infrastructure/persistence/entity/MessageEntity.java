package com.weddingplatform.messaging.infrastructure.persistence.entity;
import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import java.time.LocalDateTime;

@Entity @Table(name = "messages")
@EntityListeners(AuditingEntityListener.class)
public class MessageEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(name = "conversation_id", nullable = false) private Long conversationId;
    @Column(name = "sender_user_id", nullable = false) private Long senderUserId;
    @Column(nullable = false, columnDefinition = "TEXT") private String content;
    @Column(name = "message_type", nullable = false, length = 20) private String messageType = "text";
    @Column(name = "attachment_url", length = 500) private String attachmentUrl;
    @Column(name = "is_read", nullable = false) private boolean read;
    @Column(name = "read_at") private LocalDateTime readAt;
    @CreatedDate @Column(name = "created_at", nullable = false, updatable = false) private LocalDateTime createdAt;

    public Long getId() { return id; } public void setId(Long v) { this.id = v; }
    public Long getConversationId() { return conversationId; } public void setConversationId(Long v) { this.conversationId = v; }
    public Long getSenderUserId() { return senderUserId; } public void setSenderUserId(Long v) { this.senderUserId = v; }
    public String getContent() { return content; } public void setContent(String v) { this.content = v; }
    public String getMessageType() { return messageType; } public void setMessageType(String v) { this.messageType = v; }
    public String getAttachmentUrl() { return attachmentUrl; } public void setAttachmentUrl(String v) { this.attachmentUrl = v; }
    public boolean isRead() { return read; } public void setRead(boolean v) { this.read = v; }
    public LocalDateTime getReadAt() { return readAt; } public void setReadAt(LocalDateTime v) { this.readAt = v; }
    public LocalDateTime getCreatedAt() { return createdAt; } public void setCreatedAt(LocalDateTime v) { this.createdAt = v; }
}
