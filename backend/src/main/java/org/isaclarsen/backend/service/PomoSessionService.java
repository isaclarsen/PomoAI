package org.isaclarsen.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.isaclarsen.backend.exception.InvalidSessionTokenException;
import org.isaclarsen.backend.exception.ResourceNotFoundException;
import org.isaclarsen.backend.model.PomoSession;
import org.isaclarsen.backend.model.PomoSettings;
import org.isaclarsen.backend.model.User;
import org.isaclarsen.backend.model.dto.*;
import org.isaclarsen.backend.model.enums.Status;
import org.isaclarsen.backend.repository.PomoSessionRepository;
import org.isaclarsen.backend.repository.UserRepository;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.Instant;
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

    public CreateSessionResponse createUserSession(CreateSessionRequest request, String firebaseId) {
            User user = userRepository.findByFirebaseId(firebaseId)
                    .orElseThrow(() -> new ResourceNotFoundException("Firebase User not found"));

        PomoSession pomoSession = initializePomoSession(request, user);

        pomoSessionRepository.save(pomoSession);

            return new CreateSessionResponse(
                    pomoSession.getSessionId(),
                    pomoSession.getPomoSettings(),
                    pomoSession.getStatus()
            );
    }

    public UpdateSessionResponse updateSession(String firebaseId, Long sessionId, UpdateSessionRequest request) {
        PomoSession pomoToUpdate = fetchPomoSession(sessionId);

        if(!pomoToUpdate.getUser().getFirebaseId().equals(firebaseId)){
            throw new InvalidSessionTokenException("Unauthorized: Firebase token mismatch for this session");
        }

        List<QuestionsDto> aiQuestions = null;
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
            throw new IllegalArgumentException("Invalid status provided: " + request.status());
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Could not save JSON to database.", e);
        }

        pomoSessionRepository.save(pomoToUpdate);
        return new UpdateSessionResponse(
                "Session with ID: " + sessionId + " successfully updated status to COMPLETED",
                aiQuestions
        );
    }

    public ResponseEntity finishSession(String firebaseId, Long sessionId, FinishSessionRequest finishSessionRequest){
        PomoSession finishedSession = fetchPomoSession(sessionId);

        if(!finishedSession.getUser().getFirebaseId().equals(firebaseId)){
            throw new InvalidSessionTokenException("Unauthorized: Firebase token mismatch for this session");
        }

        int wrongCount = finishedSession.getPomoSettings().getQuestionCount() - finishSessionRequest.correctCount();

        finishedSession.setCompletedAt(Instant.now());
        finishedSession.setCorrectCount(finishSessionRequest.correctCount());
        finishedSession.setWrongCount(wrongCount);

        pomoSessionRepository.save(finishedSession);

        return ResponseEntity.noContent().build();
    }

    private GenerateQuestionsResponse generateQuestions(PomoSession pomoToUpdate) throws JsonProcessingException {
        List<QuestionsDto> aiQuestions;
        String promptText = """
                You are a strict teacher. Your task is to generate %d study questions based on a topic.
                
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
                6. Options quality rules:
                   - All 4 options must use the SAME FORMAT and LEVEL OF SPECIFICITY (e.g., all exact dates, all years, all names).
                   - Exactly one option is correct; the other three must be clearly incorrect and not partially correct.
                   - Avoid "trap" ambiguity where a more specific option makes others seem less correct.
                """.formatted(pomoToUpdate.getPomoSettings().getQuestionCount(), pomoToUpdate.getTopic());


        System.out.println("Sending prompt to AI...");

        //Send the prompt to AI and convert to QuestionsDTO object to validate structure
        aiQuestions = chatClient.prompt()
                .user(promptText)
                .call()
                .entity(new ParameterizedTypeReference<List<QuestionsDto>>() {
                });

        //Converts back to string to save in database
        String jsonString = objectMapper.writeValueAsString(aiQuestions);
        return new GenerateQuestionsResponse(jsonString, aiQuestions);
    }

    private static PomoSession initializePomoSession(CreateSessionRequest request, User user) {
        PomoSession pomoSession = new PomoSession();
        pomoSession.setUser(user);
        pomoSession.setTopic(request.topic());
        pomoSession.setStatus(Status.IN_PROGRESS);


        //Creates settings with default value
        PomoSettings sessionSettings = new PomoSettings();

        //If any of the values is changed, set the new value.
        if(request.pomoSettings() != null){
            if(request.pomoSettings().focusMinutes() != null){
                sessionSettings.setFocusMinutes(request.pomoSettings().focusMinutes());
            }
            if(request.pomoSettings().relaxMinutes() != null){
                sessionSettings.setRelaxMinutes(request.pomoSettings().relaxMinutes());
            }
            if(request.pomoSettings().questionCount() != null) {
                sessionSettings.setQuestionCount(request.pomoSettings().questionCount());
            }
        }

        pomoSession.setPomoSettings(sessionSettings);
        return pomoSession;
    }

    public PomoSession fetchPomoSession(Long sessionId){
        return pomoSessionRepository.findById(sessionId)
                .orElseThrow(() -> {
                    String message = "Session with id " + sessionId + " not found";
                    return new ResourceNotFoundException(message);
                });
    }

}
