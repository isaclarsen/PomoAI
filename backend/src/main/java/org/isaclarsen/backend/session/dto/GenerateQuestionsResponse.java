package org.isaclarsen.backend.session.dto;

import java.util.List;

public record GenerateQuestionsResponse(
        String jsonString,
        List<QuestionsDto> aiQuestions

) {
}
