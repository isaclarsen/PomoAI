package org.isaclarsen.backend.service;

import org.isaclarsen.backend.model.User;
import org.isaclarsen.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class AuthService {

    private UserRepository userRepository;

    @Autowired
    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User syncUser(String firebaseID, String email){
        return userRepository.findByFirebaseId(firebaseID)
                .orElseGet(() -> {
                    System.out.println("New user detected: " + firebaseID + email);
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setFirebaseId(firebaseID);
                    newUser.setLastLogin(LocalDate.now().atStartOfDay());
                    return userRepository.save(newUser);
                });
    }

}
