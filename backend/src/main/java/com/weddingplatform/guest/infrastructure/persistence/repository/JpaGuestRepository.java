package com.weddingplatform.guest.infrastructure.persistence.repository;
import com.weddingplatform.guest.infrastructure.persistence.entity.GuestEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface JpaGuestRepository extends JpaRepository<GuestEntity, Long> {
    @Query("SELECT g FROM GuestEntity g WHERE g.weddingId = :wid AND (:status IS NULL OR g.rsvpStatus = :status)")
    Page<GuestEntity> findByWeddingIdAndOptionalStatus(@Param("wid") Long weddingId, @Param("status") String status, Pageable pageable);
    long countByWeddingId(Long weddingId);
    long countByWeddingIdAndRsvpStatus(Long weddingId, String rsvpStatus);
}
