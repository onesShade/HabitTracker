package com.example.habitapp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HabitRecordDto {
    private Long id;
    private Long habitId;
    private Long userId;
    private LocalDate date;
    private String note;
    private LocalDateTime createdAt;
}