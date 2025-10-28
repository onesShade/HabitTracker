// GoalsPage.tsx
import { useEffect, useState } from "react";
import { getGoals, createGoal, type Goal, type CreateGoalRequest } from "../api/goals";
import { getHabits, type HabitData } from "../api/habits";
import * as FaIcons from "react-icons/fa";
import "./GoalsPage.css";

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [habits, setHabits] = useState<HabitData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  
  const getDefaultDeadline = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    return date.toISOString().split('T')[0];
  };

  const [newGoal, setNewGoal] = useState({
    habitId: 0,
    targetValue: 1,
    deadline: getDefaultDeadline() // Устанавливаем дефолтную дату
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [goalsData, habitsData] = await Promise.all([
        getGoals(),
        getHabits()
      ]);
      setGoals(goalsData);
      setHabits(habitsData);
    } catch (err: any) {
      alert("Error loading data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async () => {
    if (!newGoal.habitId || !newGoal.targetValue) {
      alert("Please select a habit and enter target value");
      return;
    }
  
    try {
      // Если дата не указана, устанавливаем дефолтную (год от текущей даты)
      const goalData = {
        targetValue: newGoal.targetValue,
        deadline: newGoal.deadline || getDefaultDeadline()
      };
  
      await createGoal(newGoal);
      await loadData();
      setShowAddModal(false);
      setNewGoal({ habitId: 0, targetValue: 1, deadline: "" });
    } catch (err: any) {
      alert("Error creating goal: " + err.message);
    }
  };


  const getProgressPercentage = (goal: Goal) => {
    return Math.min((goal.progressValue / goal.targetValue) * 100, 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="goals-page">
        <div className="goals-loading">Loading goals...</div>
      </div>
    );
  }

  return (
    <div className="goals-page">
      <div className="goals-container">
        <div className="goals-header">
          <h1>My Goals</h1>
          <button 
            className="add-goal-button"
            onClick={() => setShowAddModal(true)}
          >
            <FaIcons.FaPlus />
            Add New Goal
          </button>
        </div>

        <div className="goals-list">
          {goals.length === 0 ? (
            <div className="no-goals">
              <FaIcons.FaFlag size={48} color="#667eea" />
              <h2>No goals yet</h2>
              <p>Create your first goal to track your progress!</p>
              <button 
                className="create-first-goal"
                onClick={() => setShowAddModal(true)}
              >
                Create First Goal
              </button>
            </div>
          ) : (
            goals.map(goal => {
              const progressPercentage = getProgressPercentage(goal);
              const daysUntilDeadline = getDaysUntilDeadline(goal.deadline);
              const Icon = goal.habit.icon ? FaIcons[goal.habit.icon as keyof typeof FaIcons] : FaIcons.FaBullseye;

              return (
                <div key={goal.id} className={`goal-card ${goal.achieved ? 'achieved' : ''}`}>
                  <div className="goal-header">
                    <div className="goal-habit-info">
                      <div className="habit-icon">
                        <Icon color={goal.habit.color || "#667eea"} size={24} />
                      </div>
                      <div className="goal-text">
                        <h3 className="habit-name">{goal.habit.name}</h3>
                        <p className="goal-deadline">
                          Deadline: {formatDate(goal.deadline)} 
                          <span className={`days-left ${daysUntilDeadline <= 7 ? 'urgent' : ''}`}>
                            ({daysUntilDeadline} days left)
                          </span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="goal-status">
                      {goal.achieved ? (
                        <div className="achieved-badge">
                          <FaIcons.FaCheck />
                          Completed
                        </div>
                      ) : (
                        <div className="progress-text">
                          {goal.progressValue}/{goal.targetValue}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="goal-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                    <span className="progress-percentage">
                      {Math.round(progressPercentage)}%
                    </span>
                  </div>

                  {goal.habit.description && (
                    <p className="goal-description">{goal.habit.description}</p>
                  )}
                </div>
              );
            })
          )}
        </div>

        {showAddModal && (
          <div className="modal-backdrop">
            <div className="add-goal-modal">
              <div className="modal-header">
                <h2>Create New Goal</h2>
                <button 
                  className="close-button"
                  onClick={() => setShowAddModal(false)}
                >
                  <FaIcons.FaTimes />
                </button>
              </div>

              <div className="modal-content">
                <div className="form-group">
                  <label>Habit</label>
                  <select 
                    value={newGoal.habitId}
                    onChange={e => setNewGoal(prev => ({ 
                      ...prev, 
                      habitId: parseInt(e.target.value) 
                    }))}
                  >
                    <option value={0}>Select a habit</option>
                    {habits.map(habit => (
                      <option key={habit.id} value={habit.id}>
                        {habit.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Target Value</label>
                  <input 
                    type="number"
                    min="1"
                    value={newGoal.targetValue}
                    onChange={e => setNewGoal(prev => ({ 
                      ...prev, 
                      targetValue: parseInt(e.target.value) 
                    }))}
                    placeholder="Enter target value"
                  />
                </div>

                <div className="form-group">
                  <label>Deadline</label>
                  <input 
                    type="date"
                    value={newGoal.deadline}
                    onChange={e => setNewGoal(prev => ({ 
                      ...prev, 
                      deadline: e.target.value 
                    }))}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button 
                  className="cancel-button"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="create-button"
                  onClick={handleCreateGoal}
                >
                  Create Goal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}