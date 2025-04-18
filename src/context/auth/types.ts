
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

export interface CustomRole {
  id: string;
  name: string;
  base_type: 'admin' | 'manager' | 'user';
  permissions?: string[];
}

export interface User extends SupabaseUser {
  name?: string;
  avatar?: string;
  role?: 'user' | 'admin' | 'manager';
  customRole?: CustomRole;
  // profile is part of the custom data we can get from Supabase Auth
  profile?: any;
  bio?: string;
  location?: string;
  department?: string;
  joinDate?: string;
  skills?: string[];
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  profile: any;
  isAdmin: boolean;
  isManager: boolean;
  hasPermission: (permission: string) => boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, metadata?: any) => Promise<boolean>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  createUser: (email: string, password: string, name: string, role: 'user' | 'admin' | 'manager') => Promise<boolean>;
  updateUserSettings: (settings: any) => void;
}
