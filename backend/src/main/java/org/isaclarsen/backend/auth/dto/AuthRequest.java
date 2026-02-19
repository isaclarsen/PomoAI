package org.isaclarsen.backend.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AuthRequest(
        @Email(message = "Email format is invalid")
        @NotBlank(message = "Email is required")
        String email,

        @Size(max = 30, message = "Display name is too long")
        String displayName,

        String educationLevel
) {}
