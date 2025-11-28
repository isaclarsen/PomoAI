package org.isaclarsen.backend.model.dto;

import org.isaclarsen.backend.model.enums.EducationLevel;

public record AuthRequest(
        String email,
        String displayName,
        String educationLevel
) {}
