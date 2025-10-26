package com.example.habitapp.repository;

import com.example.habitapp.model.HabitRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface HabitRecordRepository extends JpaRepository<HabitRecord, Long> {
    List<HabitRecord> findAllByHabitIdAndUserId(Long habitId, Long userId);
    List<HabitRecord> findAllByUserId(Long userId);

    List<HabitRecord> findAllByHabitId(Long habitId);


    // Новый оптимизированный метод
    @Query("SELECT hr FROM HabitRecord hr WHERE hr.user.id = :userId " +
            "AND YEAR(hr.date) = :year AND MONTH(hr.date) = :month " +
            "AND (:habitId IS NULL OR hr.habit.id = :habitId)")
    List<HabitRecord> findByUserIdAndMonthAndHabitId(
            @Param("userId") Long userId,
            @Param("year") int year,
            @Param("month") int month,
            @Param("habitId") Long habitId
    );
}
