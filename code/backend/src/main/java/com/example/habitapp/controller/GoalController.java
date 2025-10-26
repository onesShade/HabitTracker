package com.example.habitapp.controller;

import com.example.habitapp.model.Goal;
import com.example.habitapp.model.User;
import com.example.habitapp.security.JwtService;
import com.example.habitapp.service.GoalService;
import com.example.habitapp.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
@RequiredArgsConstructor
public class GoalController {

    private final GoalService goalService;
    private final JwtService jwtService;
    private final UserService userService;

    // Получить все цели текущего пользователя
    @GetMapping
    public List<Goal> getGoals(@RequestHeader("Authorization") String authHeader) {
        Long userId = ((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();
        return goalService.getGoalsForUserId(userId);
    }

    // Создать новую цель
    @PostMapping
    public Goal createGoal(@RequestHeader("Authorization") String authHeader,
                           @RequestParam Long habitId,
                           @RequestParam int targetValue) {
        Long userId = ((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();
        return goalService.createGoal(userId, habitId, targetValue);
    }

    // Обновить прогресс
    @PutMapping("/{goalId}/progress")
    public Goal updateProgress(@PathVariable Long goalId,
                               @RequestParam int progressValue) {
        return goalService.updateProgress(goalId, progressValue);
    }

    // Удалить цель
    @DeleteMapping("/{goalId}")
    public ResponseEntity<Void> deleteGoal(@PathVariable Long goalId) {
        goalService.deleteGoal(goalId);
        return ResponseEntity.noContent().build();
    }
}
