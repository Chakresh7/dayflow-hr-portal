import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type UserRole = 'HR' | 'EMPLOYEE' | null;

interface Profile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  avatar_url?: string;
  department?: string;
  position?: string;
  phone?: string;
  company?: string;
  employee_id?: string;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  company: string;
  phone: string;
  role: 'HR' | 'EMPLOYEE';
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  profile: Profile | null;
  userRole: UserRole;
  isFirstLogin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string; role?: UserRole }>;
  logout: () => Promise<void>;
  completePasswordChange: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return;
    }

    if (profileData) {
      setProfile(profileData as Profile);
    }
  };

  const fetchRole = async (userId: string) => {
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .maybeSingle();

    if (roleError) {
      console.error('Error fetching role:', roleError);
      return;
    }

    if (roleData) {
      setUserRole(roleData.role as UserRole);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        // Defer Supabase calls with setTimeout to prevent deadlock
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id);
            fetchRole(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setUserRole(null);
        }

        if (event === 'SIGNED_OUT') {
          setProfile(null);
          setUserRole(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        fetchProfile(session.user.id);
        fetchRole(session.user.id);
      }

      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (data.user) {
      await fetchProfile(data.user.id);
      await fetchRole(data.user.id);
    }

    return { success: true };
  };

  const signup = async (data: SignupData): Promise<{ success: boolean; error?: string; role?: UserRole }> => {
    const redirectUrl = `${window.location.origin}/`;

    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          name: data.name,
          company: data.company,
          phone: data.phone,
          role: data.role,
        },
      },
    });

    if (error) {
      if (error.message.includes('already registered')) {
        return { success: false, error: 'An account with this email already exists' };
      }
      return { success: false, error: error.message };
    }

    if (authData.user) {
      // Wait a moment for the trigger to create profile and role
      await new Promise(resolve => setTimeout(resolve, 500));
      await fetchProfile(authData.user.id);
      await fetchRole(authData.user.id);
    }

    return { success: true, role: data.role };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setUserRole(null);
    setIsFirstLogin(false);
  };

  const completePasswordChange = () => {
    setIsFirstLogin(false);
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
      await fetchRole(user.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!session,
        user,
        profile,
        userRole,
        isFirstLogin,
        isLoading,
        login,
        signup,
        logout,
        completePasswordChange,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
