package com.weddingplatform.guest.domain.repository;
import com.weddingplatform.guest.domain.model.Guest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Optional;
public interface GuestRepository {
    Guest save(Guest guest);
    Optional<Guest> findById(Long id);
    Page<Guest> findByWeddingId(Long weddingId, String rsvpStatus, Pageable pageable);
    long countByWeddingId(Long weddingId);
    long countByWeddingIdAndRsvpStatus(Long weddingId, String status);
    void deleteById(Long id);
}
