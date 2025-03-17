
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit, Trash2 } from 'lucide-react';
import { UserData } from '../../hooks/useUserManagement';
import { Badge } from '@/components/ui/badge';

interface UserTableRowProps {
  user: UserData;
  onDelete: (userId: string) => void;
  onToggleStatus: (userId: string) => void;
  onEdit: (user: UserData) => void;
  isAdmin: boolean;
}

const UserTableRow: React.FC<UserTableRowProps> = ({
  user,
  onDelete,
  onToggleStatus,
  onEdit,
  isAdmin,
}) => {
  return (
    <TableRow key={user.id} className="hover:bg-muted/20 transition-colors">
      <TableCell className="font-medium">{user.name}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        <div className="flex flex-col gap-1">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            user.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' : 
            user.role === 'manager' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 
            'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
          }`}>
            {user.role}
          </span>
          
          {user.customRoleName && user.customRoleName !== 'Admin' && 
           user.customRoleName !== 'Manager' && user.customRoleName !== 'User' && (
            <Badge variant="outline" className="text-xs">
              {user.customRoleName}
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          user.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
        }`}>
          {user.status}
        </span>
      </TableCell>
      <TableCell>{user.lastLogin}</TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onToggleStatus(user.id)}
            className="flex h-8 w-8 p-0 data-[state=checked]:bg-primary hover:bg-muted transition-colors"
            disabled={!isAdmin}
          >
            <span className="sr-only">
              {user.status === 'active' ? 'Deactivate' : 'Activate'}
            </span>
            <Checkbox checked={user.status === 'active'} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="hover:bg-muted transition-colors"
            disabled={!isAdmin}
            onClick={() => onEdit(user)}
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onDelete(user.id)}
            className="hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-colors"
            disabled={!isAdmin}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default UserTableRow;
