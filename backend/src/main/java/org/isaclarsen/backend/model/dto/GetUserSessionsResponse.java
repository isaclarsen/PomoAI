package org.isaclarsen.backend.model.dto;

import org.isaclarsen.backend.model.PomoSettings;

import java.time.Instant;

public record GetUserSessionsResponse(
        String topic,
        int wrongCount,
        int correctCount,
        Instant createdAt,
        Long durationSeconds,
        PomoSettings pomoSettings

) {
}
