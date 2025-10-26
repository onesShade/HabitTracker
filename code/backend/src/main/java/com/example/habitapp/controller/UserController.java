package com.example.habitapp.controller;

import com.example.habitapp.model.User;
import com.example.habitapp.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // Получить профиль текущего пользователя
    @GetMapping("/me")
    public ResponseEntity<User> getProfile() {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(currentUser);
    }

    @PutMapping("/me")
    public ResponseEntity<User> updateProfile(@RequestBody User updatedUser) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        updatedUser.setId(currentUser.getId());
        return ResponseEntity.ok(userService.updateUser(updatedUser));
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteProfile() {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        userService.deleteUser(currentUser.getId());
        return ResponseEntity.noContent().build();
    }
}
