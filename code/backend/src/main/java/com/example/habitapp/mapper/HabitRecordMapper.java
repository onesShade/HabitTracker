package com.example.habitapp.mapper;

import com.example.habitapp.dto.HabitRecordDto;
import com.example.habitapp.model.HabitRecord;
import org.springframework.stereotype.Component;

@Component
public class HabitRecordMapper {

    public HabitRecordDto toDto(HabitRecord habitRecord) {
        if (habitRecord == null) {
            return null;
        }

        return HabitRecordDto.builder()
                .id(habitRecord.getId())
                .habitId(habitRecord.getHabit() != null ? habitRecord.getHabit().getId() : null)
                .userId(habitRecord.getUser() != null ? habitRecord.getUser().getId() : null)
                .date(habitRecord.getDate())
                .note(habitRecord.getNote())
                .createdAt(habitRecord.getCreatedAt())
                .build();
    }

    public HabitRecord toEntity(HabitRecordDto habitRecordDto) {
        if (habitRecordDto == null) {
            return null;
        }

        return HabitRecord.builder()
                .id(habitRecordDto.getId())
                .date(habitRecordDto.getDate())
                .note(habitRecordDto.getNote())
                .createdAt(habitRecordDto.getCreatedAt())
                // Habit и User устанавливаются отдельно через setId или через сервис
                .build();
    }
}