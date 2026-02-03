package org.isaclarsen.backend.service;

import org.isaclarsen.backend.exception.ResourceConflictException;
import org.isaclarsen.backend.model.User;
import org.isaclarsen.backend.model.enums.EducationLevel;
import org.isaclarsen.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.time.Instant;
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
                    existingUser.setLastLogin(Instant.now());
                    return userRepository.save(existingUser);
                })
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setFirebaseId(firebaseID);
                    newUser.setDisplayName(displayName);
                    newUser.setCreatedAt(Instant.now());
                    newUser.setLastLogin(Instant.now());

                    if (displayName != null && !displayName.isEmpty()) {
                        newUser.setDisplayName(displayName);
                    }else{
                        newUser.setDisplayName(null);
                    }

                    if (educationLevel != null && !educationLevel.isEmpty()) {
                        try {
                            newUser.setEducationLevel(EducationLevel.valueOf(educationLevel.toUpperCase()));
                        } catch (IllegalArgumentException e) {
                            newUser.setEducationLevel(EducationLevel.OTHER);
                        }
                    } else {
                        newUser.setEducationLevel(null);
                    }
                    return saveUserSafely(newUser);
                });
    }
    private User saveUserSafely(User user){
        try{
            return userRepository.save(user);
        }catch(DataIntegrityViolationException e){
            throw new ResourceConflictException("User with this email or display name already found.");
        }
    }
}
