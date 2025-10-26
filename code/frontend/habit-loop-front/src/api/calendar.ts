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