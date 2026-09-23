export type UserRole =
  | "ADMIN"
  | "PRINCIPAL"
  | "TEACHER"
  | "ACCOUNTANT"
  | "RECEPTIONIST"
  | "PARENT";

export type Permission =
  | "students.read"
  | "students.create"
  | "students.update"
  | "students.delete"
  | "attendance.read"
  | "attendance.mark"
  | "fees.read"
  | "fees.create"
  | "fees.collect"
  | "reports.read"
  | "reports.export"
  | "users.read"
  | "users.manage"
  | "settings.read"
  | "settings.manage"
  | "admissions.read"
  | "admissions.manage"
  | "academics.read"
  | "academics.manage"
  | "homework.read"
  | "homework.create"
  | "homework.review"
  | "diary.read"
  | "diary.create"
  | "communication.read"
  | "communication.send";

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  ADMIN: [
    "students.read", "students.create", "students.update", "students.delete",
    "attendance.read", "attendance.mark",
    "fees.read", "fees.create", "fees.collect",
    "reports.read", "reports.export",
    "users.read", "users.manage",
    "settings.read", "settings.manage",
    "admissions.read", "admissions.manage",
    "academics.read", "academics.manage",
    "homework.read", "homework.create", "homework.review",
    "diary.read", "diary.create",
    "communication.read", "communication.send",
  ],
  PRINCIPAL: [
    "students.read", "students.create", "students.update",
    "attendance.read", "attendance.mark",
    "fees.read",
    "reports.read", "reports.export",
    "users.read",
    "settings.read",
    "admissions.read", "admissions.manage",
    "academics.read", "academics.manage",
    "homework.read", "homework.review",
    "diary.read",
    "communication.read", "communication.send",
  ],
  TEACHER: [
    "students.read",
    "attendance.read", "attendance.mark",
    "academics.read", "academics.manage",
    "homework.read", "homework.create", "homework.review",
    "diary.read", "diary.create",
    "reports.read",
    "communication.read", "communication.send",
  ],
  ACCOUNTANT: [
    "students.read",
    "fees.read", "fees.create", "fees.collect",
    "reports.read", "reports.export",
  ],
  RECEPTIONIST: [
    "students.read", "students.create",
    "attendance.read",
    "admissions.read", "admissions.manage",
    "communication.read", "communication.send",
  ],
  PARENT: [
    "students.read",
    "attendance.read",
    "fees.read",
    "homework.read",
    "diary.read",
    "communication.read", "communication.send",
  ],
};

export function normalizeRole(role?: string | null): UserRole {
  if (!role) return "PARENT";
  const upper = role.toUpperCase();
  if (upper in ROLE_PERMISSIONS) {
    return upper as UserRole;
  }
  return "PARENT";
}

export function hasPermission(role: string | null | undefined, permission: Permission): boolean {
  const normRole = normalizeRole(role);
  const permissions = ROLE_PERMISSIONS[normRole] || [];
  return permissions.includes(permission);
}

export function hasAnyPermission(role: string | null | undefined, permissions: Permission[]): boolean {
  return permissions.some((perm) => hasPermission(role, perm));
}

export function hasAllPermissions(role: string | null | undefined, permissions: Permission[]): boolean {
  return permissions.every((perm) => hasPermission(role, perm));
}

export function canAccessRoute(pathname: string, role?: string | null): boolean {
  const normRole = normalizeRole(role);

  // Parent route guard
  if (pathname.startsWith("/parent")) {
    return normRole === "PARENT" || normRole === "ADMIN";
  }

  // Dashboard route guard
  if (pathname.startsWith("/dashboard")) {
    if (normRole === "PARENT") return false; // Parents should use /parent
    // Teacher specific routes or general admin routes
    return true;
  }

  return true;
}
