// api/goals.ts
const API_BASE = "http://localhost:8080/api";

export interface Goal {
  id: number;
  user: {
    id: number;
    email: string;
    displayName: string | null;
    createdAt: string;
    enabled: boolean;
  };
  habit: {
    id: number;
    name: string;
    description: string;
    trackStreak: boolean;
    currentStreak: number;
    lastFIPDate: string | null;
    icon: string | null;
    color: string | null;
    negative: boolean;
  };
  targetValue: number;
  progressValue: number;
  deadline: string;
  achieved: boolean;
}

export interface CreateGoalRequest {
  habitId: number;
  targetValue: number;
  deadline?: string; // Сделаем опциональным
}

export async function getGoals(): Promise<Goal[]> {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE}/goals`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });

  if (response.status === 403) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    throw new Error("Forbidden: token invalid or expired");
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to fetch goals");
  }

  return response.json();
}

export async function createGoal(goal: CreateGoalRequest): Promise<Goal> {
  const token = localStorage.getItem("token");
  
  // Создаем URL с query параметром habitId
  const url = `${API_BASE}/goals`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(goal)
  });

  if (response.status === 403) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    throw new Error("Forbidden: token invalid or expired");
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to create goal");
  }

  return response.json();
}