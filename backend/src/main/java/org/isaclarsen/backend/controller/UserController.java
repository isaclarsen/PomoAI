package org.isaclarsen.backend.controller;

import jakarta.validation.Valid;
import org.isaclarsen.backend.model.PomoSettings;
import org.isaclarsen.backend.model.dto.PomoSettingsRequest;
import org.isaclarsen.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService){
        this.userService = userService;
    }

    @GetMapping("/pomo-settings")
    public PomoSettings getPomoUserSettings(@AuthenticationPrincipal String firebaseId){
        return userService.getPomoUserSettings(firebaseId);
    }

    @PutMapping("/pomo-settings")
    public PomoSettings updatePomoUserSettings(@AuthenticationPrincipal String firebaseId,
                                               @RequestBody @Valid PomoSettingsRequest pomoSettingsRequest
    ){
        return userService.updatePomoUserSettings(firebaseId, pomoSettingsRequest);
    }

}
