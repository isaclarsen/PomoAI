package org.isaclarsen.backend.model.dto;

import java.time.Instant;

public record AuthRequest(
        String email,
        String displayName,
        String educationLevel
) {}
