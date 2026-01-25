package org.isaclarsen.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.isaclarsen.backend.model.GuestDemo;
import org.isaclarsen.backend.model.dto.CreateDemoResponse;
import org.isaclarsen.backend.repository.GuestDemoRepository;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class GuestDemoService {

    private final GuestDemoRepository guestDemoRepository;
    private final ChatClient chatClient;
    private final ObjectMapper objectMapper;

    public GuestDemoService(GuestDemoRepository guestDemoRepository, ChatClient.Builder chatClientBuilder, ObjectMapper objectMapper) {
        this.guestDemoRepository = guestDemoRepository;
        this.chatClient = chatClientBuilder.build();
        this.objectMapper = objectMapper;
    }

    public CreateDemoResponse createGuestSession(String topic) {
        GuestDemo guestDemo = new GuestDemo();
        guestDemo.setTopic(topic);

        CreateDemoResponse demoResponse = generateDemo(topic);
        guestDemo.setTopicText(demoResponse.topicText());

        try{
            String jsonString = objectMapper.writeValueAsString(demoResponse.questions());
            guestDemo.setQuestionsJson(jsonString);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Could not save JSON to database.", e);
        }

        guestDemoRepository.save(guestDemo);

        return demoResponse;
    }

    private CreateDemoResponse generateDemo(String topic){
        String promptText = """
                You are an expert tutor designing a "Speed Learning" demo session.
                
                User Topic: <topic>%s</topic>
                
                Task:
                Generate a short educational text and 3 quiz questions based on the topic.
                
                Instructions:
                1. Language: Detect the language of the topic. Generate ALL content (text and questions) in that SAME language.
                2. Format: Return ONLY raw JSON. No markdown.
                3. JSON Structure:
                   {
                     "topicText": "A concise, engaging summary of the topic (approx. 100-150 words). Suitable for speed-reading in 60 seconds.",
                     "questions": [
                        {
                          "id": 1,
                          "text": "Question text...",
                          "options": ["Option A", "Option B", "Option C", "Option D"],
                          "correctAnswer": "Option A"
                        }
                     ]
                   }
                
                Constraints:
                - The "topicText" must be factual and educational.
                - The questions must be answerable based ONLY on the "topicText" provided.
                - Question Style: Direct Active Recall (e.g., "What year did X happen?"). Do NOT use "Which of the following...".
                - Safety: If the topic is inappropriate or nonsense, return a JSON with empty fields.
                """.formatted(topic);

        System.out.println("Generating topic text and questions for demo...");

        return chatClient.prompt()
                .user(promptText)
                .call()
                .entity(CreateDemoResponse.class);
    }
}
