package com.example.habitapp.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class CreateGoalRequest {
    private Long habitId;
    private int targetValue;
    private LocalDate deadline;
}