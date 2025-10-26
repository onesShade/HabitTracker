package com.example.habitapp.controller;

import com.example.habitapp.dto.HabitRecordDto;
import com.example.habitapp.model.HabitRecord;
import com.example.habitapp.service.HabitRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/records")
@RequiredArgsConstructor
public class HabitRecordController {

    private final HabitRecordService habitRecordService;

    // Создание записи (note в теле, habitId как query)
    @PostMapping
    public ResponseEntity<HabitRecord> createRecord(
            @RequestParam Long habitId,
            @RequestBody Map<String, String> body
    ) {
        String note = body.getOrDefault("note", "");
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        HabitRecord record = habitRecordService.createRecord(habitId, note, userEmail);
        return ResponseEntity.ok(record);
    }

    // Все записи пользователя
    @GetMapping("/me")
    public List<HabitRecord> getMyRecords() {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        return habitRecordService.getUserRecords(userEmail);
    }

    // Записи за дату (можно habitId указать для фильтрации)
    @GetMapping("/date")
    public List<HabitRecord> getRecordsByDate(
            @RequestParam String date,
            @RequestParam(required = false) Long habitId
    ) {
        LocalDate localDate = LocalDate.parse(date);
        if (habitId != null) {
            return habitRecordService.getRecordsByHabitAndDate(habitId, localDate);
        } else {
            return habitRecordService.getRecordsByDate(localDate);
        }
    }

    @PostMapping("/month")
    public List<HabitRecordDto> getRecordsByMonth(@RequestBody Map<String, Object> body) {
        int year = (int) body.get("year");
        int month = (int) body.get("month");
        Long habitId = body.containsKey("habitId") ? ((Number) body.get("habitId")).longValue() : null;

        // Получаем userId из Principal (аутентифицированного пользователя)
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long userId;

        if (principal instanceof com.example.habitapp.model.User user) {
            userId = user.getId();
        } else {
            // если principal хранит email (например, при JWT)
            String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
            userId = habitRecordService
                    .getUserRecords(userEmail)
                    .stream()
                    .findFirst()
                    .map(r -> r.getUser().getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }

        return habitRecordService.getRecordsByMonth(userId, year, month, habitId);
    }


}
