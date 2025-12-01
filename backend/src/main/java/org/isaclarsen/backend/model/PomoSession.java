package org.isaclarsen.backend.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.isaclarsen.backend.model.enums.Status;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
public class PomoSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sessionId;

    @ManyToOne
    @JoinColumn(name = "userId")
    private User user;

    @Column
    private int durationMinutes;

    @Column
    @CreationTimestamp
    private LocalDateTime timestamp;

    @Column(columnDefinition = "TEXT")
    private String questionsJson;

    @Column
    private String topic;

    @Column
    @Enumerated(EnumType.STRING)
    private Status status;

    public PomoSession(Long sessionId, User user, int durationMinutes, LocalDateTime timestamp, String questionsJson, String topic, Status status) {
        this.sessionId = sessionId;
        this.user = user;
        this.durationMinutes = durationMinutes;
        this.timestamp = timestamp;
        this.questionsJson = questionsJson;
        this.topic = topic;
        this.status = status;
    }

    public PomoSession() {}

    public Long getSessionId() {
        return sessionId;
    }

    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public int getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(int durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getQuestionsJson() {
        return questionsJson;
    }

    public void setQuestionsJson(String questionsJson) {
        this.questionsJson = questionsJson;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }
}
