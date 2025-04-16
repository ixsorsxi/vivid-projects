
import { ProjectStatus } from './common';
import { User } from './common';

export interface ProjectMilestone {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  due_date: string;
  completion_date?: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'delayed';
  created_at?: string;
}

export interface ProjectRisk {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  mitigation_plan?: string;
  status: 'identified' | 'analyzing' | 'mitigating' | 'resolved' | 'accepted';
  created_at?: string;
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
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  progress?: number;
  status: ProjectStatus;
  dueDate: string;
  category?: string;
  project_type?: string;
  members?: Array<{ id: string; name: string; role?: string; avatar?: string }>;
  project_manager_id?: string;
  project_manager_name?: string;
}
