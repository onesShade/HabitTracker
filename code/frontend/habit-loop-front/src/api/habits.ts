export interface HabitData {
    id: number;
    name: string;
    description: string;
    icon: string;
    color: string;
    negative: boolean;
    trackStreak: boolean;
  }
  
  const API_BASE = "http://localhost:8080/api";
  
  export async function getHabits(): Promise<HabitData[]> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE}/habits`, {
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
      throw new Error(text || "Failed to fetch habits");
    }
  
    const data: HabitData[] = await response.json();
    return data;
  }
  
  export async function createHabit(habit: HabitData): Promise<HabitData> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE}/habits`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(habit),
    });
  
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || "Failed to create habit");
    }
  
    return response.json();
  }
  
  export async function deleteHabit(id: number): Promise<void> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE}/habits/${id}`, {
      method: "DELETE",
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
      throw new Error(text || "Failed to delete habit");
    }
  
    // Для DELETE запроса обычно не возвращается тело ответа, просто проверяем статус
    return;
  }