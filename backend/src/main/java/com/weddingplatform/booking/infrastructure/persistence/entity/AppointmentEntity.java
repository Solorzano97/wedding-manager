package com.weddingplatform.booking.infrastructure.persistence.entity;
import com.weddingplatform.shared.infrastructure.persistence.BaseEntity;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity @Table(name = "appointments")
public class AppointmentEntity extends BaseEntity {
    @Column(nullable = false, unique = true, length = 36) private String uuid;
    @Column(name = "wedding_id", nullable = false) private Long weddingId;
    @Column(name = "vendor_profile_id", nullable = false) private Long vendorProfileId;
    @Column(name = "couple_profile_id", nullable = false) private Long coupleProfileId;
    @Column(name = "quote_id") private Long quoteId;
    @Column(name = "appointment_date", nullable = false) private LocalDate appointmentDate;
    @Column(name = "start_time", nullable = false) private LocalTime startTime;
    @Column(name = "end_time", nullable = false) private LocalTime endTime;
    @Column(name = "meeting_type", nullable = false, length = 20) private String meetingType = "video_call";
    @Column(name = "meeting_url", length = 500) private String meetingUrl;
    @Column(length = 500) private String location;
    @Column(nullable = false, length = 20) private String status = "requested";
    @Column(columnDefinition = "TEXT") private String notes;
    @Column(name = "cancellation_reason", length = 500) private String cancellationReason;

    public String getUuid() { return uuid; } public void setUuid(String v) { this.uuid = v; }
    public Long getWeddingId() { return weddingId; } public void setWeddingId(Long v) { this.weddingId = v; }
    public Long getVendorProfileId() { return vendorProfileId; } public void setVendorProfileId(Long v) { this.vendorProfileId = v; }
    public Long getCoupleProfileId() { return coupleProfileId; } public void setCoupleProfileId(Long v) { this.coupleProfileId = v; }
    public Long getQuoteId() { return quoteId; } public void setQuoteId(Long v) { this.quoteId = v; }
    public LocalDate getAppointmentDate() { return appointmentDate; } public void setAppointmentDate(LocalDate v) { this.appointmentDate = v; }
    public LocalTime getStartTime() { return startTime; } public void setStartTime(LocalTime v) { this.startTime = v; }
    public LocalTime getEndTime() { return endTime; } public void setEndTime(LocalTime v) { this.endTime = v; }
    public String getMeetingType() { return meetingType; } public void setMeetingType(String v) { this.meetingType = v; }
    public String getMeetingUrl() { return meetingUrl; } public void setMeetingUrl(String v) { this.meetingUrl = v; }
    public String getLocation() { return location; } public void setLocation(String v) { this.location = v; }
    public String getStatus() { return status; } public void setStatus(String v) { this.status = v; }
    public String getNotes() { return notes; } public void setNotes(String v) { this.notes = v; }
    public String getCancellationReason() { return cancellationReason; } public void setCancellationReason(String v) { this.cancellationReason = v; }
}
