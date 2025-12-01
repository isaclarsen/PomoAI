package org.isaclarsen.backend.service;

import org.isaclarsen.backend.model.User;
import org.isaclarsen.backend.model.enums.EducationLevel;
import org.isaclarsen.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {

    private final UserRepository userRepository;

    @Autowired
    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User syncUser(String firebaseID, String email, String displayName, String educationLevel) {
        return userRepository.findByFirebaseId(firebaseID)
                .map(existingUser -> {
                    //When frontend checks user it sends empty strings, if it's an existing user we need to override these
                    if (displayName != null && !displayName.isEmpty()) {
                        existingUser.setDisplayName(displayName);
                    }
                    if (educationLevel != null && !educationLevel.isEmpty()) {
                        try {
                            existingUser.setEducationLevel(EducationLevel.valueOf(educationLevel.toUpperCase()));
                        } catch (IllegalArgumentException e) {
                            System.out.println("Invalid education level: " + educationLevel);
                        }
                    }
                    existingUser.setLastLogin(LocalDateTime.now());
                    return userRepository.save(existingUser);
                })
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setFirebaseId(firebaseID);
                    newUser.setDisplayName(displayName);
                    newUser.setLastLogin(LocalDateTime.now());

                    if (educationLevel != null && !educationLevel.isEmpty()) {
                        try {
                            newUser.setEducationLevel(EducationLevel.valueOf(educationLevel.toUpperCase()));
                        } catch (IllegalArgumentException e) {
                            newUser.setEducationLevel(EducationLevel.OTHER);
                        }
                    } else {
                        newUser.setEducationLevel(null);
                    }

                    return userRepository.save(newUser);
                });
    }
}
