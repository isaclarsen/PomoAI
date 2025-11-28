package org.isaclarsen.backend.controller;

import org.isaclarsen.backend.model.User;
import org.isaclarsen.backend.model.dto.AuthRequest;
import org.isaclarsen.backend.service.AuthService;
import org.isaclarsen.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;
    private final AuthService authService;

    @Autowired
    public UserController(UserService userService,  AuthService authService) {
        this.userService = userService;
        this.authService = authService;
    }

    @PostMapping("/auth")
    public User syncUser(@AuthenticationPrincipal String firebaseId, @RequestBody AuthRequest authRequest) {
        return authService.syncUser(firebaseId, authRequest.email(), authRequest.displayName(), authRequest.educationLevel());
    }


}
