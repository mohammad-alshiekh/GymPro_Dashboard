import { createContext, useContext, useState, type ReactNode } from 'react';
import { apiUrl } from '@/lib/api';
import type { AuthState } from '@/types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string, role: 'admin' | 'gym') => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    const saved = localStorage.getItem('gympro_auth');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return {
          isAuthenticated: false,
          role: null,
          accessToken: null,
          username: null,
          email: null,
        };
      }
    }
    return {
      isAuthenticated: false,
      role: null,
      accessToken: null,
      username: null,
      email: null,
    };
  });

  const login = async (email: string, password: string, role: 'admin' | 'gym') => {
    if (role === 'admin') {
      try {
        const response = await fetch(apiUrl('/SuperAdmin/LogIn'), {
          method: 'POST',
          headers: {
            'accept': '*/*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          return { success: false, message: errorData.message || 'Login failed' };
        }

        const data = await response.json();
        
        // In a real app, you'd decode the JWT to get these details
        // For now, we'll use the provided email and a mock username
        const newState: AuthState = {
          isAuthenticated: true,
          role: 'admin',
          accessToken: data.accessToken,
          username: email.split('@')[0],
          email: email,
          adminId: 'admin-1', // You might get this from the decoded token
        };

        setState(newState);
        localStorage.setItem('gympro_auth', JSON.stringify(newState));
        return { success: true };
      } catch (error) {
        console.error('Login error:', error);
        return { success: false, message: 'Network error or server unreachable' };
      }
    } else {
      // Keep mock logic for gym role for now
      if (password !== 'password') return { success: false, message: 'Invalid credentials' };
      
      const newState: AuthState = {
        isAuthenticated: true,
        role: 'gym',
        accessToken: 'mock-gym-token',
        username: email.split('@')[0] || 'gymmanager',
        email: email || 'manager@fitzone.com',
        gymManagerId: 'gm-1',
        gymId: 'g1',
        gymName: 'FitZone Downtown',
      };
      
      setState(newState);
      localStorage.setItem('gympro_auth', JSON.stringify(newState));
      return { success: true };
    }
  };

  const logout = () => {
    setState({
      isAuthenticated: false,
      role: null,
      accessToken: null,
      username: null,
      email: null,
    });
    localStorage.removeItem('gympro_auth');
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
