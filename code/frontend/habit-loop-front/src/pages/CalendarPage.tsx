// CalendarPage.tsx
import { useEffect, useState } from "react";
import { getHabits } from "../api/habits";
import { getMonthRecords, type Record } from "../api/calendar";
import type { HabitData } from "../api/habits";
import "./CalendarPage.css";
import * as FaIcons from "react-icons/fa";



export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [habits, setHabits] = useState<HabitData[]>([]);
  const [selectedHabit, setSelectedHabit] = useState<string>("all");
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
    loadHabits();
  }, []);

  useEffect(() => {
    loadMonthRecords();
  }, [year, month, selectedHabit]);

  const loadHabits = async () => {
    try {
      const habitsData = await getHabits();
      setHabits(habitsData);
    } catch (err) {
      alert("Error loading habits: " + err.message);
    }
  };

  const loadMonthRecords = async () => {
    setLoading(true);
    try {
      const request = {
        year,
        month: month + 1, // JavaScript months are 0-indexed, backend expects 1-indexed
        habitId: selectedHabit === "all" ? undefined : parseInt(selectedHabit)
      };
      
      const recordsData = await getMonthRecords(request);
      setRecords(recordsData);
    } catch (err) {
      alert("Error loading records: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const changeMonth = (offset: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + offset);
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const getRecordsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return records.filter(record => record.date === dateStr);
  };

  // CalendarPage.tsx - обновленная функция getHabitIconsForDay
const getHabitIconsForDay = (day: number) => {
  const dayRecords = getRecordsForDay(day);
  const uniqueHabits = new Map<number, HabitData>();
  
  // Собираем уникальные привычки из записей
  dayRecords.forEach(record => {
    if (!uniqueHabits.has(record.habitId)) {
      const habit = habits.find(h => h.id === record.habitId);
      if (habit) {
        uniqueHabits.set(record.habitId, habit);
      }
    }
  });

  // Возвращаем до 3 разных привычек
  return Array.from(uniqueHabits.values()).slice(0, 3);
};

  const getDayStatus = (day: number) => {
    const dayRecords = getRecordsForDay(day);
    if (dayRecords.length === 0) return null;

    const hasNotes = dayRecords.some(record => record.note && record.note.trim() !== "");
    
    return {
      completed: dayRecords.length > 0,
      recordCount: dayRecords.length,
      hasNotes
    };
  };

// CalendarPage.tsx - обновленная функция renderDayContent
const renderDayContent = (day: number) => {
  if (selectedHabit === "all") {
    // Общий режим - показываем иконки привычек
    const habitIcons = getHabitIconsForDay(day);
    const dayRecords = getRecordsForDay(day);
    const uniqueHabitCount = new Set(dayRecords.map(record => record.habitId)).size;
    const hasMoreHabits = uniqueHabitCount > 3;
    
    return (
      <div className="day-icons">
        {habitIcons.map(habit => {
          const Icon = FaIcons[habit.icon as keyof typeof FaIcons];
          return (
            <div key={habit.id} className="day-icon">
              {Icon && <Icon color={habit.color} size={10} />}
            </div>
          );
        })}
        {hasMoreHabits && (
          <span className="day-more-indicator">+{uniqueHabitCount - 3}</span>
        )}
      </div>
    );
  } else {
    // Режим конкретной привычки
    const status = getDayStatus(day);
    const habit = habits.find(h => h.id === parseInt(selectedHabit));
    
    if (!status?.completed || !habit) return null;

    const Icon = FaIcons[habit.icon as keyof typeof FaIcons];

    return (
      <div className="day-indicators">
        {status.hasNotes && (
          <span className="note-indicator">*</span>
        )}
        {status.recordCount > 1 && (
          <span className="record-count">{Math.min(status.recordCount, 9)}</span>
        )}
    </div>
    );
  }
};

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];

    // Пустые ячейки для дней перед первым числом месяца
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Дни месяца
    for (let day = 1; day <= daysInMonth; day++) {
      const dayRecords = getRecordsForDay(day);
      const isToday = new Date().getDate() === day && 
                     new Date().getMonth() === month && 
                     new Date().getFullYear() === year;
      
      const dayStatus = getDayStatus(day);
      const isCompleted = selectedHabit !== "all" && dayStatus?.completed;

      days.push(
        <div
          key={day}
          className={`calendar-day ${isToday ? 'today' : ''} ${isCompleted ? 'completed' : ''}`}
        >
          <div className="day-number">{day}</div>
          {renderDayContent(day)}
        </div>
      );
    }

    return days;
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="calendar-page">
      <div className="calendar-container">
        <div className="calendar-header">
          <div className="calendar-controls">
            <button onClick={() => changeMonth(-1)} className="nav-button">
              <FaIcons.FaChevronLeft />
            </button>
            
            <h1 className="calendar-title">
              {monthNames[month]} {year}
            </h1>
            
            <button onClick={() => changeMonth(1)} className="nav-button">
              <FaIcons.FaChevronRight />
            </button>
            
            <button onClick={goToToday} className="today-button">
              Today
            </button>
          </div>
        </div>

        <div className="calendar-grid">
          <div className="weekdays">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
              <div key={day} className="weekday">{day}</div>
            ))}
          </div>
          
          <div className="calendar-days">
            {loading ? (
              <div className="calendar-loading">Loading...</div>
            ) : (
              renderCalendar()
            )}
          </div>
        </div>

        <div className="calendar-footer">
          <select 
            value={selectedHabit}
            onChange={(e) => setSelectedHabit(e.target.value)}
            className="habit-select"
          >
            <option value="all">All Habits</option>
            {habits.map(habit => (
              <option key={habit.id} value={habit.id.toString()}>
                {habit.name}
              </option>
            ))}
          </select>

          <div className="legend">
            {selectedHabit === "all" ? (
              <>
                <div className="legend-item">
                  <span className="legend-dot"></span>
                  Up to 3 habit icons per day
                </div>
                <div className="legend-item">
                  <span className="day-more-indicator">+2</span>
                  Additional habits count
                </div>
              </>
            ) : (
              <>
                <div className="legend-item">
                  <div className="legend-half completed"></div>
                  Habit completed
                </div>
                <div className="legend-item">
                  <span className="note-indicator">*</span>
                  Has notes
                </div>
                <div className="legend-item">
                  <span className="record-count">2</span>
                  Multiple records
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}