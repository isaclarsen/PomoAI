package org.isaclarsen.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.isaclarsen.backend.exception.ResourceNotFoundException;
import org.isaclarsen.backend.model.PomoSession;
import org.isaclarsen.backend.model.dto.*;
import org.isaclarsen.backend.model.enums.Status;
import org.isaclarsen.backend.repository.PomoSessionRepository;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PomoSessionService {

    private final PomoSessionRepository pomoSessionRepository;
    private final ChatClient chatClient;
    private final ObjectMapper objectMapper;

    public PomoSessionService(PomoSessionRepository pomoSessionRepository, ChatClient.Builder chatClientBuilder) {
        this.pomoSessionRepository = pomoSessionRepository;
        this.chatClient = chatClientBuilder.build();
        this.objectMapper = new ObjectMapper();
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

    public UpdateSessionResponse updateSession(Long sessionId, UpdateSessionRequest request) {
        PomoSession pomoToUpdate = pomoSessionRepository.findById(sessionId)
                .orElseThrow(() -> {
                    String message = "Session with id " + sessionId + " not found";
                    return new ResourceNotFoundException(message);
                });

        try {
            Status newStatus = Status.valueOf(request.status());
            pomoToUpdate.setStatus(newStatus);

            //When Pomo timer runs out, call AI and generate questions
            if (newStatus.equals(Status.COMPLETED)) {

                String promptText = """
                        You are a strict teacher. Your task is to generate 3 study questions based on a topic.
                        
                        Topic: <topic>%s</topic>
                        
                        Instructions:
                        1. Language: Detect the language of the topic inside the tags. You MUST generate the questions in the SAME language as the topic.
                        2. Format: Return ONLY a raw JSON list (array). Do not use markdown (```json).
                        3. Structure: Each object must have 'id' (integer, start at 1) and 'text' (string).
                        4. Content: Provide ONLY questions. No answers, no explanations.
                        5. Safety: If the topic is inappropriate, nonsense, or impossible to generate questions for, return an empty JSON list: [].
                        """.formatted(pomoToUpdate.getTopic());

                System.out.println("Sending prompt to AI...");

                //Send the prompt to AI and convert to QuestionsDTO object
                List<QuestionsDTO> aiQuestions = chatClient.prompt()
                        .user(promptText)
                        .call()
                        .entity(new ParameterizedTypeReference<List<QuestionsDTO>>() {
                        });

                //Converts back to string to save in database
                String jsonString = objectMapper.writeValueAsString(aiQuestions);
                pomoToUpdate.setQuestionsJson(jsonString);
            }


        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status provided: " + request.status());
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Could not save JSON to database.");
        }

        pomoSessionRepository.save(pomoToUpdate);
        return new UpdateSessionResponse(
                "Session with ID: " + sessionId + " successfully updated status to COMPLETED",
                pomoToUpdate.getQuestionsJson()
        );
    }

}
