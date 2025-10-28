// DayRecordsModal.tsx
import { useEffect, useState } from "react";
import { getDayRecords, type Record } from "../api/calendar";
import { getHabits, type HabitData } from "../api/habits";
import * as FaIcons from "react-icons/fa";
import "./DayRecordsModal.css";

interface DayRecordsModalProps {
  date: string;
  habitId?: number;
  onClose: () => void;
}

export default function DayRecordsModal({ date, habitId, onClose }: DayRecordsModalProps) {
  const [records, setRecords] = useState<Record[]>([]);
  const [habits, setHabits] = useState<HabitData[]>([]);
  const [loading, setLoading] = useState(true);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadData();
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [date, habitId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [recordsData, habitsData] = await Promise.all([
        getDayRecords({ date, habitId }),
        getHabits()
      ]);
      setRecords(recordsData);
      setHabits(habitsData);
    } catch (err) {
      alert("Error loading records: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  const getHabitById = (habitId: number) => {
    return habits.find(habit => habit.id === habitId);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTitle = () => {
    if (habitId) {
      const habit = getHabitById(habitId);
      return `${habit?.name || 'Habit'} - ${formatDate(date)}`;
    }
    return `All Habits - ${formatDate(date)}`;
  };

  return (
    <div className="modal-backdrop">
      <div className="day-records-modal" ref={modalRef}>
        <div className="modal-header">
          <h2>{getTitle()}</h2>
          <button className="close-button" onClick={onClose}>
            <FaIcons.FaTimes />
          </button>
        </div>

        <div className="modal-content">
          {loading ? (
            <div className="loading">Loading records...</div>
          ) : records.length === 0 ? (
            <div className="no-records">
              No records found for this day
            </div>
          ) : (
            <div className="records-list">
              {records.map(record => {
                const habit = getHabitById(record.habitId);
                const Icon = habit ? FaIcons[habit.icon as keyof typeof FaIcons] : null;
                
                return (
                  <div key={record.id} className="record-item">
                    <div className="record-header">
                      <div className="habit-info">
                        {Icon && (
                          <div className="habit-icon">
                            <Icon color={habit?.color} size={20} />
                          </div>
                        )}
                        <span className="habit-name">
                          {habit?.name || `Habit #${record.habitId}`}
                        </span>
                      </div>
                      <span className="record-time">
                        {formatTime(record.createdAt)}
                      </span>
                    </div>
                    
                    {record.note && record.note.trim() !== "" && (
                      <div className="record-note">
                        {record.note}
                      </div>
                    )}
                    
                    <div className="record-footer">
                      <span className="record-id">#{record.id}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}