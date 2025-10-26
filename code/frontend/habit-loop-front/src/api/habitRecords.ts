// api/habitRecords.ts
const API_BASE = "http://localhost:8080/api";

export interface RecordData {
  habitId: number;
  note: string;
}

export async function createRecord(record: RecordData): Promise<void> {
  const token = localStorage.getItem("token");
  
  const response = await fetch(`${API_BASE}/records?habitId=${record.habitId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ note: record.note }),
  });

  if (response.status === 403) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    throw new Error("Forbidden: token invalid or expired");
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to create record");
  }
}