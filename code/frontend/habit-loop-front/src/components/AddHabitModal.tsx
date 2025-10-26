// AddHabitModal.tsx
import { useState, useRef, useEffect } from "react";
import { createHabit } from "../api/habits";
import type { HabitData } from "../api/habits";
import * as FaIcons from "react-icons/fa";
import { ChromePicker } from "react-color";
import "./AddHabitModal.css"


interface AddHabitModalProps {
  onClose: () => void;
  onCreated: (habit: HabitData) => void;
}

const ICONS = Object.keys(FaIcons).filter(name => name.startsWith("Fa"));

export default function AddHabitModal({ onClose, onCreated }: AddHabitModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("FaStar");
  const [color, setColor] = useState("#1890ff");
  const [negative, setNegative] = useState(false);
  const [trackStreak, setTrackStreak] = useState(true);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [iconSearch, setIconSearch] = useState("");
  
  const modalRef = useRef<HTMLDivElement>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  // Close color picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert("Please enter a habit name");
      return;
    }

    try {
      // Убираем id из данных для создания - сервер сам его сгенерирует
      const newHabit = await createHabit({ 
        name: name.trim(), 
        description: description.trim(), 
        icon, 
        color, 
        negative, 
        trackStreak 
      });
      onCreated(newHabit);
    } catch (e) {
      alert("Error creating habit: " + e);
    }
  };

  const filteredIcons = ICONS.filter(iconName =>
    iconName.toLowerCase().includes(iconSearch.toLowerCase())
  );

  const IconComponent = (FaIcons as any)[icon];

  return (
    <div className="modal-backdrop">
      <div className="modal" ref={modalRef}>
        <div className="modal-header">
          <h2>Add New Habit</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-content">
          <div className="form-group">
            <label>Name *</label>
            <input 
              value={name} 
              onChange={e => setName(e.target.value)}
              placeholder="Enter habit name"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea 
              value={description} 
              onChange={e => setDescription(e.target.value)}
              placeholder="Enter habit description"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>Icon</label>
            <div className="icon-search">
              <input
                type="text"
                placeholder="Search icons..."
                value={iconSearch}
                onChange={e => setIconSearch(e.target.value)}
              />
            </div>
            <div className="icon-grid">
              {filteredIcons.slice(0, 12).map(iconName => {
                const Icon = (FaIcons as any)[iconName];
                return (
                  <div
                    key={iconName}
                    className={`icon-option ${icon === iconName ? "selected" : ""}`}
                    onClick={() => setIcon(iconName)}
                  >
                    <Icon color={icon === iconName ? color : "#666"} size={20} />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="form-group">
            <label>Color</label>
            <div className="color-picker-container" ref={colorPickerRef}>
              <div 
                className="color-preview"
                onClick={() => setShowColorPicker(!showColorPicker)}
              >
                <div 
                  className="color-swatch" 
                  style={{ backgroundColor: color }}
                />
                <span>{color}</span>
              </div>
              {showColorPicker && (
                <div className="color-picker-popover">
                  <ChromePicker 
                    color={color} 
                    onChange={c => setColor(c.hex)} 
                  />
                </div>
              )}
            </div>
          </div>

          <div className="form-group checkboxes">
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={negative} 
                onChange={e => setNegative(e.target.checked)} 
              />
               Negative habit
            </label>
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={trackStreak} 
                onChange={e => setTrackStreak(e.target.checked)} 
              />
               Track streak
            </label>
          </div>
        </div>

        <div className="modal-actions">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="submit-button" onClick={handleSubmit}>
            Create Habit
          </button>
        </div>
      </div>
    </div>
  );
}