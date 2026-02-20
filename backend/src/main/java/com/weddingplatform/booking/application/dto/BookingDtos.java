package com.weddingplatform.booking.application.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
public final class BookingDtos {
    private BookingDtos() {}
    public record CreateQuoteRequest(@NotNull Long vendorServiceId, LocalDate eventDate,
        Integer guestCount, String customRequirements, String notes) {}
    public record QuoteResponse(Long id, String uuid, Long weddingId, Long vendorServiceId,
        String status, LocalDate eventDate, Integer guestCount, BigDecimal totalAmount,
        String currencyCode, LocalDate validUntil, String notes, LocalDateTime createdAt) {}
    public record UpdateQuoteStatusRequest(@NotBlank String status) {}
    public record CreateAppointmentRequest(@NotNull Long vendorProfileId,
        @NotNull LocalDate appointmentDate, @NotNull LocalTime startTime, @NotNull LocalTime endTime,
        String meetingType, String meetingUrl, String location, String notes) {}
    public record AppointmentResponse(Long id, String uuid, Long weddingId, Long vendorProfileId,
        Long coupleProfileId, LocalDate appointmentDate, LocalTime startTime, LocalTime endTime,
        String meetingType, String meetingUrl, String location, String status,
        String notes, LocalDateTime createdAt) {}
    public record UpdateAppointmentStatusRequest(@NotBlank String status, String cancellationReason) {}
}
