package org.isaclarsen.backend.model.dto;

import java.util.List;

public record GenerateQuestionsResponse(
        String jsonString,
        List<QuestionsDTO> aiQuestions

) {
}
