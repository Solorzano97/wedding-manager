package com.weddingplatform.guest.application.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
public final class GuestDtos {
    private GuestDtos() {}
    public record CreateGuestRequest(
        @NotBlank @Size(max = 100) String firstName,
        @NotBlank @Size(max = 100) String lastName,
        String email, String phone, boolean plusOneAllowed,
        String plusOneName, String dietaryRestrictions, String notes) {}
    public record UpdateRsvpRequest(@NotBlank String rsvpStatus) {}
    public record GuestResponse(Long id, Long weddingId, String firstName, String lastName,
        String email, String phone, String rsvpStatus, LocalDateTime rsvpRespondedAt,
        boolean plusOneAllowed, String plusOneName, String dietaryRestrictions, String notes) {}
    public record GuestStatsResponse(long total, long confirmed, long declined, long pending, long tentative) {}
}
