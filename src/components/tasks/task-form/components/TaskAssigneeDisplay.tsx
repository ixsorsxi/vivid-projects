
import React from 'react';
import { Label } from "@/components/ui/label";
import { UserPlus } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar.custom";

interface Assignee {
  name: string;
}

interface TaskAssigneeDisplayProps {
  assignees: Assignee[] | undefined;
  handleRemoveAssignee: (name: string) => void;
  userRole?: 'admin' | 'manager' | 'user' | string;
}

const TaskAssigneeDisplay: React.FC<TaskAssigneeDisplayProps> = ({
  assignees,
  handleRemoveAssignee,
  userRole = 'user'
}) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label className="text-right">
        Assignee
      </Label>
      <div className="col-span-3">
        {assignees && assignees.length > 0 ? (
          <div className="flex flex-wrap gap-2 mb-2">
            {assignees.map((assignee, idx) => (
              <Badge key={idx} variant="outline" className="flex items-center gap-1 py-1 pl-1 pr-2">
                <Avatar name={assignee.name} size="xs" />
                <span>{assignee.name}</span>
                {(userRole === 'admin' || userRole === 'manager') && (
                  <button 
                    onClick={() => handleRemoveAssignee(assignee.name)}
                    className="ml-1 rounded-full hover:bg-muted inline-flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6 6 18"></path>
                      <path d="m6 6 12 12"></path>
                    </svg>
                  </button>
                )}
              </Badge>
            ))}
          </div>
        ) : (
          <div className="bg-muted/50 rounded-md p-2 flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
              <UserPlus className="h-3 w-3 text-primary" />
            </div>
            <span className="text-sm">Me</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskAssigneeDisplay;
