
export interface Task {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: string;
  completed: boolean;
  completed_at?: string;
  created_at?: string;
  assignees?: Assignee[];
}

export type TaskStatus = 'to-do' | 'in-progress' | 'in-review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Assignee {
  id: string;
  name: string;
  avatar?: string;
}

export interface TaskDependency {
  id: string;
  task_id: string;
  dependency_task_id: string;
  dependency_type: DependencyType;
  created_at?: string;
}

export type DependencyType = 'finish-to-start' | 'start-to-start' | 'finish-to-finish' | 'start-to-finish';
