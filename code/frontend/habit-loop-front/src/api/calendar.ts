// api/calendar.ts
const API_BASE = "http://localhost:8080/api";

export interface Record {
  id: number;
  habitId: number;
  userId: number;
  date: string;
  note: string;
  createdAt: string;
}

export interface MonthRecordsRequest {
  year: number;
  month: number;
  habitId?: number;
}

export async function getMonthRecords(request: MonthRecordsRequest): Promise<Record[]> {
  const token = localStorage.getItem("token");
  
  const response = await fetch(`${API_BASE}/records/month`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(request)
  });

  if (response.status === 403) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    throw new Error("Forbidden: token invalid or expired");
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to fetch month records");
  }

  return response.json();
}

// Добавим в api/calendar.ts
export interface DayRecordsRequest {
    date: string;
    habitId?: number;
  }
  
  export async function getDayRecords(request: DayRecordsRequest): Promise<Record[]> {
    const token = localStorage.getItem("token");
    
    const params = new URLSearchParams({
      date: request.date
    });
    
    if (request.habitId) {
      params.append('habitId', request.habitId.toString());
    }
  
    const response = await fetch(`${API_BASE}/records/date?${params}`, {
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
      throw new Error(text || "Failed to fetch day records");
    }
  
    return response.json();
  }