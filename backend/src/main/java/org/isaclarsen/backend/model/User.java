package org.isaclarsen.backend.model;

import jakarta.persistence.*;
import org.isaclarsen.backend.model.enums.EducationLevel;

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

    public User(Long userId, String firebaseId, String email, EducationLevel educationLevel, String displayName) {
        this.userId = userId;
        this.firebaseId = firebaseId;
        this.email = email;
        this.educationLevel = educationLevel;
        this.displayName = displayName;
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
}
