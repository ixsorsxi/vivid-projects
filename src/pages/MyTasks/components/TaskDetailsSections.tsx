
import React from 'react';
import { Task } from '@/lib/data';
import TaskDescription from '@/components/tasks/task-details/TaskDescription';
import TaskMetadata from '@/components/tasks/task-details/TaskMetadata';
import TaskDependencies from '@/components/tasks/task-details/TaskDependencies';
import TaskSubtasks from '@/components/tasks/task-details/TaskSubtasks';
import TaskAssigneeSelector from '@/components/tasks/task-details/TaskAssigneeSelector';

interface TaskDetailsSectionsProps {
  task: Task;
  allTasks: Task[];
  formatDate: (dateString: string) => string;
  onAddDependency?: (taskId: string, dependencyType: string) => void;
  onRemoveDependency?: (taskId: string) => void;
  onAddSubtask?: (parentId: string, title: string) => void;
  onToggleSubtask?: (taskId: string) => void;
  onDeleteSubtask?: (taskId: string) => void;
  onAssigneeAdd?: (assignee: any) => void;
  onAssigneeRemove?: (assigneeName: string) => void;
  availableUsers?: any[];
}

const TaskDetailsSections: React.FC<TaskDetailsSectionsProps> = ({
  task,
  allTasks,
  formatDate,
  onAddDependency,
  onRemoveDependency,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
  onAssigneeAdd,
  onAssigneeRemove,
  availableUsers = []
}) => {
  return (
    <div className="space-y-4 mt-2">
      <TaskDescription description={task.description} />
      
      <TaskMetadata 
        dueDate={task.dueDate} 
        project={task.project} 
        formatDate={formatDate} 
      />
      
      {/* Task Dependencies Section */}
      {onAddDependency && onRemoveDependency && (
        <TaskDependencies
          task={task}
          allTasks={allTasks}
          onAddDependency={(taskId, type) => onAddDependency(taskId, type)}
          onRemoveDependency={onRemoveDependency}
        />
      )}
      
      {/* Subtasks Section */}
      <TaskSubtasks
        task={task}
        onAddSubtask={onAddSubtask}
        onToggleSubtask={onToggleSubtask}
        onDeleteSubtask={onDeleteSubtask}
      />
      
      {/* Assignees Section */}
      <TaskAssigneeSelector
        assignees={task.assignees}
        availableUsers={availableUsers}
        onAssigneeAdd={assignee => onAssigneeAdd && onAssigneeAdd(assignee)}
        onAssigneeRemove={userName => onAssigneeRemove && onAssigneeRemove(userName)}
      />
    </div>
  );
};

export default TaskDetailsSections;
