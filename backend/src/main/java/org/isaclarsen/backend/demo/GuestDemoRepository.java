package org.isaclarsen.backend.demo;

import org.isaclarsen.backend.demo.model.GuestDemo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GuestDemoRepository extends JpaRepository<GuestDemo, Long> {
}
