package org.isaclarsen.backend.controller;

import org.isaclarsen.backend.model.dto.CreateSessionRequest;
import org.isaclarsen.backend.model.dto.CreateSessionResponse;
import org.isaclarsen.backend.repository.PomoSessionRepository;
import org.isaclarsen.backend.service.PomoSessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/pomo/sessions")
@CrossOrigin(origins = "http://localhost:5173")
public class PomoSessionController {

    private final PomoSessionService pomoSessionService;

    public PomoSessionController(PomoSessionService pomoSessionService) {
        this.pomoSessionService = pomoSessionService;
    }

    @PostMapping("/guest/generate")
    public CreateSessionResponse startGuestSession(@RequestBody CreateSessionRequest createSessionRequest) {
        return pomoSessionService.createGuestSession(createSessionRequest);
    }
}
