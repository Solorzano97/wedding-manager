package com.weddingplatform.booking.application.usecase;
import com.weddingplatform.booking.application.dto.BookingDtos.*;
import com.weddingplatform.booking.domain.model.Appointment;
import com.weddingplatform.booking.domain.repository.AppointmentRepository;
import com.weddingplatform.shared.application.dto.PageResponse;
import com.weddingplatform.shared.domain.exception.ResourceNotFoundException;
import com.weddingplatform.wedding.domain.repository.CoupleProfileRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service
public class ManageAppointmentsUseCase {
    private final AppointmentRepository apptRepo;
    private final CoupleProfileRepository coupleRepo;
    public ManageAppointmentsUseCase(AppointmentRepository apptRepo, CoupleProfileRepository coupleRepo) {
        this.apptRepo = apptRepo; this.coupleRepo = coupleRepo;
    }

    @Transactional
    public AppointmentResponse create(Long userId, Long weddingId, CreateAppointmentRequest req) {
        var profile = coupleRepo.findByUserId(userId)
            .orElseThrow(() -> new ResourceNotFoundException("CoupleProfile", "userId", userId));
        Appointment appt = new Appointment(null, UUID.randomUUID().toString(), weddingId,
            req.vendorProfileId(), profile.id(), null, req.appointmentDate(), req.startTime(), req.endTime(),
            req.meetingType() != null ? req.meetingType() : "video_call",
            req.meetingUrl(), req.location(), "requested", req.notes(), null, null);
        return toResponse(apptRepo.save(appt));
    }

    @Transactional(readOnly = true)
    public PageResponse<AppointmentResponse> getByWedding(Long weddingId, Pageable pageable) {
        return PageResponse.of(apptRepo.findByWeddingId(weddingId, pageable).map(this::toResponse));
    }

    @Transactional(readOnly = true)
    public PageResponse<AppointmentResponse> getByVendorProfile(Long vendorProfileId, Pageable pageable) {
        return PageResponse.of(apptRepo.findByVendorProfileId(vendorProfileId, pageable).map(this::toResponse));
    }

    @Transactional
    public AppointmentResponse updateStatus(String uuid, UpdateAppointmentStatusRequest req) {
        Appointment a = apptRepo.findByUuid(uuid).orElseThrow(() -> new ResourceNotFoundException("Appointment", "uuid", uuid));
        Appointment updated = new Appointment(a.id(), a.uuid(), a.weddingId(), a.vendorProfileId(), a.coupleProfileId(),
            a.quoteId(), a.appointmentDate(), a.startTime(), a.endTime(), a.meetingType(),
            a.meetingUrl(), a.location(), req.status(), a.notes(), req.cancellationReason(), a.createdAt());
        return toResponse(apptRepo.save(updated));
    }

    private AppointmentResponse toResponse(Appointment a) {
        return new AppointmentResponse(a.id(), a.uuid(), a.weddingId(), a.vendorProfileId(), a.coupleProfileId(),
            a.appointmentDate(), a.startTime(), a.endTime(), a.meetingType(),
            a.meetingUrl(), a.location(), a.status(), a.notes(), a.createdAt());
    }
}
