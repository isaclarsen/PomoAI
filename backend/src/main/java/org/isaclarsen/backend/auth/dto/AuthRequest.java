package org.isaclarsen.backend.auth.dto;

public record AuthRequest(
        String email,
        String displayName,
        String educationLevel
) {}
