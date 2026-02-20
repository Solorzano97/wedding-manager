package com.weddingplatform.wedding.infrastructure.persistence.repository;
import com.weddingplatform.wedding.infrastructure.persistence.entity.WeddingEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface JpaWeddingRepository extends JpaRepository<WeddingEntity, Long> {
    Optional<WeddingEntity> findByUuidAndDeletedAtIsNull(String uuid);
    Optional<WeddingEntity> findBySlugAndDeletedAtIsNull(String slug);
    boolean existsBySlug(String slug);
    @Query("SELECT w FROM WeddingEntity w WHERE (w.partnerOneId = :pid OR w.partnerTwoId = :pid) AND w.deletedAt IS NULL")
    Page<WeddingEntity> findByPartnerId(@Param("pid") Long pid, Pageable pageable);
}
