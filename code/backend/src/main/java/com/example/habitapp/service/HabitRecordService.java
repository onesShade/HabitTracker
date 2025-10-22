package com.example.habitapp.service;

import com.example.habitapp.model.HabitRecord;
import com.example.habitapp.repository.HabitRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class HabitRecordService {

    private final HabitRecordRepository habitRecordRepository;

    public List<HabitRecord> getAllByHabit(Long habitId) {
        return habitRecordRepository.findAllByHabitId(habitId);
    }

    public Optional<HabitRecord> getRecord(Long id) {
        return habitRecordRepository.findById(id);
    }

    public void deleteRecord(Long id) {
        habitRecordRepository.deleteById(id);
    }
}
