package com.weddingplatform.guest.application.usecase;
import com.weddingplatform.guest.application.dto.GuestDtos.*;
import com.weddingplatform.guest.domain.model.Guest;
import com.weddingplatform.guest.domain.repository.GuestRepository;
import com.weddingplatform.shared.application.dto.PageResponse;
import com.weddingplatform.shared.domain.exception.BusinessRuleViolationException;
import com.weddingplatform.shared.domain.exception.ResourceNotFoundException;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.Set;

@Service
public class ManageGuestsUseCase {
    private static final Set<String> VALID_STATUSES = Set.of("pending","confirmed","declined","tentative");
    private final GuestRepository guestRepo;
    public ManageGuestsUseCase(GuestRepository guestRepo) { this.guestRepo = guestRepo; }

    @Transactional
    public GuestResponse addGuest(Long weddingId, CreateGuestRequest req) {
        Guest guest = new Guest(null, weddingId, null, null, req.firstName(), req.lastName(),
            req.email(), req.phone(), "pending", null, req.plusOneAllowed(), req.plusOneName(),
            req.dietaryRestrictions(), req.notes(), null, null);
        return toResponse(guestRepo.save(guest));
    }

    @Transactional(readOnly = true)
    public PageResponse<GuestResponse> getGuests(Long weddingId, String status, Pageable pageable) {
        return PageResponse.of(guestRepo.findByWeddingId(weddingId, status, pageable).map(this::toResponse));
    }

    @Transactional(readOnly = true)
    public GuestStatsResponse getStats(Long weddingId) {
        return new GuestStatsResponse(
            guestRepo.countByWeddingId(weddingId),
            guestRepo.countByWeddingIdAndRsvpStatus(weddingId, "confirmed"),
            guestRepo.countByWeddingIdAndRsvpStatus(weddingId, "declined"),
            guestRepo.countByWeddingIdAndRsvpStatus(weddingId, "pending"),
            guestRepo.countByWeddingIdAndRsvpStatus(weddingId, "tentative"));
    }

    @Transactional
    public GuestResponse updateRsvp(Long guestId, UpdateRsvpRequest req) {
        if (!VALID_STATUSES.contains(req.rsvpStatus())) {
            throw new BusinessRuleViolationException("INVALID_RSVP", "Estado RSVP inválido: " + req.rsvpStatus());
        }
        Guest existing = guestRepo.findById(guestId)
            .orElseThrow(() -> new ResourceNotFoundException("Guest", guestId));
        Guest updated = new Guest(existing.id(), existing.weddingId(), existing.guestGroupId(), existing.userId(),
            existing.firstName(), existing.lastName(), existing.email(), existing.phone(),
            req.rsvpStatus(), LocalDateTime.now(), existing.plusOneAllowed(), existing.plusOneName(),
            existing.dietaryRestrictions(), existing.notes(), existing.invitationSentAt(), existing.createdAt());
        return toResponse(guestRepo.save(updated));
    }

    @Transactional
    public void deleteGuest(Long guestId) {
        guestRepo.findById(guestId).orElseThrow(() -> new ResourceNotFoundException("Guest", guestId));
        guestRepo.deleteById(guestId);
    }

    private GuestResponse toResponse(Guest g) {
        return new GuestResponse(g.id(), g.weddingId(), g.firstName(), g.lastName(),
            g.email(), g.phone(), g.rsvpStatus(), g.rsvpRespondedAt(),
            g.plusOneAllowed(), g.plusOneName(), g.dietaryRestrictions(), g.notes());
    }
}
