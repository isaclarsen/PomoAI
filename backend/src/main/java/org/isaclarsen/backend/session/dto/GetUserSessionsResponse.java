package org.isaclarsen.backend.session.dto;

import org.isaclarsen.backend.session.model.TopicCategory;
import org.isaclarsen.backend.user.model.PomoSettings;

import java.time.Instant;

public record GetUserSessionsResponse(
        String topic,
        TopicCategory topicCategory,
        int wrongCount,
        int correctCount,
        Instant createdAt,
        Long durationSeconds,
        PomoSettings pomoSettings

) {
}
