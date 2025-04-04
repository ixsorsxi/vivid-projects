import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export interface SearchUserTabProps {
  projectId?: string;
  onAddMember: (member: { 
    id?: string; 
    name: string; 
    role: string; 
    email?: string; 
    user_id?: string 
  }) => Promise<boolean>;
  isSubmitting?: boolean;
}

const SearchUserTab: React.FC<SearchUserTabProps> = ({ 
  projectId, 
  onAddMember, 
  isSubmitting = false 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('Team Member');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string>('');

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    // In a real application, you would perform a search against your user database here
    // and update the availableUsers state with the results.
    // For this example, we'll just simulate a delay.
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  const handleSelectUser = (userId: string, userName: string) => {
    setSelectedUserId(userId);
    setSelectedUserName(userName);
  };

  const handleAddMemberClick = async () => {
    if (!selectedUserId) {
      alert('Please select a user to add.');
      return;
    }

    const member = {
      user_id: selectedUserId,
      name: selectedUserName,
      role: selectedRole,
    };

    try {
      await onAddMember(member);
      // Reset state after successful add
      setSearchQuery('');
      setSelectedUserId(null);
      setSelectedUserName('');
      setSelectedRole('Team Member');
    } catch (error) {
      // Handle error - the onAddMember function should handle displaying the error message
    }
  };

  // Mock user data for demonstration purposes
  const availableUsers = [
    { id: '1', name: 'John Doe', email: 'john.doe@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com' },
    { id: '3', name: 'Alice Johnson', email: 'alice.johnson@example.com' },
  ].filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-4">
      <div>
        <Input
          type="search"
          placeholder="Search for a user..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {searchQuery && availableUsers.length === 0 && (
        <p className="text-sm text-muted-foreground">No users found.</p>
      )}

      {availableUsers.length > 0 && (
        <ul className="space-y-2">
          {availableUsers.map(user => (
            <li
              key={user.id}
              className={`p-2 rounded-md cursor-pointer hover:bg-secondary ${selectedUserId === user.id ? 'bg-secondary' : ''}`}
              onClick={() => handleSelectUser(user.id, user.name)}
            >
              {user.name} ({user.email})
            </li>
          ))}
        </ul>
      )}

      <div>
        <Select value={selectedRole} onValueChange={setSelectedRole}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Team Member">Team Member</SelectItem>
            <SelectItem value="Project Manager">Project Manager</SelectItem>
            <SelectItem value="Stakeholder">Stakeholder</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={handleAddMemberClick} disabled={!selectedUserId || isSubmitting}>
        {isSubmitting ? (
          <>
            Adding...
            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
          </>
        ) : (
          'Add to Project'
        )}
      </Button>
    </div>
  );
};

export default SearchUserTab;
