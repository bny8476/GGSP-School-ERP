import { create } from "zustand";
import { UserRole, normalizeRole, Permission, ROLE_PERMISSIONS } from "@/lib/rbac";

export interface AuthUser {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role: UserRole | string;
  avatar?: string;
  phone?: string;
  [key: string]: unknown;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  role: UserRole;
  permissions: Permission[];
  isLoading: boolean;
  setAuth: (data: { user?: AuthUser; token: string; role?: string; [key: string]: unknown }) => void;
  logout: () => void;
  hydrate: () => void;
}

function setAuthCookies(token: string, role: string) {
  if (typeof document === "undefined") return;
  const maxAge = 7 * 24 * 60 * 60; // 7 days
  document.cookie = `token=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  document.cookie = `user_role=${encodeURIComponent(role)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function clearAuthCookies() {
  if (typeof document === "undefined") return;
  document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
  document.cookie = "user_role=; path=/; max-age=0; SameSite=Lax";
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  role: "PARENT",
  permissions: [],
  isLoading: true,

  setAuth: (data) => {
    const rawRole = (data.role || (data.user && data.user.role) || "PARENT") as string;
    const role = normalizeRole(rawRole);
    const token = data.token;
    const user: AuthUser = (data.user || {
      id: String(data._id || data.id || ""),
      name: String(data.name || "User"),
      email: String(data.email || ""),
      role,
    }) as AuthUser;

    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(data));
      setAuthCookies(token, role);
    }

    set({
      user,
      token,
      isAuthenticated: true,
      role,
      permissions: ROLE_PERMISSIONS[role] || [],
      isLoading: false,
    });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      clearAuthCookies();
    }
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      role: "PARENT",
      permissions: [],
      isLoading: false,
    });
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  },

  hydrate: () => {
    if (typeof window === "undefined") return;
    try {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");
      if (token && userStr) {
        const data = JSON.parse(userStr);
        const rawRole = (data.role || (data.user && data.user.role) || "PARENT") as string;
        const role = normalizeRole(rawRole);
        const user: AuthUser = (data.user || data) as AuthUser;
        setAuthCookies(token, role);
        set({
          user,
          token,
          isAuthenticated: true,
          role,
          permissions: ROLE_PERMISSIONS[role] || [],
          isLoading: false,
        });
        return;
      }
    } catch (e) {
      console.error("Auth hydration error:", e);
    }
    set({ isLoading: false });
  },
}));
