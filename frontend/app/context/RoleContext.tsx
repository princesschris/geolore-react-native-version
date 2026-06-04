import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole, RoleContextType } from '../types/roles';

const RoleContext = createContext<RoleContextType>({
  role: null,
  setRole: () => {},
  isTutor: false,
  isStudent: true,
});

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole | null>('student');

  const isTutor = role === 'tutor' || role === 'both';
  const isStudent = role === 'student' || role === 'both';

  return (
    <RoleContext.Provider value={{ role, setRole, isTutor, isStudent }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole(): RoleContextType {
  return useContext(RoleContext);
}