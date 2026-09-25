/**
 * Unified Role-Based Access Control (RBAC) Permissions Configuration
 * Canonical resource:action colon syntax supporting wildcard matching.
 */

export const ALL_PERMISSIONS = [
  // Superadmin Wildcard
  '*',

  // Students
  'students:*',
  'students:read',
  'students:create',
  'students:update',
  'students:delete',

  // Teachers
  'teachers:*',
  'teachers:read',
  'teachers:create',
  'teachers:update',
  'teachers:delete',

  // Parents
  'parents:*',
  'parents:read',
  'parents:create',
  'parents:update',
  'parents:delete',

  // Academics & Curriculum
  'academics:*',
  'academics:read',
  'academics:create',
  'academics:update',
  'academics:delete',

  // Attendance
  'attendance:*',
  'attendance:read',
  'attendance:mark',
  'attendance:update',

  // Admissions
  'admissions:*',
  'admissions:read',
  'admissions:create',
  'admissions:update',
  'admissions:delete',

  // Finance, Fees & Payroll
  'finance:*',
  'finance:read',
  'finance:create',
  'finance:update',
  'finance:record-manual-payment',
  'fees:*',
  'fees:read',
  'fees:create',
  'fees:update',
  'fees:pay',
  'fees:collect',
  'payroll:*',
  'payroll:read',
  'payroll:create',
  'payroll:update',

  // Reports
  'reports:*',
  'reports:read',
  'reports:export',

  // Settings & System Management
  'settings:*',
  'settings:read',
  'settings:manage',

  // Announcements & Notifications
  'announcements:*',
  'announcements:read',
  'announcements:create',
  'announcements:update',
  'announcements:delete',
  'notifications:*',
  'notifications:read',
  'notifications:create',

  // Messages & Communication
  'messages:*',
  'messages:read',
  'messages:send',

  // Classroom Activities, Diary, Homework, Assessments & Timetable
  'activities:*',
  'activities:read',
  'activities:create',
  'diary:*',
  'diary:read',
  'diary:create',
  'diary:update',
  'homework:*',
  'homework:read',
  'homework:create',
  'homework:update',
  'homework:review',
  'assessments:*',
  'assessments:read',
  'assessments:create',
  'assessments:update',
  'timetable:*',
  'timetable:read',
  'timetable:update',

  // Visitors
  'visitors:*',
  'visitors:read',
  'visitors:create',

  // Child / Parent Specific
  'child:*',
  'child:read',

  // Profile
  'profile:read',
  'profile:update',
] as const;

export type Permission = (typeof ALL_PERMISSIONS)[number];

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  SuperAdmin: ['*'],
  Admin: [
    'students:*',
    'teachers:*',
    'parents:*',
    'academics:*',
    'attendance:*',
    'admissions:*',
    'finance:*',
    'fees:*',
    'payroll:*',
    'reports:*',
    'settings:*',
    'announcements:*',
    'notifications:*',
    'messages:*',
    'activities:*',
    'diary:*',
    'homework:*',
    'assessments:*',
    'timetable:*',
    'visitors:*',
  ],
  Principal: [
    'students:read',
    'teachers:read',
    'parents:read',
    'academics:*',
    'attendance:read',
    'admissions:read',
    'reports:*',
    'announcements:*',
    'notifications:*',
    'messages:*',
    'assessments:*',
    'timetable:read',
  ],
  Teacher: [
    'students:read',
    'attendance:read',
    'attendance:mark',
    'diary:create',
    'diary:read',
    'homework:create',
    'homework:read',
    'homework:review',
    'activities:create',
    'activities:read',
    'assessments:create',
    'assessments:read',
    'academics:read',
    'timetable:read',
    'messages:*',
    'announcements:read',
    'notifications:read',
  ],
  Parent: [
    'child:read',
    'students:read',
    'attendance:read',
    'diary:read',
    'homework:read',
    'activities:read',
    'fees:read',
    'fees:pay',
    'assessments:read',
    'announcements:read',
    'messages:*',
    'notifications:read',
  ],
  Accountant: [
    'finance:*',
    'fees:*',
    'payroll:*',
    'reports:read',
    'reports:export',
    'students:read',
    'announcements:read',
  ],
  Receptionist: [
    'visitors:*',
    'admissions:read',
    'admissions:create',
    'announcements:read',
    'notifications:read',
  ],
  Staff: [
    'announcements:read',
    'notifications:read',
    'profile:read',
    'profile:update',
  ],
};

/**
 * Checks whether an array of assigned permissions satisfies a required permission,
 * taking into account wildcard prefixes (e.g., 'students:*' satisfies 'students:read').
 */
export function hasPermission(userPermissions: string[], required: string): boolean {
  if (!userPermissions || !Array.isArray(userPermissions) || userPermissions.length === 0) {
    return false;
  }
  if (userPermissions.includes('*')) {
    return true;
  }
  if (userPermissions.includes(required)) {
    return true;
  }
  const parts = required.split(':');
  if (parts.length === 2) {
    const wildcard = `${parts[0]}:*`;
    if (userPermissions.includes(wildcard)) {
      return true;
    }
  }
  return false;
}
