
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Check, Search, User, UserPlus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SystemUser } from '../types';
import { supabase } from "@/integrations/supabase/client";

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
  systemUsers: initialUsers,
  selectedUser,
  selectedRole,
  onSelectUser,
  onSelectRole,
  onCancel,
  onSubmit
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [users, setUsers] = useState<SystemUser[]>(initialUsers);
  
  // Fetch users from Supabase profiles
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, username, avatar_url, role');
        
        if (error) {
          console.error('Error fetching users:', error);
          return;
        }
        
        if (data) {
          // Transform to SystemUser type
          const transformedUsers: SystemUser[] = data.map(user => ({
            id: user.id,
            name: user.full_name || user.username || 'Unnamed User',
            email: user.username || '',
            role: user.role || 'User',
            avatar: user.avatar_url || '/placeholder.svg'
          }));
          
          setUsers(transformedUsers);
        }
      } catch (err) {
        console.error('Error in fetchUsers:', err);
      }
    };
    
    fetchUsers();
  }, []);
  
  // Filter users based on search query
  const filteredUsers = searchQuery.trim() === '' 
    ? users 
    : users.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
      );
  
  return (
    <>
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name or email..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="border rounded-md">
          {filteredUsers.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <UserPlus className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No users found</p>
            </div>
          ) : (
            <div className="max-h-48 overflow-y-auto">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className={`flex items-center space-x-3 px-4 py-2 cursor-pointer hover:bg-accent ${
                    selectedUser?.id === user.id ? 'bg-accent' : ''
                  }`}
                  onClick={() => onSelectUser(user)}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{user.name}</h4>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  {selectedUser?.id === user.id && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {selectedUser && (
          <div>
            <Label htmlFor="role">Assign Role</Label>
            <Select value={selectedRole} onValueChange={onSelectRole}>
              <SelectTrigger id="role">
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
        )}
      </div>
      
      <DialogFooter className="mt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={!selectedUser}>
          Add Member
        </Button>
      </DialogFooter>
    </>
  );
};

export default SearchUserTab;
