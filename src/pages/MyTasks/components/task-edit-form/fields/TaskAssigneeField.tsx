
import React from 'react';
import { Label } from "@/components/ui/label";
import { Assignee } from '@/lib/data';
import TaskAssigneeSelector from '@/components/tasks/task-details/TaskAssigneeSelector';

interface TaskAssigneeFieldProps {
  assignees: Assignee[];
  availableUsers: Assignee[];
  onAssigneeAdd: (assignee: Assignee) => void;
  onAssigneeRemove: (assigneeName: string) => void;
}

const TaskAssigneeField: React.FC<TaskAssigneeFieldProps> = ({
  assignees,
  availableUsers,
  onAssigneeAdd,
  onAssigneeRemove
}) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label className="text-right">
        Assignees
      </Label>
      <div className="col-span-3">
        <TaskAssigneeSelector
          assignees={assignees}
          availableUsers={availableUsers}
          onAssigneeAdd={onAssigneeAdd}
          onAssigneeRemove={onAssigneeRemove}
        />
      </div>
    </div>
  );
};

export default TaskAssigneeField;
