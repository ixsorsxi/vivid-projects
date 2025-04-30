
import { ProjectStatus, TeamMember, PriorityLevel } from './common';

export interface ProjectMilestone {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  due_date: string;
  completion_date?: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'delayed' | 'blocked';
  created_at?: string;
}

export interface ProjectRisk {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  probability: number | 'low' | 'medium' | 'high'; 
  impact: 'low' | 'medium' | 'high';
  mitigation_plan?: string;
  status: 'identified' | 'analyzing' | 'mitigating' | 'resolved' | 'accepted' | 'active' | 'closed' | 'occurred';
  created_at?: string;
  updated_at?: string;
  owner_name?: string;
}

export interface ProjectFinancial {
  id: string;
  project_id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  category?: string;
  created_at?: string;
  transaction_date?: string;
  transaction_type?: 'income' | 'expense';
  payment_status?: 'paid' | 'pending' | 'overdue';
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  progress?: number;
  status: ProjectStatus;
  dueDate: string;
  category?: string;
  code?: string;
  budget?: number;
  is_private?: boolean;
  created_at?: string;
  updated_at?: string;
  userId?: string;
  project_type?: string;
  members?: Array<{ id: string; name: string; role?: string; avatar?: string }>;
  project_manager_id?: string;
  project_manager_name?: string;
  team?: TeamMember[];
  start_date?: string;
  priority?: PriorityLevel;
  estimated_cost?: number;
  budget_approved?: boolean;
  performance_index?: number;
}
