
import React from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SystemUser } from '../types';
import Avatar from "@/components/ui/avatar";
import UserSearchResults from '../UserSearchResults';

interface SearchUserTabProps {
  systemUsers: SystemUser[];
  selectedUser: SystemUser | null;
  selectedRole: string;
  onSelectUser: (user: SystemUser) => void;
  onSelectRole: (role: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

const SearchUserTab: React.FC<SearchUserTabProps> = ({
  systemUsers,
  selectedUser,
  selectedRole,
  onSelectUser,
  onSelectRole,
  onCancel,
  onSubmit
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  
  const filteredUsers = systemUsers.filter(user => {
    const query = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      (user.role && user.role.toLowerCase().includes(query))
    );
  });

  return (
    <>
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <UserSearchResults
          users={filteredUsers}
          selectedUserId={selectedUser?.id}
          onSelectUser={onSelectUser}
        />
      </div>
      
      {selectedUser && (
        <div className="space-y-2 mt-4">
          <div className="flex items-center space-x-2">
            <Avatar 
              src={selectedUser.avatar} 
              name={selectedUser.name} 
              size="sm" 
            />
            <span className="font-medium">{selectedUser.name}</span>
          </div>
          
          <div>
            <Label htmlFor="user-role">Role</Label>
            <Select value={selectedRole} onValueChange={onSelectRole}>
              <SelectTrigger id="user-role">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Project Manager">Project Manager</SelectItem>
                <SelectItem value="Developer">Developer</SelectItem>
                <SelectItem value="Designer">Designer</SelectItem>
                <SelectItem value="QA Engineer">QA Engineer</SelectItem>
                <SelectItem value="Product Owner">Product Owner</SelectItem>
                <SelectItem value="Team Member">Team Member</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      
      <DialogFooter className="mt-6">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          onClick={onSubmit} 
          disabled={!selectedUser || !selectedRole}
        >
          Add to Project
        </Button>
      </DialogFooter>
    </>
  );
};

export default SearchUserTab;
