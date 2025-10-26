package com.example.habitapp.service;

import com.example.habitapp.dto.HabitRecordDto;
import com.example.habitapp.exception.NotFoundException;
import com.example.habitapp.mapper.HabitRecordMapper;
import com.example.habitapp.model.Habit;
import com.example.habitapp.model.HabitRecord;
import com.example.habitapp.model.User;
import com.example.habitapp.repository.GoalRepository;
import com.example.habitapp.repository.HabitRecordRepository;
import com.example.habitapp.repository.HabitRepository;
import com.example.habitapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HabitRecordService {

    private final HabitRecordRepository habitRecordRepository;
    private final HabitRepository habitRepository;
    private final UserRepository userRepository;
    private final GoalRepository goalRepository;
    private final HabitRecordMapper habitRecordMapper;

    public HabitRecord createRecord(Long habitId, String note, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new NotFoundException("User not found"));
        Habit habit = habitRepository.findById(habitId)
                .orElseThrow(() -> new NotFoundException("Habit not found"));

        HabitRecord record = HabitRecord.builder()
                .habit(habit)
                .user(user)
                .date(LocalDate.now()) // текущая дата
                .note(note)
                .build();

        goalRepository.findAllByHabitId(habit.getId()).forEach(goal -> {
            goal.setProgressValue(goal.getProgressValue() + 1);
            goalRepository.save(goal);
        });

        return habitRecordRepository.save(record);
    }

    public List<HabitRecord> getRecordsByDate(LocalDate date) {
        return habitRecordRepository.findAll()
                .stream()
                .filter(r -> r.getDate().equals(date))
                .toList();
    }

    public List<HabitRecord> getRecordsByHabitAndDate(Long habitId, LocalDate date) {
        return habitRecordRepository.findAllByHabitId(habitId)
                .stream()
                .filter(r -> r.getDate().equals(date))
                .toList();
    }

    public List<HabitRecord> getUserRecords(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new NotFoundException("User not found"));
        return habitRecordRepository.findAllByUserId(user.getId());
    }

    public List<HabitRecordDto> getRecordsByMonth(Long userId, int year, int month, Long habitId) {
        List<HabitRecord> records = habitRecordRepository.findByUserIdAndMonthAndHabitId(
                userId, year, month, habitId
        );

        return records.stream()
                .map(habitRecordMapper::toDto)
                .toList();
    }
}