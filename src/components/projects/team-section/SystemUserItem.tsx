
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { SystemUser } from '@/components/projects/team/types';
import Avatar from "@/components/ui/avatar";

interface SystemUserItemProps {
  user: SystemUser;
  isSelected: boolean;
  onSelectionChange: () => void;
}

const SystemUserItem: React.FC<SystemUserItemProps> = ({
  user,
  isSelected,
  onSelectionChange
}) => {
  return (
    <div 
      className="flex items-center px-4 py-3 border-b last:border-b-0 hover:bg-muted/50"
    >
      <Checkbox 
        checked={isSelected}
        onCheckedChange={onSelectionChange}
        className="mr-3"
      />
      <Avatar 
        src={user.avatar} 
        name={user.name} 
        size="sm" 
        className="mr-3"
      />
      <div className="flex-grow">
        <p className="font-medium text-sm">{user.name}</p>
        <p className="text-xs text-muted-foreground">{user.email}</p>
      </div>
      <div className="text-xs text-muted-foreground">{user.role}</div>
    </div>
  );
};

export default SystemUserItem;
