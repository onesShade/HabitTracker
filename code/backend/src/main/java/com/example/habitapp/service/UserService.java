package com.example.habitapp.service;

import com.example.habitapp.config.PasswordConfig;
import com.example.habitapp.exception.ConflictException;
import com.example.habitapp.model.User;
import com.example.habitapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordConfig passwordConfig;

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public Optional<User> getUser(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> getByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public List<User> getAll() {
        return userRepository.findAll();
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User register(String email, String password) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new ConflictException("User already exists");
        }
        User user = User.builder()
                .email(email)
                .passwordHash(passwordConfig.passwordEncoder().encode(password))
                .build();
        return userRepository.save(user);
    }

    public User updateUser(User updatedUser) {
        return userRepository.save(updatedUser);
    }
}
