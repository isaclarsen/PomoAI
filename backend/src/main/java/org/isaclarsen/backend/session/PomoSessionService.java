package org.isaclarsen.backend.session;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.isaclarsen.backend.exception.InvalidSessionTokenException;
import org.isaclarsen.backend.exception.ResourceNotFoundException;
import org.isaclarsen.backend.session.model.PomoSession;
import org.isaclarsen.backend.session.model.TopicCategory;
import org.isaclarsen.backend.user.model.PomoSettings;
import org.isaclarsen.backend.user.model.User;
import org.isaclarsen.backend.session.dto.*;
import org.isaclarsen.backend.session.model.Status;
import org.isaclarsen.backend.user.UserRepository;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Locale;

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

    public List<GetUserSessionsResponse> getUserSessionsResponse(String firebaseId){
        List<PomoSession> pomoSessions = pomoSessionRepository.findAllByUser_FirebaseIdAndStatusAndCompletedAtIsNotNullOrderByCreatedAtDesc(
                firebaseId, Status.COMPLETED
        );

        return pomoSessions.stream()
                .map(pomoSession -> new GetUserSessionsResponse(
                        pomoSession.getTopic(),
                        pomoSession.getTopicCategory() != null ? pomoSession.getTopicCategory() : TopicCategory.OTHER,
                        pomoSession.getWrongCount(),
                        pomoSession.getCorrectCount(),
                        pomoSession.getCreatedAt(),
                        calculateDurationSeconds(pomoSession),
                        pomoSession.getPomoSettings()
                ))
                .toList();

    }

    private GenerateQuestionsResponse generateQuestions(PomoSession pomoToUpdate) throws JsonProcessingException {
        String promptText = """
                You are a strict teacher. Your task is to classify a topic and generate %d study questions.
                Generate questions appropriate for a %s-level student.
                
                Topic: <topic>%s</topic>
                
                Instructions:
                1. Language: Detect the language of the topic inside the tags. You MUST generate the questions in the SAME language as the topic.
                2. Format: Return ONLY raw JSON object (no markdown).
                3. Return EXACTLY this shape:
                    {
                      "topicCategory": "HISTORY|SCIENCE|TECHNOLOGY|MATHEMATICS|LANGUAGE|LITERATURE|BUSINESS|ECONOMICS|POLITICS|GEOGRAPHY|ART|HEALTH|OTHER",
                      "questions": [
                        {
                          "id": 1,
                          "text": "Question text",
                          "options": ["A", "B", "C", "D"],
                          "correctAnswer": "A"
                        }
                      ]
                    }
                4. topicCategory MUST be exactly one token from the allowed enum list above.
                5. For each question object:
                   - 'id' (integer)
                   - 'text' (string, the question)
                   - 'options' (array of 4 strings: 1 correct, 3 distractors)
                   - 'correctAnswer' (string, MUST match one of the options exactly)
                
                CRITICAL CONSTRAINT FOR ACTIVE RECALL:
                6. The question MUST be answerable without seeing the options.\s
                    - BAD: "Which of the following statements is true?" (Depends on options)
                    - GOOD: "What is the main function of the kidneys?" (Can be answered alone)
                    - DO NOT start questions with "Which of the following...".
                7. Safety: If the topic is inappropriate, nonsense, or impossible to generate questions for, return: {"topicCategory":"OTHER","questions":[]}
                8. Options quality rules:
                   - All 4 options must use the SAME FORMAT and LEVEL OF SPECIFICITY (e.g., all exact dates, all years, all names).
                   - Exactly one option is correct; the other three must be clearly incorrect and not partially correct.
                   - Avoid "trap" ambiguity where a more specific option makes others seem less correct.
                """.formatted(pomoToUpdate.getPomoSettings().getQuestionCount(),
                pomoToUpdate.getUser().getEducationLevel(),
                pomoToUpdate.getTopic());


        System.out.println("Sending prompt to AI...");

        //Send the prompt to AI and convert to QuestionsDTO object to validate structure
        AiQuestionsPayload payload = chatClient.prompt()
                .user(promptText)
                .call()
                .entity(AiQuestionsPayload.class);

        TopicCategory topicCategory = parseTopicCategory(payload != null ? payload.topicCategory() : null);
        List<QuestionsDto> aiQuestions = (payload != null && payload.questions() != null)
                ? payload.questions()
                : List.of();
        pomoToUpdate.setTopicCategory(topicCategory);

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

        pomoSession.setPomoSettings(sessionSettings);
        return pomoSession;
    }

    private Long calculateDurationSeconds(PomoSession pomoSession){
        Instant startedAt = pomoSession.getCreatedAt();
        Instant completedAt = pomoSession.getCompletedAt();

        if(startedAt == null || completedAt == null){
            return null;
        }

        long seconds = Duration.between(startedAt, completedAt).getSeconds();
        return Math.max(seconds, 0L);
    }

    private TopicCategory parseTopicCategory(String rawCategory){
        if(rawCategory == null || rawCategory.isBlank()) return  TopicCategory.OTHER;
        try{
            return TopicCategory.valueOf(rawCategory.trim().toUpperCase(Locale.ROOT));
        }catch(IllegalArgumentException ex){
            return TopicCategory.OTHER;
        }
    }

    private record AiQuestionsPayload(
            String topicCategory,
            List<QuestionsDto> questions
    ) {}

    public PomoSession fetchPomoSession(Long sessionId){
        return pomoSessionRepository.findById(sessionId)
                .orElseThrow(() -> {
                    String message = "Session with id " + sessionId + " not found";
                    return new ResourceNotFoundException(message);
                });
    }

}
