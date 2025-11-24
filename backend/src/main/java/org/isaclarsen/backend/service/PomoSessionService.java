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

import java.util.ArrayList;
import java.util.List;

@Service
public class PomoSessionService {

    private final PomoSessionRepository pomoSessionRepository;
    private final ChatClient chatClient;
    private final ObjectMapper objectMapper;

    public PomoSessionService(PomoSessionRepository pomoSessionRepository, ChatClient.Builder chatClientBuilder, ObjectMapper objectMapper) {
        this.pomoSessionRepository = pomoSessionRepository;
        this.chatClient = chatClientBuilder.build();
        this.objectMapper = objectMapper;
    }

    public CreateSessionResponse createGuestSession(CreateSessionRequest createSessionRequest) {
        PomoSession pomoSession = new PomoSession();
        pomoSession.setTopic(createSessionRequest.topicText());
        pomoSession.setStatus(Status.IN_PROGRESS);
        pomoSession.setDurationMinutes(25);

        pomoSessionRepository.save(pomoSession);

        return new CreateSessionResponse(
                pomoSession.getSessionId(),
                pomoSession.getDurationMinutes(),
                pomoSession.getStatus()
        );
    }

    public UpdateSessionResponse updateSession(Long sessionId, UpdateSessionRequest request) {
        PomoSession pomoToUpdate = pomoSessionRepository.findById(sessionId)
                .orElseThrow(() -> {
                    String message = "Session with id " + sessionId + " not found";
                    return new ResourceNotFoundException(message);
                });

        List<QuestionsDTO> aiQuestions = new ArrayList<>();

        try {
            Status newStatus = Status.valueOf(request.status());
            pomoToUpdate.setStatus(newStatus);

            //When status is completed, call AI and generate questions
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

                //Send the prompt to AI and convert to QuestionsDTO object to validate structure
                aiQuestions = chatClient.prompt()
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
                aiQuestions
        );
    }

}
