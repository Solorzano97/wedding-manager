package com.weddingplatform.wedding.domain.model;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public record Wedding(Long id, String uuid, String slug, Long partnerOneId, Long partnerTwoId,
    String title, LocalDate weddingDate, LocalTime ceremonyTime, String venueName, String venueAddress,
    BigDecimal totalBudget, String currencyCode, String status, LocalDateTime createdAt) {}
