package org.isaclarsen.backend.session.dto;

import java.util.List;

public record UpdateSessionResponse(
        String message,
        List<QuestionsDto> questions
)
{}
