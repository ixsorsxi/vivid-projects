
import { Task, TaskStatus, TaskPriority, Assignee } from '@/lib/types/task';

export interface TaskCreateData {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: string;
  project_id: string;
  assignee_ids?: string[];
}

export interface TaskUpdateData {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string;
  completed?: boolean;
  completed_at?: string;
  assignee_ids?: string[];
}

export interface TaskApiResponse {
  task: Task | null;
  success: boolean;
  message?: string;
}
