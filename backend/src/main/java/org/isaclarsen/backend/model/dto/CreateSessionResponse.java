package org.isaclarsen.backend.model.dto;

import org.isaclarsen.backend.model.PomoSettings;
import org.isaclarsen.backend.model.enums.Status;

import java.util.List;

public record CreateSessionResponse(
        Long sessionId,
        PomoSettings pomoSettings,
        Status status
)
{ }
