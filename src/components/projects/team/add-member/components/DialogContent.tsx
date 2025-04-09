
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserSelector from '../../user-select/UserSelector';
import RoleSelector from '../../role-select/RoleSelector';
import { Label } from '@/components/ui/label';
import { Input } from "@/components/ui/input";
import { SystemUser } from '../../types';

interface DialogContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  role: string;
  setRole: (role: string) => void;
  selectedUser: SystemUser | null;
  setSelectedUser: (user: SystemUser | null) => void;
  systemUsers: SystemUser[];
  isLoadingUsers: boolean;
  error: string | null;
  isSubmitting: boolean;
}

const DialogContent: React.FC<DialogContentProps> = ({
  activeTab,
  setActiveTab,
  name,
  setName,
  email,
  setEmail,
  role,
  setRole,
  selectedUser,
  setSelectedUser,
  systemUsers,
  isLoadingUsers,
  error,
  isSubmitting
}) => {
  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="user">Add Existing User</TabsTrigger>
          <TabsTrigger value="external">Add External Member</TabsTrigger>
        </TabsList>
        
        <TabsContent value="user" className="space-y-4">
          <UserSelector
            users={systemUsers}
            selectedUser={selectedUser}
            onSelectUser={setSelectedUser}
            isLoading={isLoadingUsers}
            disabled={isSubmitting}
          />
          
          <RoleSelector
            selectedRole={role}
            onRoleChange={setRole}
            disabled={isSubmitting}
            className="mt-4"
          />
        </TabsContent>
        
        <TabsContent value="external" className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="mb-2 block">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Enter team member name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="email" className="mb-2 block">
                Email (optional)
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground mt-1">
                This will be used for invitations but won't create a user account
              </p>
            </div>
            
            <RoleSelector
              selectedRole={role}
              onRoleChange={setRole}
              disabled={isSubmitting}
            />
          </div>
        </TabsContent>
      </Tabs>
      
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default DialogContent;
