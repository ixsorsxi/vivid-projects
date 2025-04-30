
import { TaskStatus, TaskPriority } from '../types/task';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: string;
  dueDate?: string;
  completed: boolean;
  project_id: string;
  assignees: Assignee[];
  subtasks?: Subtask[];
  dependencies?: Dependency[];
  parent_task_id?: string;
  user_id?: string;
  completed_at?: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  task_id: string;
  status?: string;
  priority?: string;
}

export interface Dependency {
  taskId: string;
  type: string;
}

export interface Assignee {
  id: string;
  name: string;
  avatar?: string;
}

export interface TaskWithProject extends Task {
  project?: {
    name: string;
    id: string;
  }
}
