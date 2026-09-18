// Lightweight utility function to conditionally join classNames without external dependencies
export type ClassValue = string | number | boolean | undefined | null | { [key: string]: any } | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === "string" || typeof input === "number") {
      classes.push(String(input));
    } else if (Array.isArray(input)) {
      const inner = cn(...input);
      if (inner) classes.push(inner);
    } else if (typeof input === "object") {
      for (const [key, value] of Object.entries(input)) {
        if (value) classes.push(key);
      }
    }
  }

  return classes.join(" ");
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export async function safeFetchJson<T = any>(url: string, options?: RequestInit): Promise<T> {
  const headers = new Headers(options?.headers);
  if (!headers.has("Content-Type") && options?.body && typeof options.body === "string") {
    headers.set("Content-Type", "application/json");
  }

  // If running in browser and token exists in localStorage, pass as Bearer fallback
  if (typeof window !== "undefined" && !headers.has("Authorization")) {
    const token = localStorage.getItem("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: options?.credentials || "include",
  });
  const contentType = res.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    const text = await res.text();
    if (text.startsWith("<!DOCTYPE") || text.includes("<html")) {
      throw new Error(
        `Backend endpoint '${url}' returned an HTML page instead of JSON. Ensure the backend server is running on port 5001 (npm run dev:all).`
      );
    }
    throw new Error(`Unexpected response content type: ${contentType || "unknown"}`);
  }

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }

  return data as T;
}

