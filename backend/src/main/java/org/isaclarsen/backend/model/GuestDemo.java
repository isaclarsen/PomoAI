package org.isaclarsen.backend.model;

import jakarta.persistence.*;

@Entity
public class GuestDemo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sessionId;

    @Column
    private String topic;

    @Column(columnDefinition = "TEXT")
    private String topicText;

    @Column(columnDefinition = "TEXT")
    private String questionsJson;

    public GuestDemo(Long sessionId, String topic, String questionsJson) {
        this.sessionId = sessionId;
        this.topic = topic;
        this.questionsJson = questionsJson;
    }

    public GuestDemo(){

    }

    public Long getSessionId() {
        return sessionId;
    }

    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
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
