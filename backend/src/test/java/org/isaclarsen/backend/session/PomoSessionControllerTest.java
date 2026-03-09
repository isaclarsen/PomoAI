package org.isaclarsen.backend.session;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.firebase.auth.FirebaseAuth;
import org.isaclarsen.backend.exception.ResourceNotFoundException;
import org.isaclarsen.backend.session.dto.CreateSessionRequest;
import org.isaclarsen.backend.session.dto.CreateSessionResponse;
import org.isaclarsen.backend.session.dto.UpdateSessionRequest;
import org.isaclarsen.backend.session.dto.UpdateSessionResponse;
import org.isaclarsen.backend.session.model.Status;
import org.isaclarsen.backend.user.dto.PomoSettingsRequest;
import org.isaclarsen.backend.user.model.PomoSettings;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PomoSessionController.class)
@AutoConfigureMockMvc(addFilters = false)
public class PomoSessionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private PomoSessionService pomoSessionService;

    @MockitoBean
    private FirebaseAuth firebaseAuth;

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    private static String FIREBASE_ID = "1U";
    private static long SESSION_ID = 3;

    @Test
    void shouldCreateSessionAndReturn200() throws Exception {

        //Arrange
        CreateSessionRequest request = defaultCreateSessionRequest("TDD Programming");
        CreateSessionResponse response = new CreateSessionResponse(SESSION_ID, new PomoSettings(), Status.IN_PROGRESS);

        String serializedMockRequest = objectMapper.writeValueAsString(request);

        when(pomoSessionService.createUserSession(any(CreateSessionRequest.class), eq(FIREBASE_ID)))
                .thenReturn(response);

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(FIREBASE_ID, null, List.of())
        );

        //Act & Assert
        mockMvc.perform(post("/api/session/generate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(serializedMockRequest))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.sessionId").value(3))
                .andExpect(jsonPath("$.pomoSettings.focusMinutes").value((25)))
                .andExpect(jsonPath("$.pomoSettings.relaxMinutes").value((5)))
                .andExpect(jsonPath("$.pomoSettings.questionCount").value((3)))
                .andExpect(jsonPath("$.status").value("IN_PROGRESS"));
    }

    @Test
    void shouldReturn404WhenUserNotFoundOnCreate() throws Exception {
        //Arrange
        CreateSessionRequest request = defaultCreateSessionRequest("TDD Programming");

        String serializedMockRequest = objectMapper.writeValueAsString(request);
        when(pomoSessionService.createUserSession(any(CreateSessionRequest.class), eq(FIREBASE_ID)))
                .thenThrow(new ResourceNotFoundException("Firebase User not found"));

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(FIREBASE_ID, null, List.of())
        );

        //Act & Assert
        mockMvc.perform(post("/api/session/generate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(serializedMockRequest))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.title").value("Resource Not Found"));
    }

    @Test
    void shouldReturn400WhenTopicIsBlankOnCreate() throws Exception {
        //Arrange
        CreateSessionRequest request = defaultCreateSessionRequest("");
        String serialized = objectMapper.writeValueAsString(request);

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(FIREBASE_ID, null, List.of())
        );

        //Act & Assert
        mockMvc.perform(post("/api/session/generate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(serialized))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.title").value("Validation Error"))
                .andExpect(jsonPath("$.detail").value("Topic must be at least 2 characters"));
    }

//    @Test
//    void shouldUpdateSessionAndReturn200(){
//        UpdateSessionRequest request = new UpdateSessionRequest(Status.COMPLETED.toString());
//        UpdateSessionResponse response = new UpdateSessionResponse("Session with ID: " + SESSION_ID + " successfully updated status to COMPLETED", )
//    }

    private CreateSessionRequest defaultCreateSessionRequest(String topic){
        PomoSettingsRequest settings = new PomoSettingsRequest(25, 5, 3);
        return new CreateSessionRequest(topic, settings);
    }
}
