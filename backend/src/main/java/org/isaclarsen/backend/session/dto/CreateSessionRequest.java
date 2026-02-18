package org.isaclarsen.backend.session.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.isaclarsen.backend.user.dto.PomoSettingsRequest;

public record CreateSessionRequest(
        @NotBlank
        @Size(min = 2, message= "Topic must be at least 2 characters")
        String topic,

        @Valid
        PomoSettingsRequest pomoSettings
)
{}
