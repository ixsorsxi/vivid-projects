
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { UserData } from '../../hooks/useUserTypes';

interface UserTableRowProps {
  user: UserData;
  onEditUser: (user: UserData) => void;
  onDeleteUser?: (userId: string) => void;
}

const UserTableRow: React.FC<UserTableRowProps> = ({ 
  user, 
  onEditUser, 
  onDeleteUser 
}) => {
  const lastLoginText = user.lastLogin 
    ? formatDistanceToNow(new Date(user.lastLogin), { addSuffix: true }) 
    : 'Never';
    
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500';
      case 'manager': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{user.name}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        <Badge className={`${getRoleBadgeColor(user.role)} text-white`}>
          {user.role === 'admin' ? 'Administrator' : 
           user.role === 'manager' ? 'Manager' : 
           'User'}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant={user.status === 'active' ? 'outline' : 'destructive'} className="font-normal">
          {user.status === 'active' ? 'Active' : 'Inactive'}
        </Badge>
      </TableCell>
      <TableCell className="text-muted-foreground text-sm">{lastLoginText}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onEditUser(user)}
          >
            <Edit2 className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          
          {onDeleteUser && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-destructive hover:text-destructive/90"
              onClick={() => onDeleteUser(user.id)}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

export default UserTableRow;
