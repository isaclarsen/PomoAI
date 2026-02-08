package org.isaclarsen.backend.model.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record PomoSettingsRequest(
        @Min(3) @Max(60) @NotNull Integer focusMinutes,
        @Min(1) @Max(30) @NotNull  Integer relaxMinutes,
        @Min(1) @Max(8) @NotNull  Integer questionCount
) {
}
