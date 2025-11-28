package org.isaclarsen.backend.model;

import jakarta.persistence.*;
import org.isaclarsen.backend.model.enums.EducationLevel;

import java.time.LocalDateTime;

@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(unique = true)
    private String firebaseId;

    @Column(unique = true)
    private String email;

    @Column()
    private String educationLevel;

    @Column(unique = true)
    private String displayName;

    @Column()
    private LocalDateTime lastLogin;

    public User(Long userId, String firebaseId, String email, String educationLevel, String displayName,  LocalDateTime lastLogin) {
        this.userId = userId;
        this.firebaseId = firebaseId;
        this.email = email;
        this.educationLevel = educationLevel;
        this.displayName = displayName;
        this.lastLogin = lastLogin;
    }

    public User() {}

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getFirebaseId() {
        return firebaseId;
    }

    public void setFirebaseId(String firebaseId) {
        this.firebaseId = firebaseId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getEducationLevel() {
        return educationLevel;
    }

    public void setEducationLevel(String educationLevel) {
        this.educationLevel = educationLevel;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }
    public LocalDateTime getLastLogin() {
        return lastLogin;
    }
    public void setLastLogin(LocalDateTime lastLogin) {
        this.lastLogin = lastLogin;
    }
}
