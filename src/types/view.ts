
export type ViewType = 'list' | 'kanban' | 'calendar' | 'gantt' | 'timeline';

export interface ViewPreference {
  type: ViewType;
  settings?: {
    [key: string]: any;
  };
}

export interface TaskViewProps {
  tasks: any[];
  onStatusChange: (taskId: string) => void;
  onViewTask?: (task: any) => void;
  onEditTask?: (task: any) => void;
  onDeleteTask: (taskId: string) => void;
}
