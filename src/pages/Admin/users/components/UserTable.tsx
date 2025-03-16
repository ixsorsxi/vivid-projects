
import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
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

type SortKey = 'name' | 'email' | 'role' | 'status' | 'lastLogin';

const UserTable: React.FC<UserTableProps> = ({ 
  filteredUsers, 
  isLoading, 
  onDelete, 
  onToggleStatus, 
  isAdmin 
}) => {
  const [sortConfig, setSortConfig] = React.useState<{
    key: SortKey;
    direction: 'asc' | 'desc';
  } | null>(null);

  const requestSort = (key: SortKey) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
  };

  const sortedUsers = React.useMemo(() => {
    const sortableUsers = [...filteredUsers];
    
    if (sortConfig !== null) {
      sortableUsers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return sortableUsers;
  }, [filteredUsers, sortConfig]);

  // Helper to render sort indicator
  const renderSortIndicator = (key: SortKey) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    
    return (
      <span className="ml-1 text-primary">
        {sortConfig.direction === 'asc' ? 
          <ArrowUp className="inline h-3 w-3" /> : 
          <ArrowDown className="inline h-3 w-3" />
        }
      </span>
    );
  };

  return (
    <div className="overflow-hidden rounded-md border border-border shadow-sm">
      {isLoading ? (
        <div className="flex justify-center items-center py-16 text-muted-foreground">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-8 bg-muted-foreground/30 rounded-full mb-2"></div>
            <p>Loading users...</p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50 transition-colors" 
                  onClick={() => requestSort('name')}
                >
                  Name {renderSortIndicator('name')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50 transition-colors" 
                  onClick={() => requestSort('email')}
                >
                  Email {renderSortIndicator('email')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50 transition-colors" 
                  onClick={() => requestSort('role')}
                >
                  Role {renderSortIndicator('role')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50 transition-colors" 
                  onClick={() => requestSort('status')}
                >
                  Status {renderSortIndicator('status')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50 transition-colors" 
                  onClick={() => requestSort('lastLogin')}
                >
                  Last Login {renderSortIndicator('lastLogin')}
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedUsers.length > 0 ? (
                sortedUsers.map(user => (
                  <TableRow key={user.id} className="hover:bg-muted/20 transition-colors">
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      }`}>
                        {user.role}
                      </span>
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
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => onDelete(user.id)}
                          className="hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-colors"
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
                  <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                    <div className="flex flex-col items-center space-y-2">
                      <p className="font-medium">No users found</p>
                      <p className="text-sm">Try changing your search or filter settings</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default UserTable;
