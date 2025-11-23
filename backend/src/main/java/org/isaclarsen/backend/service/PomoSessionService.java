package org.isaclarsen.backend.service;

import org.isaclarsen.backend.exception.ResourceNotFoundException;
import org.isaclarsen.backend.model.PomoSession;
import org.isaclarsen.backend.model.dto.*;
import org.isaclarsen.backend.model.enums.Status;
import org.isaclarsen.backend.repository.PomoSessionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PomoSessionService {

    private final PomoSessionRepository pomoSessionRepository;

    public PomoSessionService(PomoSessionRepository pomoSessionRepository) {
        this.pomoSessionRepository = pomoSessionRepository;
    }

    public CreateSessionResponse createGuestSession(CreateSessionRequest createSessionRequest) {
        PomoSession pomoSessions = new PomoSession();
        pomoSessions.setTopic(createSessionRequest.topicText());
        pomoSessions.setStatus(Status.IN_PROGRESS);
        pomoSessions.setQuestionsJson(
                "[{\"id\":1, \"text\":\"Vad är skillnaden mellan en klass och ett objekt?\"}, {\"id\":2, \"text\":\"Hur skapar du en funktion i Java?\"}]"
        );
        pomoSessions.setDurationMinutes(25);

        List<QuestionsDTO> mockQuestions = List.of(
                new QuestionsDTO(1L, "Vad är skillnaden mellan en klass och ett objekt?"),
                new QuestionsDTO(2L, "Hur skapar du en funktion i Java?")
        );

        pomoSessionRepository.save(pomoSessions);

        return new CreateSessionResponse(
                pomoSessions.getSessionId(),
                Status.IN_PROGRESS,
                mockQuestions
        );
    }

    public UpdateSessionResponse updateSession(Long sessionId, UpdateSessionRequest updateSessionRequest) {
        PomoSession pomoToUpdate = pomoSessionRepository.findById(sessionId)
                .orElseThrow(() -> {
                    String message = "Session with id " + sessionId + " not found";
                    return new ResourceNotFoundException(message);
        });

        try {
            Status newStatus = Status.valueOf(updateSessionRequest.status());
            pomoToUpdate.setStatus(newStatus);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status provided: " + updateSessionRequest.status());
        }

        pomoSessionRepository.save(pomoToUpdate);
        return new UpdateSessionResponse(
                "Session with ID: " + sessionId +  " successfully updated. Generating questions process begins..."
        );
    }

}
