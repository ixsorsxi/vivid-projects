
import { Task, Subtask } from '@/lib/types/task';

export interface TaskCreateData {
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date?: string;
  completed: boolean;
  project_id?: string;
  user_id: string;
}

export interface TaskApiError extends Error {
  message: string;
  details?: string;
}

export interface TaskUpdateData extends Partial<TaskCreateData> {
  id: string;
}
