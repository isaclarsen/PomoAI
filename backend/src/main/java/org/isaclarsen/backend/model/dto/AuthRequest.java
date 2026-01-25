package org.isaclarsen.backend.model.dto;

public record AuthRequest(
        String email,
        String displayName,
        String educationLevel
) {}
