package com.weddingplatform.messaging.infrastructure.controller;
import com.weddingplatform.messaging.application.dto.MessagingDtos.*;
import com.weddingplatform.messaging.application.usecase.ManageMessagingUseCase;
import com.weddingplatform.shared.application.dto.PageResponse;
import com.weddingplatform.shared.infrastructure.security.UserPrincipal;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/messages")
@Tag(name = "Messaging") @SecurityRequirement(name = "bearerAuth")
public class MessagingController {
    private final ManageMessagingUseCase uc;
    public MessagingController(ManageMessagingUseCase uc) { this.uc = uc; }

    @PostMapping("/conversations")
    public ResponseEntity<ConversationResponse> start(@AuthenticationPrincipal UserPrincipal p,
        @Valid @RequestBody StartConversationRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(uc.startOrGetConversation(p.getId(), req));
    }

    @GetMapping("/conversations")
    public ResponseEntity<PageResponse<ConversationResponse>> myConversations(@AuthenticationPrincipal UserPrincipal p,
        @RequestParam(required = false) Long profileId,
        @RequestParam(defaultValue = "false") boolean isVendor,
        @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(uc.getMyConversations(p.getId(), isVendor, profileId, PageRequest.of(page, size)));
    }

    @GetMapping("/conversations/{uuid}/messages")
    public ResponseEntity<PageResponse<MessageResponse>> getMessages(@PathVariable String uuid,
        @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "50") int size) {
        return ResponseEntity.ok(uc.getMessages(uuid, PageRequest.of(page, size)));
    }

    @PostMapping("/conversations/{uuid}/messages")
    public ResponseEntity<MessageResponse> send(@AuthenticationPrincipal UserPrincipal p,
        @PathVariable String uuid, @Valid @RequestBody SendMessageRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(uc.sendMessage(p.getId(), uuid, req));
    }

    @PostMapping("/conversations/{uuid}/read")
    public ResponseEntity<Void> markRead(@AuthenticationPrincipal UserPrincipal p, @PathVariable String uuid) {
        uc.markAsRead(p.getId(), uuid); return ResponseEntity.ok().build();
    }
}
