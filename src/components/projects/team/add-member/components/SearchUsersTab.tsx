
import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { projectRoles } from '../../constants';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, User } from 'lucide-react';
import { SystemUser } from '../../types';
import { debugLog, debugError } from '@/utils/debugLogger';

interface SearchUsersTabProps {
  onSelectUser: (user: SystemUser | null) => void;
  onSelectRole: (role: string) => void;
  selectedUser: SystemUser | null;
  selectedRole: string;
  isSubmitting?: boolean;
}

const SearchUsersTab: React.FC<SearchUsersTabProps> = ({
  onSelectUser,
  onSelectRole,
  selectedUser,
  selectedRole,
  isSubmitting = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Fetch users from Supabase
  useEffect(() => {
    const fetchUsers = async () => {
      if (searchQuery.length < 2) {
        setUsers([]);
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url, email')
          .or(`username.ilike.%${searchQuery}%, full_name.ilike.%${searchQuery}%`)
          .limit(10);

        if (error) {
          debugError('SearchUsersTab', 'Error fetching users:', error);
          return;
        }

        // Map to SystemUser format
        const mappedUsers: SystemUser[] = data.map((user: any) => ({
          id: user.id,
          name: user.full_name || user.username || 'Unknown User',
          email: user.email,
          avatar: user.avatar_url,
        }));

        debugLog('SearchUsersTab', `Found ${mappedUsers.length} users for query "${searchQuery}"`);
        setUsers(mappedUsers);
      } catch (error) {
        debugError('SearchUsersTab', 'Exception in fetchUsers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleUserSelect = (user: SystemUser) => {
    // Explicitly log the selected user to verify data
    debugLog('SearchUsersTab', 'Selected user:', user);
    onSelectUser(user);
    setShowResults(false);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="user-search">Find Team Member</Label>
        <div className="relative">
          <Input
            id="user-search"
            placeholder="Search by name or username..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (e.target.value.length >= 2) {
                setShowResults(true);
              } else {
                setShowResults(false);
              }
            }}
            onFocus={() => {
              if (searchQuery.length >= 2) {
                setShowResults(true);
              }
            }}
            className="pl-9"
            disabled={isSubmitting}
          />
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        </div>
        
        {/* User search results */}
        {showResults && searchQuery.length >= 2 && (
          <div className="mt-1 border rounded-md shadow-sm z-10 bg-white dark:bg-gray-800">
            {isLoading ? (
              <div className="p-3 flex justify-center">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : users.length > 0 ? (
              <ul className="max-h-56 overflow-y-auto">
                {users.map((user) => (
                  <li 
                    key={user.id}
                    onClick={() => handleUserSelect(user)}
                    className="p-2 hover:bg-accent cursor-pointer flex items-center"
                  >
                    <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-2 text-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="p-3 text-center text-sm text-muted-foreground">
                No users found. Try a different search term.
              </p>
            )}
          </div>
        )}

        {selectedUser && (
          <div className="mt-2 p-2 border rounded-md flex items-center">
            <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-2 text-xs">
              {selectedUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium">{selectedUser.name}</p>
              {selectedUser.email && <p className="text-xs text-muted-foreground">{selectedUser.email}</p>}
            </div>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="role">Project Role</Label>
        <Select 
          value={selectedRole} 
          onValueChange={onSelectRole} 
          disabled={isSubmitting}
        >
          <SelectTrigger id="role">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            {projectRoles.map((role) => (
              <SelectItem key={role.value} value={role.value}>
                {role.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          The role determines what actions this person can perform in the project.
        </p>
      </div>
    </div>
  );
};

export default SearchUsersTab;
