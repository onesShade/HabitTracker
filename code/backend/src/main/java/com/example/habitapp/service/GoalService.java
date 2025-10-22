package com.example.habitapp.service;

import com.example.habitapp.model.Goal;
import com.example.habitapp.repository.GoalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GoalService {

    private final GoalRepository goalRepository;

    public Goal createGoal(Goal goal) {
        return goalRepository.save(goal);
    }

    public Optional<Goal> getGoal(Long id) {
        return goalRepository.findById(id);
    }

    public List<Goal> getGoalsByUser(Long userId) {
        return goalRepository.findAllByUserId(userId);
    }

    public Goal updateGoal(Goal goal) {
        return goalRepository.save(goal);
    }

    public void deleteGoal(Long id) {
        goalRepository.deleteById(id);
    }

    public boolean isGoalAchieved(Goal goal) {
        return goal.getProgressValue() >= goal.getTargetValue();
    }
}