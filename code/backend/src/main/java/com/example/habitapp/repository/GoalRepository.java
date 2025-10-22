package com.example.habitapp.repository;

import com.example.habitapp.model.Goal;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GoalRepository extends JpaRepository<Goal, Long> {
    List<Goal> findAllByUserId(Long userId);
    List<Goal> findAllByHabitId(Long habitId);
}
