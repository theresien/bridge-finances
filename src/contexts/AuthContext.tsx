import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/api';
import { apiService } from '@/services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { username: string; email: string; password: string; firstName: string; lastName: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('user_data');

    if (token && userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await apiService.login({ usernameOrEmail: email, password });
    // Convert AuthResponse to User format
    const userData = {
      id: response.id,
      username: response.username,
      email: response.email,
      role: response.role,
    };
    setUser(userData);
    localStorage.setItem('user_data', JSON.stringify(userData));
  };

  const register = async (data: { username: string; email: string; password: string; firstName: string; lastName: string }) => {
    const response = await apiService.register(data);
    // Convert AuthResponse to User format
    const userData = {
      id: response.id,
      username: response.username,
      email: response.email,
      role: response.role,
    };
    setUser(userData);
    localStorage.setItem('user_data', JSON.stringify(userData));
  };

  const logout = () => {
    apiService.logout();
    localStorage.removeItem('user_data');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
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
