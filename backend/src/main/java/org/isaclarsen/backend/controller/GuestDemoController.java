package org.isaclarsen.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import org.isaclarsen.backend.model.dto.CreateDemoRequest;
import org.isaclarsen.backend.model.dto.CreateDemoResponse;
import org.isaclarsen.backend.model.dto.CreateSessionResponse;
import org.isaclarsen.backend.service.GuestDemoService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/demo")
public class GuestDemoController {

    private final GuestDemoService guestService;

    public GuestDemoController(GuestDemoService guestService) {
        this.guestService = guestService;
    }

    @Operation(
            summary = "Start a Pomo Demo Session.",
            description = "Creates a pomo demo session and generates topic text with questions and alternatives."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Session created successfully",
                    content = @Content(schema = @Schema(implementation = CreateDemoResponse.class))),
            @ApiResponse(responseCode = "400", description = "Topic is either empty or below 2 characters", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error.", content = @Content)
    })
    @PostMapping("/generate")
    public CreateDemoResponse startDemoSession(@RequestBody @Valid CreateDemoRequest request) {
        return guestService.createGuestSession(request.topic());
    }
}
