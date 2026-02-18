package org.isaclarsen.backend.demo.dto;

import org.isaclarsen.backend.session.dto.QuestionsDto;

import java.util.List;

public record CreateDemoResponse(
        String topicText,
        List<QuestionsDto> questions
) {
}
