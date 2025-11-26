package org.isaclarsen.backend.repository;

import org.isaclarsen.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByFirebaseId(String firebaseId);
}
