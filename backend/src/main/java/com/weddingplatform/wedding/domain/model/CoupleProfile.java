package com.weddingplatform.wedding.domain.model;
import java.time.LocalDateTime;
public record CoupleProfile(Long id, Long userId, String firstName, String lastName, String phone, String avatarUrl, LocalDateTime createdAt) {}
