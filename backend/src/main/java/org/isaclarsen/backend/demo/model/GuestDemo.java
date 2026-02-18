package org.isaclarsen.backend.demo.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
public class GuestDemo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long demoId;

    @Column
    private String topic;

    @Column(columnDefinition = "TEXT")
    private String topicText;

    @Column(columnDefinition = "TEXT")
    private String questionsJson;

    @Column
    @CreationTimestamp
    private LocalDateTime timestamp;

    public GuestDemo(Long demoId, String topic, String questionsJson) {
        this.demoId = demoId;
        this.topic = topic;
        this.questionsJson = questionsJson;
    }

    public GuestDemo(){

    }

    public Long getSessionId() {
        return demoId;
    }

    public void setSessionId(Long sessionId) {
        this.demoId = sessionId;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public String getTopicText() {
        return topicText;
    }

    public void setTopicText(String topicText) {
        this.topicText = topicText;
    }

    public String getQuestionsJson() {
        return questionsJson;
    }

    public void setQuestionsJson(String questionsJson) {
        this.questionsJson = questionsJson;
    }
}
