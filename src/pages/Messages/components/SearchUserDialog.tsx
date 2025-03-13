
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import Avatar from '@/components/ui/avatar';
import { X } from 'lucide-react';
import { SystemUser } from '../types';

interface SearchUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filteredUsers: SystemUser[];
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onAddUser: (user: SystemUser) => void;
}

const SearchUserDialog = ({
  open,
  onOpenChange,
  filteredUsers,
  searchQuery,
  onSearchQueryChange,
  onAddUser
}: SearchUserDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Find Someone to Chat With</DialogTitle>
          <DialogDescription>
            Search for team members or clients to start a conversation.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 py-4">
          <Command className="rounded-lg border shadow-md">
            <CommandInput 
              placeholder="Search users..." 
              value={searchQuery}
              onValueChange={onSearchQueryChange}
            />
            <CommandList>
              <CommandEmpty>No users found.</CommandEmpty>
              <CommandGroup heading="Users">
                {filteredUsers.map(user => (
                  <CommandItem
                    key={user.id}
                    value={user.name}
                    onSelect={() => onAddUser(user)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar 
                        name={user.name} 
                        size="sm" 
                        status={user.online ? 'online' : 'offline'} 
                      />
                      <div className="flex flex-col">
                        <span>{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.role}</span>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
        <DialogFooter className="sm:justify-start">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SearchUserDialog;
