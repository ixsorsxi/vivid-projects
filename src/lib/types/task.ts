
import { Assignee, DependencyType, PriorityLevel } from './common';

// Use 'export type' for type re-exports with isolatedModules enabled
export type { Assignee, DependencyType };

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  status?: string;
  priority?: string;
}

export interface TaskDependency {
  taskId: string;
  type: DependencyType;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueDate?: string;
  project?: string;
  assignees: Assignee[]; // Required field
  completed?: boolean;
  parentId?: string; // For subtask relationship
  subtasks?: Subtask[];
  dependencies?: TaskDependency[];
}
