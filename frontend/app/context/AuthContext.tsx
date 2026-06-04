import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { supabase } from '../config/supabase';
import {
  fetchUserDocument,
  logoutUser,
  UserDocument,
} from '../services/authService';
import { UserRole } from '../types/roles';
import { registerPushToken } from '../services/notificationService';


interface AuthContextType {
  user:       UserDocument | null;
  isLoading:  boolean;
  isLoggedIn: boolean;
  role:       UserRole | null;
  isTutor:    boolean;
  isStudent:  boolean;
  setUser:    (doc: UserDocument | null) => void;
  logout:     () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user:       null,
  isLoading:  true,
  isLoggedIn: false,
  role:       null,
  isTutor:    false,
  isStudent:  true,
  setUser:    () => {},
  logout:     async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]           = useState<UserDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await fetchUserDocument(session.user.id);
        setUser(profile);
      }
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const profile = await fetchUserDocument(session.user.id);
          setUser(profile);
        } else {
          setUser(null);
        }
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  const role      = user?.role ?? null;
  const isTutor   = role === 'tutor' || role === 'both';
  const isStudent = role === 'student' || role === 'both';
  const isLoggedIn = user !== null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isLoggedIn,
        role,
        isTutor,
        isStudent,
        setUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}

export function useRole() {
  const { role, isTutor, isStudent } = useContext(AuthContext);
  return { role, isTutor, isStudent };
}