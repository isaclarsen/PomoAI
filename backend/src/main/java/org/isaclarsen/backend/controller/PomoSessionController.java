package org.isaclarsen.backend.controller;

import org.isaclarsen.backend.model.dto.CreateSessionRequest;
import org.isaclarsen.backend.model.dto.CreateSessionResponse;
import org.isaclarsen.backend.model.dto.UpdateSessionRequest;
import org.isaclarsen.backend.model.dto.UpdateSessionResponse;
import org.isaclarsen.backend.service.PomoSessionService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class PomoSessionController {

    private final PomoSessionService pomoSessionService;

    public PomoSessionController(PomoSessionService pomoSessionService) {
        this.pomoSessionService = pomoSessionService;
    }

    @PostMapping("/guest/sessions/generate")
    public CreateSessionResponse startGuestSession(@RequestBody CreateSessionRequest createSessionRequest) {
        return pomoSessionService.createGuestSession(createSessionRequest);
    }

//    @PostMapping("/session/generate")
//    public CreateSessionResponse startUserSession(@AuthenticationPrincipal String firebaseId,
//                                                  @RequestBody CreateSessionRequest createSessionRequest
//    )
//    {
//        return pomoSessionService.createUserSession(createSessionRequest);
//    }

    @PutMapping("/guest/sessions/{sessionId}")
    public UpdateSessionResponse updateSession(
            @PathVariable Long sessionId,
            @RequestBody UpdateSessionRequest updateSessionRequest
    )
    {
        return pomoSessionService.updateSession(sessionId, updateSessionRequest);
    }
}
