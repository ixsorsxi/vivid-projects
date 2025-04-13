
export interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description?: string;
    status: string;
    priority: string;
    dueDate?: string;
    project?: string;
    assignees: { name: string; avatar?: string }[];
    completed?: boolean;
    subtasks?: any[];
    dependencies?: { taskId: string; type: string }[];
    parent_task_id?: string; // Added parent task reference
    parentTaskTitle?: string; // Added for displaying parent task name
  };
  allTasks?: any[];
  className?: string;
  actions?: React.ReactNode;
  onStatusChange?: () => void;
  onViewDetails?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export interface SubtaskProps {
  subtasks?: any[];
}

export interface DependencyProps {
  dependencies?: { taskId: string; type: string }[];
}
