
import React from 'react';
import { Assignee } from '@/lib/data';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown, UserPlus, X } from 'lucide-react';

interface TaskAssigneeSelectorProps {
  assignees: Assignee[];
  availableUsers: Assignee[];
  onAssigneeAdd?: (user: Assignee) => void;
  onAssigneeRemove?: (userName: string) => void;
}

export const TaskAssigneeSelector: React.FC<TaskAssigneeSelectorProps> = ({
  assignees,
  availableUsers,
  onAssigneeAdd,
  onAssigneeRemove
}) => {
  const [open, setOpen] = React.useState(false);
  
  // Filter out already assigned users
  const unassignedUsers = availableUsers.filter(user => 
    !assignees.some(assignee => assignee.name === user.name)
  );

  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium mb-2 flex items-center">
        Assignees
      </h4>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {assignees.length > 0 ? (
          assignees.map((assignee, index) => (
            <Badge key={index} variant="outline" className="flex items-center gap-1 py-1 pl-1 pr-2">
              <Avatar name={assignee.name} src={assignee.avatar} size="xs" />
              <span>{assignee.name}</span>
              {onAssigneeRemove && (
                <button 
                  onClick={() => onAssigneeRemove(assignee.name)}
                  className="ml-1 rounded-full hover:bg-muted inline-flex items-center justify-center"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </Badge>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No assignees yet</p>
        )}
      </div>
      
      {onAssigneeAdd && unassignedUsers.length > 0 && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add assignee
              <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Search user..." />
              <CommandList>
                <CommandEmpty>No users found</CommandEmpty>
                <CommandGroup>
                  {unassignedUsers.map(user => (
                    <CommandItem 
                      key={user.name}
                      onSelect={() => {
                        onAssigneeAdd(user);
                        setOpen(false);
                      }}
                      className="flex items-center"
                    >
                      <Avatar name={user.name} src={user.avatar} size="xs" className="mr-2" />
                      <span>{user.name}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default TaskAssigneeSelector;
