import { createContext, useContext, useState, type ReactNode } from 'react';
import type { AuthState } from '@/types';

interface AuthContextType extends AuthState {
  login: (username: string, password: string, role: 'admin' | 'gym') => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    role: null,
    accessToken: null,
    username: null,
    email: null,
  });

  const login = (username: string, password: string, role: 'admin' | 'gym') => {
    if (password !== 'password') return false;

    if (role === 'admin') {
      setState({
        isAuthenticated: true,
        role: 'admin',
        accessToken: 'mock-admin-token',
        username: username || 'superadmin',
        email: 'admin@gympro.com',
        adminId: 'admin-1',
      });
    } else {
      setState({
        isAuthenticated: true,
        role: 'gym',
        accessToken: 'mock-gym-token',
        username: username || 'gymmanager',
        email: 'manager@fitzone.com',
        gymManagerId: 'gm-1',
        gymId: 'g1',
        gymName: 'FitZone Downtown',
      });
    }
    return true;
  };

  const logout = () => {
    setState({
      isAuthenticated: false,
      role: null,
      accessToken: null,
      username: null,
      email: null,
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
