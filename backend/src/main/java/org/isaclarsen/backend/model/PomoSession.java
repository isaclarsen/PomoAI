package org.isaclarsen.backend.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.isaclarsen.backend.model.enums.Status;

import java.time.Instant;
import java.time.LocalDateTime;

@Entity
public class PomoSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sessionId;

    @ManyToOne
    @JoinColumn(name = "userId")
    private User user;

    @Embedded
    private PomoSettings pomoSettings;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant startedAt;

    @Column
    private Instant completedAt;

    @Column(columnDefinition = "TEXT")
    private String questionsJson;

    @Column
    private int correctCount;

    @Column
    private int wrongCount;

    @Column
    private String topic;

    @Column
    @Enumerated(EnumType.STRING)
    private Status status;

    public PomoSession(Long sessionId, User user, PomoSettings pomoSettings, Instant startedAt, Instant completedAt, String questionsJson, int correctCount, int wrongCount, String topic, Status status) {
        this.sessionId = sessionId;
        this.user = user;
        this.pomoSettings = pomoSettings;
        this.startedAt = startedAt;
        this.completedAt = completedAt;
        this.questionsJson = questionsJson;
        this.correctCount = correctCount;
        this.wrongCount = wrongCount;
        this.topic = topic;
        this.status = status;
    }

    public PomoSession(){

    }

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

    public PomoSettings getPomoSettings() {
        return pomoSettings;
    }

    public void setPomoSettings(PomoSettings pomoSettings) {
        this.pomoSettings = pomoSettings;
    }

    public Instant getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(Instant startedAt) {
        this.startedAt = startedAt;
    }

    public Instant getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(Instant completedAt) {
        this.completedAt = completedAt;
    }

    public String getQuestionsJson() {
        return questionsJson;
    }

    public void setQuestionsJson(String questionsJson) {
        this.questionsJson = questionsJson;
    }

    public int getCorrectCount() {
        return correctCount;
    }

    public void setCorrectCount(int correctCount) {
        this.correctCount = correctCount;
    }

    public int getWrongCount() {
        return wrongCount;
    }

    public void setWrongCount(int wrongCount) {
        this.wrongCount = wrongCount;
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
