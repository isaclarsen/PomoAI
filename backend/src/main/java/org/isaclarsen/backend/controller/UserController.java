package org.isaclarsen.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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

    @Operation(
            summary = "Sync user",
            description = "Creates or updates a user."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successful operation",
                    content = @Content(schema = @Schema(implementation = User.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized. Invalid firebase token.", content = @Content),
            @ApiResponse(responseCode = "403", description = "Unauthorized. Invalid access token for session.", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error.", content = @Content)
    })

    @PostMapping("/auth")
    public User syncUser(@AuthenticationPrincipal String firebaseId, @RequestBody AuthRequest authRequest) {
        return authService.syncUser(firebaseId, authRequest.email(), authRequest.displayName(), authRequest.educationLevel());
    }


}
