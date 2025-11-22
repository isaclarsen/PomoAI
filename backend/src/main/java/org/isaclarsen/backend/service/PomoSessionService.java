package org.isaclarsen.backend.service;

import org.isaclarsen.backend.model.PomoSession;
import org.isaclarsen.backend.model.dto.CreateSessionRequest;
import org.isaclarsen.backend.model.dto.CreateSessionResponse;
import org.isaclarsen.backend.model.dto.QuestionsDTO;
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

}
