package com.example.habitapp.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "habits")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Habit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String name;
    private String description;
    private boolean isNegative;
    private boolean trackStreak;
    private int currentStreak;
    private LocalDate lastFIPDate;

    @OneToMany(mappedBy = "habit", cascade = CascadeType.ALL)
    private List<HabitRecord> records;
}
