package org.isaclarsen.backend.session.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.isaclarsen.backend.user.model.PomoSettings;
import org.isaclarsen.backend.user.model.User;

import java.time.Instant;

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
    private Instant createdAt;

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
    private TopicCategory topicCategory;

    @Column
    @Enumerated(EnumType.STRING)
    private Status status;

    public PomoSession(Long sessionId, User user, PomoSettings pomoSettings, Instant createdAt, Instant completedAt, String questionsJson, int correctCount, int wrongCount, String topic, TopicCategory topicCategory, Status status) {
        this.sessionId = sessionId;
        this.user = user;
        this.pomoSettings = pomoSettings;
        this.createdAt = createdAt;
        this.completedAt = completedAt;
        this.questionsJson = questionsJson;
        this.correctCount = correctCount;
        this.wrongCount = wrongCount;
        this.topic = topic;
        this.topicCategory = topicCategory;
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

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
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

    public TopicCategory getTopicCategory() {
        return topicCategory;
    }

    public void setTopicCategory(TopicCategory topicCategory) {
        this.topicCategory = topicCategory;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }
}
