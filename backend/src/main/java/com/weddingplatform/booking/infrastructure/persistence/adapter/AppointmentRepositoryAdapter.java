package com.weddingplatform.booking.infrastructure.persistence.adapter;
import com.weddingplatform.booking.domain.model.Appointment;
import com.weddingplatform.booking.domain.repository.AppointmentRepository;
import com.weddingplatform.booking.infrastructure.persistence.entity.AppointmentEntity;
import com.weddingplatform.booking.infrastructure.persistence.repository.JpaAppointmentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Component
public class AppointmentRepositoryAdapter implements AppointmentRepository {
    private final JpaAppointmentRepository jpa;
    public AppointmentRepositoryAdapter(JpaAppointmentRepository jpa) { this.jpa = jpa; }
    @Override public Appointment save(Appointment a) {
        AppointmentEntity e = a.id() != null ? jpa.findById(a.id()).orElse(new AppointmentEntity()) : new AppointmentEntity();
        e.setUuid(a.uuid()); e.setWeddingId(a.weddingId()); e.setVendorProfileId(a.vendorProfileId());
        e.setCoupleProfileId(a.coupleProfileId()); e.setQuoteId(a.quoteId());
        e.setAppointmentDate(a.appointmentDate()); e.setStartTime(a.startTime()); e.setEndTime(a.endTime());
        e.setMeetingType(a.meetingType()); e.setMeetingUrl(a.meetingUrl()); e.setLocation(a.location());
        e.setStatus(a.status()); e.setNotes(a.notes()); e.setCancellationReason(a.cancellationReason());
        return toDomain(jpa.save(e));
    }
    @Override public Optional<Appointment> findById(Long id) { return jpa.findById(id).map(this::toDomain); }
    @Override public Optional<Appointment> findByUuid(String uuid) { return jpa.findByUuid(uuid).map(this::toDomain); }
    @Override public Page<Appointment> findByWeddingId(Long wid, Pageable p) { return jpa.findByWeddingId(wid, p).map(this::toDomain); }
    @Override public Page<Appointment> findByVendorProfileId(Long vpid, Pageable p) { return jpa.findByVendorProfileId(vpid, p).map(this::toDomain); }
    @Override public List<Appointment> findConfirmedByVendor(Long vpid, LocalDate from, LocalDate to) {
        return jpa.findByVendorProfileIdAndAppointmentDateBetweenAndStatusIn(vpid, from, to,
            List.of("requested", "confirmed", "scheduled")).stream().map(this::toDomain).toList();
    }
    private Appointment toDomain(AppointmentEntity e) {
        return new Appointment(e.getId(), e.getUuid(), e.getWeddingId(), e.getVendorProfileId(), e.getCoupleProfileId(),
            e.getQuoteId(), e.getAppointmentDate(), e.getStartTime(), e.getEndTime(), e.getMeetingType(),
            e.getMeetingUrl(), e.getLocation(), e.getStatus(), e.getNotes(), e.getCancellationReason(), e.getCreatedAt());
    }
}
