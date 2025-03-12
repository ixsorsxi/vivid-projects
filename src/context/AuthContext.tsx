
import React, { createContext, useContext, useState, useEffect } from 'react';

// Basic user type
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  settings?: {
    language?: string;
    theme?: string;
    notifications?: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserSettings: (settings: Partial<User['settings']>) => void;
}

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    settings: {
      language: 'en',
      theme: 'light',
      notifications: true,
    }
  },
  {
    id: '2',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    settings: {
      language: 'en',
      theme: 'dark',
      notifications: true,
    }
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, we would make an API call here
    setIsLoading(true);
    
    // Simple validation for demo purposes
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && password === 'password') {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUserSettings = (settings: Partial<User['settings']>) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      settings: {
        ...user.settings,
        ...settings
      }
    };
    
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login, 
        logout,
        updateUserSettings
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
