
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

export interface ProjectApiError extends Error {
  message: string;
  details?: string;
}
