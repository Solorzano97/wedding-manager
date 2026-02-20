package com.weddingplatform.vendor.infrastructure.persistence.entity;
import jakarta.persistence.*;

@Entity @Table(name = "service_categories")
public class ServiceCategoryEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false, length = 100) private String name;
    @Column(nullable = false, unique = true, length = 100) private String slug;
    @Column(name = "icon_url", length = 500) private String iconUrl;
    @Column(length = 500) private String description;
    @Column(name = "sort_order", nullable = false) private int sortOrder;
    @Column(name = "is_active", nullable = false) private boolean active = true;

    public Long getId() { return id; } public void setId(Long v) { this.id = v; }
    public String getName() { return name; } public void setName(String v) { this.name = v; }
    public String getSlug() { return slug; } public void setSlug(String v) { this.slug = v; }
    public String getIconUrl() { return iconUrl; } public void setIconUrl(String v) { this.iconUrl = v; }
    public String getDescription() { return description; } public void setDescription(String v) { this.description = v; }
    public int getSortOrder() { return sortOrder; } public void setSortOrder(int v) { this.sortOrder = v; }
    public boolean isActive() { return active; } public void setActive(boolean v) { this.active = v; }
}
