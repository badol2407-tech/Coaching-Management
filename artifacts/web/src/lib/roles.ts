export const USER_ROLES = {
  SUPER_ADMIN: "super_admin",
  ORG_ADMIN: "org_admin",
  TEACHER: "teacher",
  STUDENT: "student",
  GUARDIAN: "guardian",
  ADMINISTRATIVE_STAFF: "administrative_staff",
} as const;

export const ADMINISTRATIVE_STAFF_ROLE = USER_ROLES.ADMINISTRATIVE_STAFF;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const FIREBASE_AUTH_ROLE_MAP: Record<string, UserRole> = {
  super_admin: USER_ROLES.SUPER_ADMIN,
  org_admin: USER_ROLES.ORG_ADMIN,
  teacher: USER_ROLES.TEACHER,
  student: USER_ROLES.STUDENT,
  guardian: USER_ROLES.GUARDIAN,
  administrative_staff: USER_ROLES.ADMINISTRATIVE_STAFF,
};

export const ALL_USER_ROLES = Object.values(USER_ROLES);

export function mapFirebaseAuthRole(value: unknown): UserRole | null {
  if (typeof value !== "string") return null;
  return FIREBASE_AUTH_ROLE_MAP[value] ?? null;
}

export function isUserRole(value: unknown): value is UserRole {
  return mapFirebaseAuthRole(value) !== null;
}