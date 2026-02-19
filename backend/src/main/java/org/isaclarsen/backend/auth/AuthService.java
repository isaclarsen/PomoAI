package org.isaclarsen.backend.auth;

import org.isaclarsen.backend.exception.ResourceConflictException;
import org.isaclarsen.backend.user.model.User;
import org.isaclarsen.backend.user.model.EducationLevel;
import org.isaclarsen.backend.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;

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
                    updateUserValues(displayName, educationLevel, existingUser);
                    existingUser.setLastLogin(Instant.now());
                    return saveUserSafely(existingUser);
                })
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setFirebaseId(firebaseID);
                    newUser.setCreatedAt(Instant.now());
                    newUser.setLastLogin(Instant.now());

                    updateUserValues(displayName, educationLevel, newUser);

                    return saveUserSafely(newUser);
                });
    }

    private void updateUserValues(String displayName, String educationLevel, User user){
        if (displayName != null && !displayName.isBlank()) {
            String normalized = displayName.trim();

            if(checkIfDisplayNameExists(normalized, user.getUserId())){
                throw new ResourceConflictException("Display name is already taken");
            }
            user.setDisplayName(normalized);
        }

        if (educationLevel != null && !educationLevel.isBlank()) {
            try {
                user.setEducationLevel(EducationLevel.valueOf(educationLevel.toUpperCase()));
            } catch (IllegalArgumentException e) {
                user.setEducationLevel(EducationLevel.OTHER);
            }
        }
    }

    private User saveUserSafely(User user){
        try{
            return userRepository.save(user);
        }catch(DataIntegrityViolationException e){
            throw new ResourceConflictException("User with this email or display name already exists");
        }
    }

    private boolean checkIfDisplayNameExists(String displayName, Long currentUserId){
       if(displayName == null || displayName.isBlank()){
           return false;
       }

       String normalized = displayName.trim();
       return userRepository.findByDisplayName(normalized)
               .map(foundUser -> !foundUser.getUserId().equals(currentUserId))
               .orElse(false);
    }
}
