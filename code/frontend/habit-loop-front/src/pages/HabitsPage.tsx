// HabitsPage.tsx
import { useEffect, useState } from "react";
import { getHabits, deleteHabit } from "../api/habits";
import { createRecord } from "../api/habitRecords";
import type { HabitData } from "../api/habits";
import "./HabitsPage.css";
import * as FaIcons from "react-icons/fa";
import AddHabitModal from "../components/AddHabitModal";

export default function HabitsPage() {
  const [habits, setHabits] = useState<HabitData[]>([]);
  const [openHabitId, setOpenHabitId] = useState<number | null>(null);
  const [notes, setNotes] = useState<{[key: number]: string}>({});
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = () => {
    getHabits()
      .then(setHabits)
      .catch(err => alert(err.message));
  };

  const toggleHabit = (id: number) => {
    setOpenHabitId(openHabitId === id ? null : id);
  };

  const handleAddHabit = (newHabit: HabitData) => {
    setHabits(prev => [...prev, newHabit]);
    setShowModal(false);
  };

  const handleDeleteHabit = async (id: number, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (window.confirm("Are you sure you want to delete this habit?")) {
      try {
        await deleteHabit(id);
        setHabits(prev => prev.filter(habit => habit.id !== id));
        if (openHabitId === id) {
          setOpenHabitId(null);
        }
      } catch (err) {
        alert("Error deleting habit: " + err.message);
      }
    }
  };

  const handleAddNote = async (habitId: number) => {
    const note = notes[habitId] || "";
    
    if (!note.trim()) {
      alert("Please enter a note");
      return;
    }

    try {
      await createRecord({
        habitId,
        note: note.trim()
      });
      
      // Очищаем поле ввода для конкретной привычки
      setNotes(prev => ({
        ...prev,
        [habitId]: ""
      }));

    } catch (err) {
      alert("Error adding note: " + err.message);
    }
  };

  const handleNoteChange = (habitId: number, value: string) => {
    setNotes(prev => ({
      ...prev,
      [habitId]: value
    }));
  };

  return (
    <div className="habits-page"> 
      <div className="habits-container">
        {habits.map((habit, index) => {
          const Icon = FaIcons[habit.icon as keyof typeof FaIcons];
          return (
            <div 
              className="habit-row" 
              key={habit.id}
              style={{ '--index': index } as React.CSSProperties}
            >
              {/* Кнопка удаления вынесена за пределы habit-item */}
              <button 
                className="delete-habit-btn"
                onClick={(e) => handleDeleteHabit(habit.id, e)}
                title="Delete habit"
              >
                <FaIcons.FaTrash size={14} />
              </button>
              
              <div
                className={`habit-item ${openHabitId === habit.id ? "open" : ""}`}
              >
                <div className="habit-header" onClick={() => toggleHabit(habit.id)}>
                  <span className="habit-icon">
                    {Icon && <Icon color={habit.color} size={24} />}
                  </span>
                  <span className="habit-name">{habit.name}</span>
                  <span className="habit-arrow">
                    {openHabitId === habit.id ? "▲" : "▼"}
                  </span>
                </div>

                {openHabitId === habit.id && (
                  <div className="habit-body">
                    <p className="habit-description">{habit.description}</p>
                    <div className="habit-note">
                      <input
                        type="text"
                        placeholder="Add a note"
                        value={notes[habit.id] || ""}
                        onChange={e => handleNoteChange(habit.id, e.target.value)}
                        onKeyPress={e => {
                          if (e.key === 'Enter') {
                            handleAddNote(habit.id);
                          }
                        }}
                      />
                      <button
                        onClick={() => handleAddNote(habit.id)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <button className="add-habit-button" onClick={() => setShowModal(true)}>
          Add new habit
        </button>

        {showModal && (
          <AddHabitModal
            onClose={() => setShowModal(false)}
            onCreated={handleAddHabit}
          />
        )}
      </div>
    </div>
  );
}