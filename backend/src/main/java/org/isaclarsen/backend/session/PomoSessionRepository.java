package org.isaclarsen.backend.session;

import org.isaclarsen.backend.session.model.PomoSession;
import org.isaclarsen.backend.session.model.Status;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PomoSessionRepository extends JpaRepository<PomoSession, Long> {
    List<PomoSession> findAllByUser_FirebaseIdAndStatusAndCompletedAtIsNotNullOrderByCreatedAtDesc(
            String firebaseId,
            Status status
    );

}
