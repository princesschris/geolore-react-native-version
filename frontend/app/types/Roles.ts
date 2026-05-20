// ─────────────────────────────────────────────
//  Role Types
//  "student" – can only access student screens
//  "tutor"   – tutor-only (can also learn as student)
//  "both"    – explicitly both roles
// ─────────────────────────────────────────────

export type UserRole = 'student' | 'tutor' | 'both';

export interface RoleContextType {
  role: UserRole | null;
  setRole: (role: UserRole) => void;
  isTutor: boolean;
  isStudent: boolean;
}