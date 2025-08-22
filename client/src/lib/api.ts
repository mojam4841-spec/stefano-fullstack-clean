import type { MenuItem } from "@/types/menu";

type ApiError = Error & { status?: number };

const BASE = (import.meta as any).env?.VITE_API_URL || "";

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const url = BASE ? `${BASE}${path}` : path;
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  if (!res.ok) {
    const err: ApiError = new Error(`API ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return res.json() as Promise<T>;
}

export const getMenu = () => api<MenuItem[]>("/api/menu");
