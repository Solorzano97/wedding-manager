package com.weddingplatform.guest.infrastructure.persistence.entity;
import com.weddingplatform.shared.infrastructure.persistence.BaseEntity;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity @Table(name = "guests")
public class GuestEntity extends BaseEntity {
    @Column(name = "wedding_id", nullable = false) private Long weddingId;
    @Column(name = "guest_group_id") private Long guestGroupId;
    @Column(name = "user_id") private Long userId;
    @Column(name = "first_name", nullable = false, length = 100) private String firstName;
    @Column(name = "last_name", nullable = false, length = 100) private String lastName;
    @Column(length = 255) private String email;
    @Column(length = 20) private String phone;
    @Column(name = "rsvp_status", nullable = false, length = 20) private String rsvpStatus = "pending";
    @Column(name = "rsvp_responded_at") private LocalDateTime rsvpRespondedAt;
    @Column(name = "plus_one_allowed", nullable = false) private boolean plusOneAllowed;
    @Column(name = "plus_one_name", length = 200) private String plusOneName;
    @Column(name = "dietary_restrictions", length = 255) private String dietaryRestrictions;
    @Column(columnDefinition = "TEXT") private String notes;
    @Column(name = "invitation_sent_at") private LocalDateTime invitationSentAt;

    public Long getWeddingId() { return weddingId; } public void setWeddingId(Long v) { this.weddingId = v; }
    public Long getGuestGroupId() { return guestGroupId; } public void setGuestGroupId(Long v) { this.guestGroupId = v; }
    public Long getUserId() { return userId; } public void setUserId(Long v) { this.userId = v; }
    public String getFirstName() { return firstName; } public void setFirstName(String v) { this.firstName = v; }
    public String getLastName() { return lastName; } public void setLastName(String v) { this.lastName = v; }
    public String getEmail() { return email; } public void setEmail(String v) { this.email = v; }
    public String getPhone() { return phone; } public void setPhone(String v) { this.phone = v; }
    public String getRsvpStatus() { return rsvpStatus; } public void setRsvpStatus(String v) { this.rsvpStatus = v; }
    public LocalDateTime getRsvpRespondedAt() { return rsvpRespondedAt; } public void setRsvpRespondedAt(LocalDateTime v) { this.rsvpRespondedAt = v; }
    public boolean isPlusOneAllowed() { return plusOneAllowed; } public void setPlusOneAllowed(boolean v) { this.plusOneAllowed = v; }
    public String getPlusOneName() { return plusOneName; } public void setPlusOneName(String v) { this.plusOneName = v; }
    public String getDietaryRestrictions() { return dietaryRestrictions; } public void setDietaryRestrictions(String v) { this.dietaryRestrictions = v; }
    public String getNotes() { return notes; } public void setNotes(String v) { this.notes = v; }
    public LocalDateTime getInvitationSentAt() { return invitationSentAt; } public void setInvitationSentAt(LocalDateTime v) { this.invitationSentAt = v; }
}
