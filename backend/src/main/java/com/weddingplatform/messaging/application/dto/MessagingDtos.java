package com.weddingplatform.messaging.application.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
public final class MessagingDtos {
    private MessagingDtos() {}
    public record StartConversationRequest(@NotNull Long weddingId, @NotNull Long vendorProfileId, @NotBlank String initialMessage) {}
    public record SendMessageRequest(@NotBlank String content, String messageType, String attachmentUrl) {}
    public record ConversationResponse(Long id, String uuid, Long weddingId, Long vendorProfileId,
        Long coupleProfileId, String status, LocalDateTime lastMessageAt, long unreadCount, LocalDateTime createdAt) {}
    public record MessageResponse(Long id, Long conversationId, Long senderUserId,
        String content, String messageType, String attachmentUrl, boolean read,
        LocalDateTime readAt, LocalDateTime createdAt) {}
}
