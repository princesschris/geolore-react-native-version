import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useRole } from '../context/AuthContext';
import { UserRole } from '../types/Roles';

interface RoleGateProps {
  /** Which roles are allowed to see this screen */
  allowedRoles: UserRole[];
  /** Where to redirect if the role does NOT match. Defaults to 'Home' */
  fallback?: string;
  children: React.ReactNode;
}
export default function RoleGate({ allowedRoles, fallback = 'Home', children }: RoleGateProps) {
  const { role } = useRole();
  const navigation = useNavigation<any>();

  const hasAccess = role !== null && allowedRoles.includes(role);

  useEffect(() => {
    if (!hasAccess) {
      navigation.replace(fallback);
    }
  }, [hasAccess]);

  if (!hasAccess) return null;

  return <>{children}</>;
}