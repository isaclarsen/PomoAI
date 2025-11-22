package org.isaclarsen.backend.model.dto;

import org.isaclarsen.backend.model.enums.Status;

import java.util.List;

public record CreateSessionResponse(
        Long sessionId,
        Status status,
        List<QuestionsDTO> questions

)
{ }
