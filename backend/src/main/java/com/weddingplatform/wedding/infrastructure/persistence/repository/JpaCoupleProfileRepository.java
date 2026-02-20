package com.weddingplatform.wedding.infrastructure.persistence.repository;
import com.weddingplatform.wedding.infrastructure.persistence.entity.CoupleProfileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface JpaCoupleProfileRepository extends JpaRepository<CoupleProfileEntity, Long> {
    Optional<CoupleProfileEntity> findByUserId(Long userId);
}
