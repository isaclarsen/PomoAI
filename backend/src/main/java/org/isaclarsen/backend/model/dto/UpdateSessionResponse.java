package org.isaclarsen.backend.model.dto;

import java.util.List;

public record UpdateSessionResponse(
        String message,
        List<QuestionsDTO> questions
)
{}
