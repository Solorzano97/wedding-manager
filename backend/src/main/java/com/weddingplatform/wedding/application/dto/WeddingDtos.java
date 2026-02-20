package com.weddingplatform.wedding.application.dto;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
public final class WeddingDtos {
    private WeddingDtos() {}
    public record CreateWeddingRequest(@NotBlank @Size(max = 200) String title, LocalDate weddingDate,
        LocalTime ceremonyTime, String venueName, String venueAddress, BigDecimal totalBudget, String currencyCode) {}
    public record WeddingResponse(Long id, String uuid, String slug, String title, LocalDate weddingDate,
        String venueName, BigDecimal totalBudget, String currencyCode, String status) {}
}
