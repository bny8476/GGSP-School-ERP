/**
 * Canonical Frontend Role-Based Access Control (RBAC) System
 * Perfectly aligned with backend/src/config/permissions.ts
 */

export type UserRole =
  | "SUPERADMIN"
  | "ADMIN"
  | "PRINCIPAL"
  | "TEACHER"
  | "ACCOUNTANT"
  | "RECEPTIONIST"
  | "STAFF"
  | "PARENT"
  | "RESTRICTED";

export type Permission = string;

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  SUPERADMIN: ["*"],
  ADMIN: [
    "students:*",
    "teachers:*",
    "parents:*",
    "academics:*",
    "attendance:*",
    "admissions:*",
    "finance:*",
    "fees:*",
    "payroll:*",
    "reports:*",
    "settings:*",
    "announcements:*",
    "notifications:*",
    "messages:*",
    "activities:*",
    "diary:*",
    "homework:*",
    "assessments:*",
    "timetable:*",
    "visitors:*",
  ],
  PRINCIPAL: [
    "students:read",
    "teachers:read",
    "parents:read",
    "academics:*",
    "attendance:read",
    "admissions:read",
    "reports:*",
    "announcements:*",
    "notifications:*",
    "messages:*",
    "assessments:*",
    "timetable:read",
  ],
  TEACHER: [
    "students:read",
    "attendance:read",
    "attendance:mark",
    "diary:create",
    "diary:read",
    "homework:create",
    "homework:read",
    "homework:review",
    "activities:create",
    "activities:read",
    "assessments:create",
    "assessments:read",
    "academics:read",
    "timetable:read",
    "messages:*",
    "announcements:read",
    "notifications:read",
  ],
  PARENT: [
    "child:read",
    "students:read",
    "attendance:read",
    "diary:read",
    "homework:read",
    "activities:read",
    "fees:read",
    "fees:pay",
    "assessments:read",
    "announcements:read",
    "messages:*",
    "notifications:read",
  ],
  ACCOUNTANT: [
    "finance:*",
    "fees:*",
    "payroll:*",
    "reports:read",
    "reports:export",
    "students:read",
    "announcements:read",
  ],
  RECEPTIONIST: [
    "visitors:*",
    "admissions:read",
    "admissions:create",
    "announcements:read",
    "notifications:read",
  ],
  STAFF: [
    "announcements:read",
    "notifications:read",
    "profile:read",
    "profile:update",
  ],
  RESTRICTED: [],
};

/**
 * Normalizes input role string to canonical UserRole.
 * Fails closed: unrecognized or empty roles log a warning and return "RESTRICTED" (0 permissions).
 */
export function normalizeRole(role?: string | null): UserRole {
  if (!role) {
    console.warn("[RBAC] normalizeRole: Missing role provided, defaulting to RESTRICTED (fail-closed)");
    return "RESTRICTED";
  }
  const clean = role.replace(/[\s_-]+/g, "").toUpperCase();
  if (clean === "SUPERADMIN") return "SUPERADMIN";
  if (clean in ROLE_PERMISSIONS) {
    return clean as UserRole;
  }
  console.warn(`[RBAC] normalizeRole: Unrecognized role "${role}", defaulting to RESTRICTED (fail-closed)`);
  return "RESTRICTED";
}

/**
 * Validates whether a user role or explicit permission set contains the required permission,
 * supporting wildcards (e.g. "students:*" satisfies "students:read").
 */
export function hasPermission(
  userRoleOrPermissions: string | string[] | null | undefined,
  requiredPermission: string
): boolean {
  if (!userRoleOrPermissions) return false;

  let permissions: string[] = [];
  if (Array.isArray(userRoleOrPermissions)) {
    permissions = userRoleOrPermissions;
  } else {
    const norm = normalizeRole(userRoleOrPermissions);
    permissions = ROLE_PERMISSIONS[norm] || [];
  }

  if (permissions.includes("*")) return true;
  if (permissions.includes(requiredPermission)) return true;

  // Colon or dot wildcard check
  const colonParts = requiredPermission.split(":");
  if (colonParts.length === 2 && permissions.includes(`${colonParts[0]}:*`)) {
    return true;
  }
  const dotParts = requiredPermission.split(".");
  if (dotParts.length === 2 && (permissions.includes(`${dotParts[0]}:*`) || permissions.includes(`${dotParts[0]}.*`))) {
    return true;
  }
  return false;
}

export function hasAnyPermission(role: string | null | undefined, permissions: string[]): boolean {
  return permissions.some((perm) => hasPermission(role, perm));
}

export function hasAllPermissions(role: string | null | undefined, permissions: string[]): boolean {
  return permissions.every((perm) => hasPermission(role, perm));
}

export function canAccessRoute(pathname: string, role?: string | null): boolean {
  const normRole = normalizeRole(role);
  if (normRole === "RESTRICTED") return false;

  // Parent route guard
  if (pathname.startsWith("/parent")) {
    return normRole === "PARENT" || normRole === "ADMIN" || normRole === "SUPERADMIN";
  }

  // Dashboard route guard
  if (pathname.startsWith("/dashboard")) {
    if (normRole === "PARENT") return false; // Parents should use /parent
    return true;
  }

  return true;
}
