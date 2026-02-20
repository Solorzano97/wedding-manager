package com.weddingplatform.booking.domain.model;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
public record Appointment(Long id, String uuid, Long weddingId, Long vendorProfileId, Long coupleProfileId,
    Long quoteId, LocalDate appointmentDate, LocalTime startTime, LocalTime endTime,
    String meetingType, String meetingUrl, String location, String status,
    String notes, String cancellationReason, LocalDateTime createdAt) {}
