package com.example.habitapp.service;

import com.example.habitapp.exception.NotFoundException;
import com.example.habitapp.model.Habit;
import com.example.habitapp.model.HabitRecord;
import com.example.habitapp.model.User;
import com.example.habitapp.repository.HabitRecordRepository;
import com.example.habitapp.repository.HabitRepository;
import com.example.habitapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class HabitService {

    private final HabitRepository habitRepository;
    private final HabitRecordRepository habitRecordRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    public Habit createHabit(Habit habit, String userEmail) {

        User currentUser = userService.getByEmail(userEmail)
                .orElseThrow(() -> new NotFoundException("User not found"));
        habit.setUser(currentUser); // очень важно
        return habitRepository.save(habit);
    }

    public Optional<Habit> getHabit(Long id) {
        return habitRepository.findById(id);
    }

    public List<Habit> getHabitsByUser(Long userId) {
        return habitRepository.findAllByUserId(userId);
    }

    public Habit updateHabit(Habit habit, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Habit not found"));
        habit.setUser(user);
        return habitRepository.save(habit);
    }

    public void deleteHabit(Long id) {
        habitRepository.deleteById(id);
    }

    public HabitRecord markHabitRecord(Long habitId, Long userId, LocalDate date, String note) {
        Habit habit = habitRepository.findById(habitId)
                .orElseThrow(() -> new NotFoundException("Habit not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));

        HabitRecord hrecord = new HabitRecord();
        hrecord.setHabit(habit);
        hrecord.setUser(user);
        hrecord.setDate(date);
        hrecord.setNote(note);

        return habitRecordRepository.save(hrecord);
    }

    public List<HabitRecord> getHabitRecords(Long habitId) {
        return habitRecordRepository.findAllByHabitId(habitId);
    }
}