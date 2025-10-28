package com.example.habitapp.service;

import com.example.habitapp.exception.NotFoundException;
import com.example.habitapp.model.Goal;
import com.example.habitapp.model.Habit;
import com.example.habitapp.model.User;
import com.example.habitapp.repository.GoalRepository;
import com.example.habitapp.repository.HabitRepository;
import com.example.habitapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GoalService {

    private final GoalRepository goalRepository;
    private final UserRepository userRepository;
    private final HabitRepository habitRepository;

    public List<Goal> getGoalsForUserId(Long userId) {
        return goalRepository.findAllByUserId(userId);
    }

    public Goal createGoal(Long userId, Long habitId, int targetValue, LocalDate deadline) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Habit habit = habitRepository.findById(habitId)
                .orElseThrow(() -> new RuntimeException("Habit not found"));

        // Если deadline не указан, устанавливаем дефолтный (год от текущей даты)
        if (deadline == null) {
            deadline = LocalDate.now().plusYears(1);
        }

        Goal goal = Goal.builder()
                .user(user)
                .habit(habit)
                .targetValue(targetValue)
                .progressValue(0) // Начинаем с 0 прогресса
                .deadline(deadline)
                .build();

        return goalRepository.save(goal);
    }

    public Goal updateProgress(Long goalId, int progressValue) {
        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new NotFoundException("Goal not found with id " + goalId));

        goal.setProgressValue(progressValue);
        return goalRepository.save(goal);
    }

    public void deleteGoal(Long goalId) {
        if (!goalRepository.existsById(goalId)) {
            throw new NotFoundException("Goal not found with id " + goalId);
        }
        goalRepository.deleteById(goalId);
    }
}
