
import { PriorityLevel } from './common';

export type TaskStatus = 'to-do' | 'in-progress' | 'in-review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: string;
  dueDate?: string; // Alternative format for easier component usage
  completed: boolean;
  completed_at?: string;
  created_at?: string;
  assignees: Assignee[]; // Making this non-optional to match component requirements
  project?: string;
  subtasks?: Subtask[];
  dependencies?: TaskDependency[];
  user_id?: string;
  parentTaskTitle?: string; // For displaying parent task info
}

export interface Assignee {
  id: string;
  name: string;
  avatar?: string;
}

export interface TaskDependency {
  id?: string;
  taskId: string;
  type: DependencyType;
  task?: Task;
}

export type DependencyType = 'finish-to-start' | 'start-to-start' | 'finish-to-finish' | 'start-to-finish' | 'blocks' | 'is-blocked-by' | 'relates-to' | 'duplicates' | 'blocking' | 'waiting-on' | 'related';

export interface Subtask {
  id: string;
  task_id: string;
  title: string;
  description?: string;
  completed: boolean;
  created_at?: string;
}
