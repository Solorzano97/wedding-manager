package com.weddingplatform.guest.infrastructure.controller;
import com.weddingplatform.guest.application.dto.GuestDtos.*;
import com.weddingplatform.guest.application.usecase.ManageGuestsUseCase;
import com.weddingplatform.shared.application.dto.PageResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/weddings/{weddingId}/guests")
@Tag(name = "Guests") @SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('COUPLE')")
public class GuestController {
    private final ManageGuestsUseCase uc;
    public GuestController(ManageGuestsUseCase uc) { this.uc = uc; }

    @PostMapping
    public ResponseEntity<GuestResponse> add(@PathVariable Long weddingId, @Valid @RequestBody CreateGuestRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(uc.addGuest(weddingId, req));
    }
    @GetMapping
    public ResponseEntity<PageResponse<GuestResponse>> list(@PathVariable Long weddingId,
        @RequestParam(required = false) String status,
        @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "50") int size) {
        return ResponseEntity.ok(uc.getGuests(weddingId, status, PageRequest.of(page, size, Sort.by("lastName"))));
    }
    @GetMapping("/stats")
    public ResponseEntity<GuestStatsResponse> stats(@PathVariable Long weddingId) {
        return ResponseEntity.ok(uc.getStats(weddingId));
    }
    @PatchMapping("/{guestId}/rsvp")
    public ResponseEntity<GuestResponse> updateRsvp(@PathVariable Long weddingId, @PathVariable Long guestId,
        @Valid @RequestBody UpdateRsvpRequest req) {
        return ResponseEntity.ok(uc.updateRsvp(guestId, req));
    }
    @DeleteMapping("/{guestId}")
    public ResponseEntity<Void> delete(@PathVariable Long weddingId, @PathVariable Long guestId) {
        uc.deleteGuest(guestId); return ResponseEntity.noContent().build();
    }
}
