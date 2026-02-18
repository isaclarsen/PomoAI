package org.isaclarsen.backend.session;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import org.isaclarsen.backend.session.dto.*;
import org.isaclarsen.backend.session.PomoSessionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class PomoSessionController {

    private final PomoSessionService pomoSessionService;

    public PomoSessionController(PomoSessionService pomoSessionService) {
        this.pomoSessionService = pomoSessionService;
    }
// -------------- POMO SESSION LOGIC ENDPOINTS -------------------
    @Operation(
            summary = "Start a Pomo session as a user",
            description = "Creates a pomo session as user and puts status to IN_PROGRESS."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Session created successfully",
                    content = @Content(schema = @Schema(implementation = CreateSessionResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized. Invalid firebase token.", content = @Content),
            @ApiResponse(responseCode = "404", description = "User not found. (User has not synced with database yet).", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error.", content = @Content)
    })
    @PostMapping("/session/generate")
    public CreateSessionResponse startUserSession(@AuthenticationPrincipal String firebaseId,
                                                  @RequestBody @Valid CreateSessionRequest createSessionRequest
    )
    {
        return pomoSessionService.createUserSession(createSessionRequest, firebaseId);
    }

    @Operation(
            summary = "Update Pomo session",
            description = "Updates pomo status and generate questions if completed."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Session updated successfully",
                    content = @Content(schema = @Schema(implementation = UpdateSessionRequest.class))),
            @ApiResponse(responseCode = "400", description = "Bad Request. Invalid Status provided", content = @Content),
            @ApiResponse(responseCode = "401", description = "Firebase token mismatch for this session", content = @Content),
            @ApiResponse(responseCode = "404", description = "SessionID not found, session does not exist.", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error.", content = @Content)
    })
    @PutMapping("/session/{sessionId}")
    public UpdateSessionResponse updateSession(
            @AuthenticationPrincipal String firebaseId,
            @PathVariable Long sessionId,
            @RequestBody UpdateSessionRequest updateSessionRequest
    )
    {
        return pomoSessionService.updateSession(firebaseId, sessionId, updateSessionRequest);
    }
    @Operation(
            summary = "Update Pomo session values",
            description = "Updates pomo session stats."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Session updated successfully"),
            @ApiResponse(responseCode = "401", description = "Firebase token mismatch for this session", content = @Content),
            @ApiResponse(responseCode = "404", description = "SessionID not found, session does not exist.", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error.", content = @Content)
    })
    @PutMapping("/session/finish/{sessionId}")
    public ResponseEntity finishSession(
            @AuthenticationPrincipal String firebaseId,
            @PathVariable Long sessionId,
            @RequestBody FinishSessionRequest finishSessionRequest
    )
    {
        return pomoSessionService.finishSession(firebaseId, sessionId, finishSessionRequest);
    }

    // -------------- POMO SESSION FOR USER ENDPOINTS -------------------
    @Operation(
            summary = "Get pomo session history from User",
            description = "Fetches the complete pomo session history from a user."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Session history retrieved successfully",
                    content = @Content(schema = @Schema(implementation = GetUserSessionsResponse.class))),
            @ApiResponse(responseCode = "401", description = "Firebase token mismatch", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error.", content = @Content)
    })
    @GetMapping("/session/history")
    public List<GetUserSessionsResponse> getUserSessions(
            @AuthenticationPrincipal String firebaseId
    )
    {
        return pomoSessionService.getUserSessionsResponse(firebaseId);
    }
}
