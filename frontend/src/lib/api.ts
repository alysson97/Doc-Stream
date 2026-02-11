const API_BASE = "http://localhost:3000";

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Erro ${res.status}`);
  }

  return res.json();
}

// Auth
export interface LoginResponse {
  name: string;
  email: string;
  role: string;
  accessToken: string;
}

export interface RefreshResponse {
  accessToken: string;
}

export function login(email: string, password: string) {
  return request<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function refreshToken() {
  return request<RefreshResponse>("/auth/refresh", {
    method: "POST",
  });
}

// Users
export function createUser(username: string, email: string, password: string) {
  return request<{ id: number; username: string; email: string }>("/users", {
    method: "POST",
    body: JSON.stringify({ username, email, password }),
  });
}

// PDF
export interface PdfUploadResponse {
  jobId: string;
  status: string;
}

export function uploadPdf(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return request<PdfUploadResponse>("/pdf/upload", {
    method: "POST",
    body: formData,
  });
}
