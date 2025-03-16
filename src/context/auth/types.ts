
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

export interface User extends SupabaseUser {
  profile?: any;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  profile: any;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, metadata?: any) => Promise<boolean>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  createUser: (email: string, password: string, name: string, role: 'user' | 'admin') => Promise<boolean>;
  updateUserSettings: (settings: any) => void;
}
