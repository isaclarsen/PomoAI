package org.isaclarsen.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.isaclarsen.backend.exception.ResourceNotFoundException;
import org.isaclarsen.backend.model.PomoSession;
import org.isaclarsen.backend.model.User;
import org.isaclarsen.backend.model.dto.*;
import org.isaclarsen.backend.model.enums.Status;
import org.isaclarsen.backend.repository.PomoSessionRepository;
import org.isaclarsen.backend.repository.UserRepository;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PomoSessionService {

    private final PomoSessionRepository pomoSessionRepository;
    private final UserRepository userRepository;
    private final ChatClient chatClient;
    private final ObjectMapper objectMapper;

    @Autowired
    public PomoSessionService(
            PomoSessionRepository pomoSessionRepository,
            ChatClient.Builder chatClientBuilder,
            ObjectMapper objectMapper,
            UserRepository userRepository)
    {
        this.pomoSessionRepository = pomoSessionRepository;
        this.chatClient = chatClientBuilder.build();
        this.objectMapper = objectMapper;
        this.userRepository = userRepository;
    }

    public CreateSessionResponse createGuestSession(CreateSessionRequest request) {
        PomoSession pomoSession = new PomoSession();
        pomoSession.setTopic(request.topicText());
        pomoSession.setStatus(Status.IN_PROGRESS);
        pomoSession.setDurationMinutes(25);

        pomoSessionRepository.save(pomoSession);

        return new CreateSessionResponse(
                pomoSession.getSessionId(),
                pomoSession.getDurationMinutes(),
                pomoSession.getStatus(),
                pomoSession.getAccessToken()
        );
    }

    public CreateSessionResponse createUserSession(CreateSessionRequest request, String firebaseId) {
            User user = userRepository.findByFirebaseId(firebaseId)
                    .orElseThrow(() -> new ResourceNotFoundException("Firebase User not found"));

            PomoSession pomoSession = new PomoSession();
            pomoSession.setUser(user);
            pomoSession.setTopic(request.topicText());
            pomoSession.setStatus(Status.IN_PROGRESS);
            pomoSession.setDurationMinutes(25);

            pomoSessionRepository.save(pomoSession);

            return new CreateSessionResponse(
                    pomoSession.getSessionId(),
                    pomoSession.getDurationMinutes(),
                    pomoSession.getStatus(),
                    pomoSession.getAccessToken()
            );
    }

    public UpdateSessionResponse updateSession(Long sessionId, UpdateSessionRequest request) {
        PomoSession pomoToUpdate = pomoSessionRepository.findById(sessionId)
                .orElseThrow(() -> {
                    String message = "Session with id " + sessionId + " not found";
                    return new ResourceNotFoundException(message);
                });

        if(!pomoToUpdate.getAccessToken().equals(request.accessToken())){
            //TODO: Ändra till 403 senare
            throw new RuntimeException("Unauthorized: Access Token mismatch for this session");
        }

        List<QuestionsDTO> aiQuestions = null;
        try {
            Status newStatus = Status.valueOf(request.status());
            pomoToUpdate.setStatus(newStatus);

            //When status is completed, call AI and generate questions
            if (newStatus.equals(Status.COMPLETED)) {
                GenerateQuestionsResponse response = generateQuestions(pomoToUpdate);
                pomoToUpdate.setQuestionsJson(response.jsonString());
                aiQuestions = response.aiQuestions();
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

    private GenerateQuestionsResponse generateQuestions(PomoSession pomoToUpdate) throws JsonProcessingException {
        List<QuestionsDTO> aiQuestions;
        String promptText = """
                You are a strict teacher. Your task is to generate 3 study questions based on a topic.
                
                Topic: <topic>%s</topic>
                
                Instructions:
                1. Language: Detect the language of the topic inside the tags. You MUST generate the questions in the SAME language as the topic.
                2. Format: Return ONLY a raw JSON list (array). Do not use markdown (```json).
                3. Structure per object:
                    - 'id' (integer)
                    - 'text' (string, the question)
                    - 'options' (array of 4 strings: 1 correct, 3 distractors)
                    - 'correctAnswer' (string, MUST match one of the options exactly)
                
                CRITICAL CONSTRAINT FOR ACTIVE RECALL:
                4. The question MUST be answerable without seeing the options.\s
                    - BAD: "Which of the following statements is true?" (Depends on options)
                    - GOOD: "What is the main function of the kidneys?" (Can be answered alone)
                    - DO NOT start questions with "Which of the following...".
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
        return new GenerateQuestionsResponse(jsonString, aiQuestions);
    }

}
