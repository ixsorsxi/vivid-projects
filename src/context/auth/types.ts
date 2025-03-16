
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

// Extended user type with profile information
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

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  createUser: (email: string, password: string, name: string, role: 'user' | 'admin') => Promise<boolean>;
  logout: () => void;
  updateUserSettings: (settings: Partial<User['settings']>) => void;
}
