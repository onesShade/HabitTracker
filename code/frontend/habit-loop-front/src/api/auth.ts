// api/auth.ts - обновленный файл
const API_BASE = "http://localhost:8080/api";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  displayName?: string; // Добавляем опциональное поле
}

export interface AuthResponse {
  token: string;
}

export interface User {
  id: number;
  email: string;
  displayName: string | null;
  createdAt: string;
  enabled: boolean;
  username: string;
}

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(credentials),
    credentials: "include"
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Login failed");
  }

  const data: AuthResponse = await response.json();
  localStorage.setItem("token", data.token);
  return data;
}

export async function register(user: RegisterData): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user),
    credentials: "include"
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Registration failed");
  }

  const data: AuthResponse = await response.json();
  localStorage.setItem("token", data.token);
  return data;
}

export async function getCurrentUser(): Promise<User> {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE}/users/me`, {
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
    throw new Error(text || "Failed to fetch user data");
  }

  return response.json();
}

export async function deleteAccount(): Promise<void> {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE}/user`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to delete account");
  }

  localStorage.removeItem("token");
}

export function logout() {
  localStorage.removeItem("token");
  fetch(`${API_BASE}/auth/logout`, { method: "POST", credentials: "include" });
}

export function getToken(): string | null {
  return localStorage.getItem("token");
}