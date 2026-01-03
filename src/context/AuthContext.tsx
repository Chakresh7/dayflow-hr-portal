import React, { createContext, useContext, useState, ReactNode } from 'react';

type UserRole = 'HR' | 'EMPLOYEE' | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  position?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  userRole: UserRole;
  isFirstLogin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  completePasswordChange: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers = [
  {
    id: '1',
    email: 'hr@dayflow.com',
    password: 'password123',
    name: 'Sarah Johnson',
    role: 'HR' as UserRole,
    isFirstLogin: false,
    department: 'Human Resources',
    position: 'HR Manager',
  },
  {
    id: '2',
    email: 'employee@dayflow.com',
    password: 'password123',
    name: 'John Smith',
    role: 'EMPLOYEE' as UserRole,
    isFirstLogin: true,
    department: 'Engineering',
    position: 'Software Developer',
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const foundUser = mockUsers.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (foundUser) {
      setUser({
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        department: foundUser.department,
        position: foundUser.position,
      });
      setIsAuthenticated(true);
      setIsFirstLogin(foundUser.isFirstLogin);
      return { success: true };
    }

    return { success: false, error: 'Invalid email or password' };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsFirstLogin(false);
  };

  const completePasswordChange = () => {
    setIsFirstLogin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        userRole: user?.role ?? null,
        isFirstLogin,
        login,
        logout,
        completePasswordChange,
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
