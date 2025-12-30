import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'accountant' | 'business_owner' | 'employee';
  tenantId: string;
  avatar?: string;
  permissions: string[];
  notificationPreferences?: {
    email: boolean;
    inApp: boolean;
    categories: {
      system: boolean;
      user: boolean;
      financial: boolean;
      compliance: boolean;
      workflow: boolean;
    };
    priorities: {
      low: boolean;
      medium: boolean;
      high: boolean;
      critical: boolean;
    };
  };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication - in real app, this would be an API call
    if (email === 'admin@example.com' && password === 'password') {
      const mockUser: User = {
        id: '1',
        email: 'admin@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'admin',
        tenantId: 'tenant1',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&dpr=2',
        permissions: ['all'],
        notificationPreferences: {
          email: true,
          inApp: true,
          categories: {
            system: true,
            user: true,
            financial: true,
            compliance: true,
            workflow: true
          },
          priorities: {
            low: false,
            medium: true,
            high: true,
            critical: true
          }
        }
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      setLoading(false);
      return true;
    }
    
    setLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}