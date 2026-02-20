package com.weddingplatform.guest.domain.model;
import java.time.LocalDateTime;
public record Guest(Long id, Long weddingId, Long guestGroupId, Long userId,
    String firstName, String lastName, String email, String phone,
    String rsvpStatus, LocalDateTime rsvpRespondedAt, boolean plusOneAllowed,
    String plusOneName, String dietaryRestrictions, String notes,
    LocalDateTime invitationSentAt, LocalDateTime createdAt) {}
