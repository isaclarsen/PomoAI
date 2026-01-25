package org.isaclarsen.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.isaclarsen.backend.model.PomoSession;
import org.isaclarsen.backend.model.User;
import org.isaclarsen.backend.model.dto.CreateSessionRequest;
import org.isaclarsen.backend.model.dto.CreateSessionResponse;
import org.isaclarsen.backend.model.dto.UpdateSessionRequest;
import org.isaclarsen.backend.model.dto.UpdateSessionResponse;
import org.isaclarsen.backend.service.PomoSessionService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class PomoSessionController {

    private final PomoSessionService pomoSessionService;

    public PomoSessionController(PomoSessionService pomoSessionService) {
        this.pomoSessionService = pomoSessionService;
    }

    @Operation(
            summary = "Start a Pomo session as a guest",
            description = "Creates a pomo session as guest and puts status to IN_PROGRESS."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Session created successfully",
                    content = @Content(schema = @Schema(implementation = CreateSessionResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error.", content = @Content)
    })
    @PostMapping("/guest/session/generate")
    public CreateSessionResponse startGuestSession(@RequestBody CreateSessionRequest createSessionRequest) {
        return pomoSessionService.createGuestSession(createSessionRequest);
    }

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
                                                  @RequestBody CreateSessionRequest createSessionRequest
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
            @ApiResponse(responseCode = "403", description = "Access Token mismatch for this session", content = @Content),
            @ApiResponse(responseCode = "404", description = "SessionID not found, session does not exist.", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error.", content = @Content)
    })
    @PutMapping("/session/{sessionId}")
    public UpdateSessionResponse updateSession(
            @PathVariable Long sessionId,
            @RequestBody UpdateSessionRequest updateSessionRequest
    )
    {
        return pomoSessionService.updateSession(sessionId, updateSessionRequest);
    }
}
