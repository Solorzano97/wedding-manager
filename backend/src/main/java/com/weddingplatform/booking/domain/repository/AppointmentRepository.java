package com.weddingplatform.booking.domain.repository;
import com.weddingplatform.booking.domain.model.Appointment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Optional;
public interface AppointmentRepository {
    Appointment save(Appointment appt);
    Optional<Appointment> findById(Long id);
    Optional<Appointment> findByUuid(String uuid);
    Page<Appointment> findByWeddingId(Long weddingId, Pageable pageable);
    Page<Appointment> findByVendorProfileId(Long vendorProfileId, Pageable pageable);
}
