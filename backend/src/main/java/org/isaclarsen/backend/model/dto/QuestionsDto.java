package org.isaclarsen.backend.model.dto;

import java.util.List;

public record QuestionsDto(
        Long id,
        String text,
        List<String> options,
        String correctAnswer
)
{ }
