package com.weddingplatform.booking.infrastructure.persistence.repository;
import com.weddingplatform.booking.infrastructure.persistence.entity.AppointmentEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
public interface JpaAppointmentRepository extends JpaRepository<AppointmentEntity, Long> {
    Optional<AppointmentEntity> findByUuid(String uuid);
    Page<AppointmentEntity> findByWeddingId(Long weddingId, Pageable pageable);
    Page<AppointmentEntity> findByVendorProfileId(Long vendorProfileId, Pageable pageable);
    List<AppointmentEntity> findByVendorProfileIdAndAppointmentDateBetweenAndStatusIn(
        Long vendorProfileId, LocalDate from, LocalDate to, List<String> statuses);
}
