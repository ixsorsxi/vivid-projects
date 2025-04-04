
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { SystemUser } from '@/components/projects/team/types';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface SystemUserItemProps {
  user: SystemUser;
  isSelected: boolean;
  onSelect: () => void;
}

const SystemUserItem: React.FC<SystemUserItemProps> = ({
  user,
  isSelected,
  onSelect
}) => {
  // Get appropriate badge variant based on user's system role
  const getBadgeVariant = () => {
    if (!user.role) return "outline";
    
    switch (user.role.toLowerCase()) {
      case 'admin':
        return "destructive";
      case 'manager':
        return "default";
      case 'developer':
        return "outline";
      case 'designer':
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div 
      className="flex items-center px-4 py-3 border-b last:border-b-0 hover:bg-muted/50"
    >
      <Checkbox 
        checked={isSelected}
        onCheckedChange={onSelect}
        className="mr-3"
      />
      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
        {user.name?.charAt(0).toUpperCase() || 'U'}
      </div>
      <div className="flex-grow">
        <p className="font-medium text-sm">{user.name}</p>
        <p className="text-xs text-muted-foreground">{user.email}</p>
      </div>
      {user.role && (
        <Badge variant={getBadgeVariant()} className="text-[10px] font-normal">
          {user.role}
        </Badge>
      )}
    </div>
  );
};

export default SystemUserItem;
