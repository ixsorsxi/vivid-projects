
import { ProjectStatus } from '@/lib/types/common';
import { ProjectFormState } from '@/hooks/useProjectForm';

export interface ProjectCreateData {
  name: string;
  description: string;
  category?: string;
  due_date?: string;
  status: ProjectStatus;
  progress?: number;
  user_id: string;
}

export interface ProjectTeamMemberData {
  project_id: string;
  user_id: string;
  role: string;
  name: string;
}

export interface ProjectTaskData {
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date?: string;
  completed: boolean;
  project_id: string;
  user_id: string;
}

export interface ProjectApiError extends Error {
  message: string;
  details?: string;
}
