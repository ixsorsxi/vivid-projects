
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SearchUserTab from './SearchUserTab';
import InviteByEmailTab from './InviteByEmailTab';
import { debugLog, debugError } from '@/utils/debugLogger';

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId?: string;
  onAddMember?: (member: { 
    id?: string; 
    name: string; 
    role: string; 
    email?: string; 
    user_id?: string 
  }) => Promise<boolean>;
  isSubmitting?: boolean;
}

const AddMemberDialog: React.FC<AddMemberDialogProps> = ({
  open,
  onOpenChange,
  projectId,
  onAddMember,
  isSubmitting = false
}) => {
  const [activeTab, setActiveTab] = useState<'existing' | 'email'>('existing');

  debugLog('AddMemberDialog', 'Rendering with projectId:', projectId);

  const handleAddMember = async (member: { 
    name: string; 
    role: string; 
    email?: string; 
    user_id?: string 
  }): Promise<boolean> => {
    if (!onAddMember) {
      debugError('AddMemberDialog', 'No onAddMember handler provided');
      return false;
    }
    
    try {
      debugLog('AddMemberDialog', 'Adding member:', member);
      const result = await onAddMember(member);
      
      if (result) {
        // Close dialog on success
        onOpenChange(false);
      }
      
      return result;
    } catch (error) {
      debugError('AddMemberDialog', 'Error in handleAddMember:', error);
      return false;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
        </DialogHeader>
        
        <Tabs 
          defaultValue="existing" 
          value={activeTab} 
          onValueChange={(value) => setActiveTab(value as 'existing' | 'email')}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="existing">Existing Users</TabsTrigger>
            <TabsTrigger value="email">Invite by Email</TabsTrigger>
          </TabsList>
          
          <TabsContent value="existing">
            <SearchUserTab 
              projectId={projectId}
              onAddMember={handleAddMember}
              isSubmitting={isSubmitting}
            />
          </TabsContent>
          
          <TabsContent value="email">
            <InviteByEmailTab 
              projectId={projectId}
              onAddMember={handleAddMember}
              isSubmitting={isSubmitting}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberDialog;
