package com.example.habitapp.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
    @JoinColumn(name = "user_id")
    @JsonBackReference
    private User user;

    @Column(length = 40)
    private String name;

    @Column(length = 500)
    private String description;
    private boolean isNegative;
    private boolean trackStreak;
    private int currentStreak;
    private LocalDate lastFIPDate;

    @Column(length = 100) // хранит имя иконки, например "FaBeer"
    private String icon;

    @Column(length = 10)
    private String color; // хранит цвет в HEX, например "#FF0000"

    @OneToMany(mappedBy = "habit", cascade = CascadeType.ALL)
    private List<HabitRecord> records;
}
