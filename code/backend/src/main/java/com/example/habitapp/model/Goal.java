    package com.example.habitapp.model;

    import jakarta.persistence.*;
    import lombok.*;

    import java.time.LocalDate;

    @Entity
    @Table(name = "goals")
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public class Goal {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @ManyToOne
        @JoinColumn(name = "user_id", nullable = false)
        private User user;

        @ManyToOne
        @JoinColumn(name = "habit_id")
        private Habit habit;

        private int targetValue;
        private int progressValue;
        private LocalDate deadline;

        public boolean isAchieved() {
            return progressValue >= targetValue;
        }
    }
