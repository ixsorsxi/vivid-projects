
import React from 'react';
import { UserData } from '../hooks/useUserManagement';
import { 
  Table,
  TableBody,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import SortableColumnHeader from './table/SortableColumnHeader';
import UserTableRow from './table/UserTableRow';
import EmptyState from './table/EmptyState';
import LoadingState from './table/LoadingState';
import { useSortableTable } from './hooks/useSortableTable';
import { SortKey } from './types/userTableTypes';

interface UserTableProps {
  users: UserData[];
  isLoading: boolean;
  filteredUsers: UserData[];
  onDelete: (userId: string) => void;
  onToggleStatus: (userId: string) => void;
  onEdit: (user: UserData) => void;
  isAdmin: boolean;
}

const UserTable: React.FC<UserTableProps> = ({ 
  filteredUsers, 
  isLoading, 
  onDelete, 
  onToggleStatus,
  onEdit,
  isAdmin 
}) => {
  const { sortConfig, requestSort, sortedUsers } = useSortableTable(filteredUsers);

  return (
    <div className="overflow-hidden rounded-md border border-border shadow-sm">
      {isLoading ? (
        <LoadingState />
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <SortableColumnHeader 
                  label="Name"
                  sortKey="name"
                  currentSort={sortConfig}
                  onSort={requestSort}
                />
                <SortableColumnHeader 
                  label="Email"
                  sortKey="email"
                  currentSort={sortConfig}
                  onSort={requestSort}
                />
                <SortableColumnHeader 
                  label="Role"
                  sortKey="role"
                  currentSort={sortConfig}
                  onSort={requestSort}
                />
                <SortableColumnHeader 
                  label="Status"
                  sortKey="status"
                  currentSort={sortConfig}
                  onSort={requestSort}
                />
                <SortableColumnHeader 
                  label="Last Login"
                  sortKey="lastLogin"
                  currentSort={sortConfig}
                  onSort={requestSort}
                />
                <SortableColumnHeader 
                  label="Actions"
                  sortKey={'name' as SortKey} // This won't actually sort
                  currentSort={null} // Never show sort indicator
                  onSort={() => {}} // No-op
                />
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedUsers.length > 0 ? (
                sortedUsers.map(user => (
                  <UserTableRow
                    key={user.id}
                    user={user}
                    onDelete={onDelete}
                    onToggleStatus={onToggleStatus}
                    onEdit={onEdit}
                    isAdmin={isAdmin}
                  />
                ))
              ) : (
                <EmptyState />
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default UserTable;
