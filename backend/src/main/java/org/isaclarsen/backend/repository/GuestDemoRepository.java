package org.isaclarsen.backend.repository;

import org.isaclarsen.backend.model.GuestDemo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GuestDemoRepository extends JpaRepository<GuestDemo, Long> {
}
