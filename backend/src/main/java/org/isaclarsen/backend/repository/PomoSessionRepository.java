package org.isaclarsen.backend.repository;

import org.isaclarsen.backend.model.PomoSession;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PomoSessionRepository extends JpaRepository<PomoSession, Long> {
}
