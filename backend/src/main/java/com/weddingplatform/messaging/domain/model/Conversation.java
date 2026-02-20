package com.weddingplatform.messaging.domain.model;
import java.time.LocalDateTime;
public record Conversation(Long id, String uuid, Long weddingId, Long vendorProfileId,
    Long coupleProfileId, String status, LocalDateTime lastMessageAt, LocalDateTime createdAt) {}
