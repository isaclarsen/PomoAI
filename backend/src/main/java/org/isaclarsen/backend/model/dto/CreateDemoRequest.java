package org.isaclarsen.backend.model.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateDemoRequest(
        @NotBlank(message = "Topic cannot be empty")
        @Size(min = 2, message= "Topic must be at least 2 characters")
        String topic
) {
}
