package com.weddingplatform.guest.infrastructure.persistence.adapter;
import com.weddingplatform.guest.domain.model.Guest;
import com.weddingplatform.guest.domain.repository.GuestRepository;
import com.weddingplatform.guest.infrastructure.persistence.entity.GuestEntity;
import com.weddingplatform.guest.infrastructure.persistence.repository.JpaGuestRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import java.util.Optional;

@Component
public class GuestRepositoryAdapter implements GuestRepository {
    private final JpaGuestRepository jpa;
    public GuestRepositoryAdapter(JpaGuestRepository jpa) { this.jpa = jpa; }

    @Override public Guest save(Guest g) {
        GuestEntity e;
        if (g.id() != null) {
            e = jpa.findById(g.id()).orElse(new GuestEntity());
        } else { e = new GuestEntity(); }
        e.setWeddingId(g.weddingId()); e.setGuestGroupId(g.guestGroupId()); e.setUserId(g.userId());
        e.setFirstName(g.firstName()); e.setLastName(g.lastName()); e.setEmail(g.email()); e.setPhone(g.phone());
        e.setRsvpStatus(g.rsvpStatus()); e.setRsvpRespondedAt(g.rsvpRespondedAt());
        e.setPlusOneAllowed(g.plusOneAllowed()); e.setPlusOneName(g.plusOneName());
        e.setDietaryRestrictions(g.dietaryRestrictions()); e.setNotes(g.notes());
        e.setInvitationSentAt(g.invitationSentAt());
        return toDomain(jpa.save(e));
    }
    @Override public Optional<Guest> findById(Long id) { return jpa.findById(id).map(this::toDomain); }
    @Override public Page<Guest> findByWeddingId(Long wid, String status, Pageable p) {
        return jpa.findByWeddingIdAndOptionalStatus(wid, status, p).map(this::toDomain);
    }
    @Override public long countByWeddingId(Long wid) { return jpa.countByWeddingId(wid); }
    @Override public long countByWeddingIdAndRsvpStatus(Long wid, String s) { return jpa.countByWeddingIdAndRsvpStatus(wid, s); }
    @Override public void deleteById(Long id) { jpa.deleteById(id); }

    private Guest toDomain(GuestEntity e) {
        return new Guest(e.getId(), e.getWeddingId(), e.getGuestGroupId(), e.getUserId(),
            e.getFirstName(), e.getLastName(), e.getEmail(), e.getPhone(), e.getRsvpStatus(),
            e.getRsvpRespondedAt(), e.isPlusOneAllowed(), e.getPlusOneName(),
            e.getDietaryRestrictions(), e.getNotes(), e.getInvitationSentAt(), e.getCreatedAt());
    }
}
