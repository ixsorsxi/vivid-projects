
import { PriorityLevel, ProjectStatus, TeamMember } from './common';

export interface Project {
  id: string;
  name: string;
  description: string;
  progress: number;
  status: ProjectStatus;
  dueDate: string;
  priority?: PriorityLevel;
  members?: { id?: string; name: string; avatar?: string }[];
  team?: TeamMember[];
  category?: string;
  project_type?: string;
  project_manager_id?: string;
  start_date?: string;
  estimated_cost?: number;
  actual_cost?: number;
  budget_approved?: boolean;
  performance_index?: number;
  tasks?: { 
    total: number; 
    completed: number; 
    inProgress?: number;
    notStarted?: number;
  };
  project?: string; // Added for task compatibility
}

export interface ProjectMilestone {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  due_date: string;
  completion_date?: string;
  status: string;
  created_at: string;
}

export interface ProjectRisk {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  severity: string;
  probability: string;
  impact: string;
  mitigation_plan?: string;
  status: string;
}

export interface ProjectFinancial {
  id: string;
  project_id: string;
  transaction_date: string;
  amount: number;
  transaction_type: string;
  category: string;
  description?: string;
  payment_status: string;
}
