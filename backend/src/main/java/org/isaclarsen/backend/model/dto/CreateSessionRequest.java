package org.isaclarsen.backend.model.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateSessionRequest(
        @NotBlank
        @Size(min = 2, message= "Topic must be at least 2 characters")
        String topic,

        @Valid
        PomoSettingsRequest pomoSettings
)
{}
