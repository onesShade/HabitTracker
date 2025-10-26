package com.example.habitapp.controller;

import com.example.habitapp.model.Habit;
import com.example.habitapp.model.User;
import com.example.habitapp.service.HabitService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/habits")
@RequiredArgsConstructor
public class HabitController {

    private final HabitService habitService;

    // Получить привычки текущего пользователя
    @GetMapping
    public List<Habit> getMyHabits() {
        Long userId = ((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();
        return habitService.getHabitsByUser(userId);
    }

    @PostMapping
    public Habit createHabit(@RequestBody Habit habit, Principal principal) {
        return habitService.createHabit(habit, principal.getName());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Habit> updateHabit(@PathVariable Long id, @RequestBody Habit updated) {
        Long userId = ((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();
        updated.setId(id);
        return ResponseEntity.ok(habitService.updateHabit(updated, userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHabit(@PathVariable Long id) {
        Long userId = ((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();
        if (!habitService.getHabit(id).isPresent())
            return ResponseEntity.notFound().build();

        Long userIdFromHabit = habitService.getHabit(id).get().getUser().getId();
        if(!Objects.equals(userId, userIdFromHabit)) {
            return ResponseEntity.badRequest().build();
        }
        habitService.deleteHabit(id);
        return ResponseEntity.noContent().build();
    }



}
