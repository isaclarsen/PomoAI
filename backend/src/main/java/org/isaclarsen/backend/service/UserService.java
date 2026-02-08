package org.isaclarsen.backend.service;

import org.isaclarsen.backend.exception.ResourceNotFoundException;
import org.isaclarsen.backend.model.PomoSettings;
import org.isaclarsen.backend.model.User;
import org.isaclarsen.backend.model.dto.PomoSettingsRequest;
import org.isaclarsen.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    public PomoSettings getPomoUserSettings(String firebaseId){
        User user = getUser(firebaseId);
        return user.getPomoSettings();
    }

    public PomoSettings updatePomoUserSettings(String firebaseId, PomoSettingsRequest pomoSettingsRequest){
        User user = getUser(firebaseId);

        PomoSettings pomoSettings = user.getPomoSettings();
        pomoSettings.setFocusMinutes(pomoSettingsRequest.focusMinutes());
        pomoSettings.setRelaxMinutes(pomoSettingsRequest.relaxMinutes());
        pomoSettings.setQuestionCount(pomoSettingsRequest.questionCount());

        userRepository.save(user);

        return pomoSettings;

    }

    private User getUser(String firebaseId){
        return userRepository.findByFirebaseId(firebaseId)
                .orElseThrow(() -> new ResourceNotFoundException("Firebase user not found."));
    }
}
