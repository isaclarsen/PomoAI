package org.isaclarsen.backend.repository;

import org.isaclarsen.backend.model.PomoSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PomoSessionRepository extends JpaRepository<PomoSession, Long> {
    List<PomoSession> findAllByUser_FirebaseIdOrderByCreatedAtDesc(String firebaseId);
}
