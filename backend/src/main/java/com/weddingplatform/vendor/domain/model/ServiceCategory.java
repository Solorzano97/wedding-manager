package com.weddingplatform.vendor.domain.model;
public record ServiceCategory(Long id, String name, String slug, String iconUrl, String description, int sortOrder, boolean active) {}
