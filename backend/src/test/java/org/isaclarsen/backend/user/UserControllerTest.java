package org.isaclarsen.backend.user;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.firebase.auth.FirebaseAuth;
import org.isaclarsen.backend.exception.ResourceNotFoundException;
import org.isaclarsen.backend.user.dto.PomoSettingsRequest;
import org.isaclarsen.backend.user.model.PomoSettings;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserController.class)
@AutoConfigureMockMvc(addFilters = false)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private UserService userService;

    @MockitoBean
    private FirebaseAuth firebaseAuth;

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    private static String FIREBASE_ID = "1U";

    @Test
    void shouldReturnPomoSettings() throws Exception {
        //Arrange
        PomoSettings mockSettings = new PomoSettings();
        mockSettings.setFocusMinutes(25);
        mockSettings.setRelaxMinutes(5);
        mockSettings.setQuestionCount(3);

        when(userService.getPomoUserSettings(FIREBASE_ID)).thenReturn(mockSettings);

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(FIREBASE_ID, null, List.of())
        );

        //Act & Assert
        mockMvc.perform(get("/api/user/pomo-settings"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.focusMinutes").value(25))
                .andExpect(jsonPath("$.relaxMinutes").value(5))
                .andExpect(jsonPath("$.questionCount").value(3));
    }

    @Test
    void shouldUpdatePomoSettings() throws Exception {
        //Arrange
        PomoSettingsRequest mockRequest = new PomoSettingsRequest(45, 10, 5);
        PomoSettings mockSettings = new PomoSettings();
        mockSettings.setFocusMinutes(45);
        mockSettings.setRelaxMinutes(10);
        mockSettings.setQuestionCount(5);

        String serializedMockRequest = objectMapper.writeValueAsString(mockRequest);


        when(userService.updatePomoUserSettings(FIREBASE_ID, mockRequest)).thenReturn(mockSettings);

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(FIREBASE_ID, null, List.of())
        );

        //Act & Assert
        mockMvc.perform(put("/api/user/pomo-settings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(serializedMockRequest))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.focusMinutes").value(45))
                .andExpect(jsonPath("$.relaxMinutes").value(10))
                .andExpect(jsonPath("$.questionCount").value(5));


    }

    @Test
    void shouldReturn404WhenUserNotFound() throws Exception {
        //Arrange
        when(userService.getPomoUserSettings(FIREBASE_ID))
                .thenThrow(new ResourceNotFoundException("Firebase user not found."));

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(FIREBASE_ID, null, List.of())
        );

        //Act & Assert
        mockMvc.perform(get("/api/user/pomo-settings"))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldReturn400WhenInvalidSettingsProvided() throws Exception {
        //Arrange
        PomoSettingsRequest invalidRequest = new PomoSettingsRequest(100, 100, 100);
        String serialized = objectMapper.writeValueAsString(invalidRequest);

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(FIREBASE_ID, null, List.of())
        );

        //Act & Assert
        mockMvc.perform(put("/api/user/pomo-settings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(serialized))
                .andExpect(status().isBadRequest());

    }
}
