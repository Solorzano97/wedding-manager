package com.weddingplatform.messaging.domain.model;
import java.time.LocalDateTime;
public record Message(Long id, Long conversationId, Long senderUserId,
    String content, String messageType, String attachmentUrl,
    boolean read, LocalDateTime readAt, LocalDateTime createdAt) {}
