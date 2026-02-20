package com.weddingplatform.messaging.infrastructure.persistence.entity;
import com.weddingplatform.shared.infrastructure.persistence.BaseEntity;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity @Table(name = "conversations")
public class ConversationEntity extends BaseEntity {
    @Column(nullable = false, unique = true, length = 36) private String uuid;
    @Column(name = "wedding_id", nullable = false) private Long weddingId;
    @Column(name = "vendor_profile_id", nullable = false) private Long vendorProfileId;
    @Column(name = "couple_profile_id", nullable = false) private Long coupleProfileId;
    @Column(nullable = false, length = 20) private String status = "active";
    @Column(name = "last_message_at") private LocalDateTime lastMessageAt;

    public String getUuid() { return uuid; } public void setUuid(String v) { this.uuid = v; }
    public Long getWeddingId() { return weddingId; } public void setWeddingId(Long v) { this.weddingId = v; }
    public Long getVendorProfileId() { return vendorProfileId; } public void setVendorProfileId(Long v) { this.vendorProfileId = v; }
    public Long getCoupleProfileId() { return coupleProfileId; } public void setCoupleProfileId(Long v) { this.coupleProfileId = v; }
    public String getStatus() { return status; } public void setStatus(String v) { this.status = v; }
    public LocalDateTime getLastMessageAt() { return lastMessageAt; } public void setLastMessageAt(LocalDateTime v) { this.lastMessageAt = v; }
}
