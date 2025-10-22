package com.example.habitapp.repository;

import com.example.habitapp.model.HabitRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HabitRecordRepository extends JpaRepository<HabitRecord, Long> {
    List<HabitRecord> findAllByHabitId(Long habitId);
    List<HabitRecord> findAllByUserId(Long userId);
}
