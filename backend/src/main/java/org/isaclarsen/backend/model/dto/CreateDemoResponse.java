package org.isaclarsen.backend.model.dto;

import java.util.List;

public record CreateDemoResponse(
        String topicText,
        List<QuestionsDto> questions
) {
}
