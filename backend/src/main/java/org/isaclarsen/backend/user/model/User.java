package org.isaclarsen.backend.user.model;

import jakarta.persistence.*;
import org.isaclarsen.backend.user.model.EducationLevel;

import java.time.Instant;

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
    @Enumerated(EnumType.STRING)
    private EducationLevel educationLevel;

    @Column(unique = true)
    private String displayName;

    @Column()
    private Instant createdAt;

    @Column()
    private Instant lastLogin;

    @Embedded
    private PomoSettings pomoSettings;

    public User(Long userId, String firebaseId, String email, EducationLevel educationLevel, String displayName, Instant createdAt,  Instant lastLogin) {
        this.userId = userId;
        this.firebaseId = firebaseId;
        this.email = email;
        this.educationLevel = educationLevel;
        this.displayName = displayName;
        this.createdAt = createdAt;
        this.lastLogin = lastLogin;
    }

    public User() {
        this.pomoSettings = new PomoSettings();
    }

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

    public EducationLevel getEducationLevel() {
        return educationLevel;
    }

    public void setEducationLevel(EducationLevel educationLevel) {
        this.educationLevel = educationLevel;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }
    public Instant getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
    public Instant getLastLogin() {
        return lastLogin;
    }
    public void setLastLogin(Instant lastLogin) {
        this.lastLogin = lastLogin;
    }

    public PomoSettings getPomoSettings() {return pomoSettings;}

    public void setPomoSettings(PomoSettings pomoSettings) {this.pomoSettings = pomoSettings;}
}
