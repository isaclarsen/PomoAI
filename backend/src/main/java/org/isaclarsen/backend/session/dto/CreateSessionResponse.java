package org.isaclarsen.backend.session.dto;

import org.isaclarsen.backend.user.model.PomoSettings;
import org.isaclarsen.backend.session.model.Status;

public record CreateSessionResponse(
        Long sessionId,
        PomoSettings pomoSettings,
        Status status
)
{ }
