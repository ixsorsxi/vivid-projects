
import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit, Trash2 } from 'lucide-react';
import { UserData } from '../hooks/useUserManagement';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

interface UserTableProps {
  users: UserData[];
  isLoading: boolean;
  filteredUsers: UserData[];
  onDelete: (userId: string) => void;
  onToggleStatus: (userId: string) => void;
  isAdmin: boolean;
}

const UserTable: React.FC<UserTableProps> = ({ 
  filteredUsers, 
  isLoading, 
  onDelete, 
  onToggleStatus, 
  isAdmin 
}) => {
  return (
    <div className="overflow-x-auto">
      {isLoading ? (
        <div className="py-8 text-center text-muted-foreground">
          Loading users...
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
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
                        className="flex h-8 w-8 p-0 data-[state=checked]:bg-primary"
                        disabled={!isAdmin}
                      >
                        <span className="sr-only">
                          {user.status === 'active' ? 'Deactivate' : 'Activate'}
                        </span>
                        <Checkbox checked={user.status === 'active'} />
                      </Button>
                      <Button variant="ghost" size="icon" disabled={!isAdmin}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onDelete(user.id)}
                        disabled={!isAdmin}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="py-6 text-center text-muted-foreground">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default UserTable;
