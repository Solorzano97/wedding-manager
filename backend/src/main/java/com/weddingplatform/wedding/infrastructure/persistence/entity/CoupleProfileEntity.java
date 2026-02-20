package com.weddingplatform.wedding.infrastructure.persistence.entity;
import com.weddingplatform.shared.infrastructure.persistence.BaseEntity;
import jakarta.persistence.*;

@Entity @Table(name = "couple_profiles")
public class CoupleProfileEntity extends BaseEntity {
    @Column(name = "user_id", nullable = false, unique = true) private Long userId;
    @Column(name = "first_name", nullable = false, length = 100) private String firstName;
    @Column(name = "last_name", nullable = false, length = 100) private String lastName;
    @Column(length = 20) private String phone;
    @Column(name = "avatar_url", length = 500) private String avatarUrl;

    public Long getUserId() { return userId; } public void setUserId(Long v) { this.userId = v; }
    public String getFirstName() { return firstName; } public void setFirstName(String v) { this.firstName = v; }
    public String getLastName() { return lastName; } public void setLastName(String v) { this.lastName = v; }
    public String getPhone() { return phone; } public void setPhone(String v) { this.phone = v; }
    public String getAvatarUrl() { return avatarUrl; } public void setAvatarUrl(String v) { this.avatarUrl = v; }
}
