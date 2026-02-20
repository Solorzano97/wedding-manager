package com.weddingplatform.messaging.application.usecase;
import com.weddingplatform.messaging.application.dto.MessagingDtos.*;
import com.weddingplatform.messaging.domain.model.Conversation;
import com.weddingplatform.messaging.domain.model.Message;
import com.weddingplatform.messaging.domain.repository.ConversationRepository;
import com.weddingplatform.messaging.domain.repository.MessageRepository;
import com.weddingplatform.shared.application.dto.PageResponse;
import com.weddingplatform.shared.domain.exception.ResourceNotFoundException;
import com.weddingplatform.wedding.domain.repository.CoupleProfileRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class ManageMessagingUseCase {
    private final ConversationRepository convRepo;
    private final MessageRepository msgRepo;
    private final CoupleProfileRepository coupleRepo;
    public ManageMessagingUseCase(ConversationRepository convRepo, MessageRepository msgRepo,
                                  CoupleProfileRepository coupleRepo) {
        this.convRepo = convRepo; this.msgRepo = msgRepo; this.coupleRepo = coupleRepo;
    }

    @Transactional
    public ConversationResponse startOrGetConversation(Long userId, StartConversationRequest req) {
        var profile = coupleRepo.findByUserId(userId)
            .orElseThrow(() -> new ResourceNotFoundException("CoupleProfile", "userId", userId));
        // Check if conversation already exists
        var existing = convRepo.findByWeddingIdAndVendorProfileId(req.weddingId(), req.vendorProfileId());
        Conversation conv;
        if (existing.isPresent()) {
            conv = existing.get();
        } else {
            conv = convRepo.save(new Conversation(null, UUID.randomUUID().toString(),
                req.weddingId(), req.vendorProfileId(), profile.id(), "active", null, null));
        }
        // Send initial message
        Message msg = new Message(null, conv.id(), userId, req.initialMessage(), "text", null, false, null, null);
        msgRepo.save(msg);
        // Update lastMessageAt
        conv = convRepo.save(new Conversation(conv.id(), conv.uuid(), conv.weddingId(),
            conv.vendorProfileId(), conv.coupleProfileId(), conv.status(), LocalDateTime.now(), conv.createdAt()));
        return toConvResponse(conv, 0);
    }

    @Transactional
    public MessageResponse sendMessage(Long userId, String conversationUuid, SendMessageRequest req) {
        Conversation conv = convRepo.findByUuid(conversationUuid)
            .orElseThrow(() -> new ResourceNotFoundException("Conversation", "uuid", conversationUuid));
        String type = req.messageType() != null ? req.messageType() : "text";
        Message msg = new Message(null, conv.id(), userId, req.content(), type, req.attachmentUrl(), false, null, null);
        Message saved = msgRepo.save(msg);
        // Update lastMessageAt
        convRepo.save(new Conversation(conv.id(), conv.uuid(), conv.weddingId(),
            conv.vendorProfileId(), conv.coupleProfileId(), conv.status(), LocalDateTime.now(), conv.createdAt()));
        return toMsgResponse(saved);
    }

    @Transactional(readOnly = true)
    public PageResponse<ConversationResponse> getMyConversations(Long userId, boolean isVendor, Long profileId, Pageable pageable) {
        var page = isVendor
            ? convRepo.findByVendorProfileId(profileId, pageable)
            : convRepo.findByCoupleProfileId(profileId, pageable);
        return PageResponse.of(page.map(c -> {
            long unread = msgRepo.countUnreadByConversationIdAndNotSender(c.id(), userId);
            return toConvResponse(c, unread);
        }));
    }

    @Transactional(readOnly = true)
    public PageResponse<MessageResponse> getMessages(String conversationUuid, Pageable pageable) {
        Conversation conv = convRepo.findByUuid(conversationUuid)
            .orElseThrow(() -> new ResourceNotFoundException("Conversation", "uuid", conversationUuid));
        return PageResponse.of(msgRepo.findByConversationId(conv.id(), pageable).map(this::toMsgResponse));
    }

    @Transactional
    public void markAsRead(Long userId, String conversationUuid) {
        Conversation conv = convRepo.findByUuid(conversationUuid)
            .orElseThrow(() -> new ResourceNotFoundException("Conversation", "uuid", conversationUuid));
        msgRepo.markAllAsRead(conv.id(), userId);
    }

    private ConversationResponse toConvResponse(Conversation c, long unread) {
        return new ConversationResponse(c.id(), c.uuid(), c.weddingId(), c.vendorProfileId(),
            c.coupleProfileId(), c.status(), c.lastMessageAt(), unread, c.createdAt());
    }
    private MessageResponse toMsgResponse(Message m) {
        return new MessageResponse(m.id(), m.conversationId(), m.senderUserId(),
            m.content(), m.messageType(), m.attachmentUrl(), m.read(), m.readAt(), m.createdAt());
    }
}
