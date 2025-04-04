
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SearchUserTab from './SearchUserTab';
import InviteByEmailTab from './InviteByEmailTab';
import { AlertCircle } from 'lucide-react';
import { debugLog } from '@/utils/debugLogger';

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  onAddMember: (member: { name: string; role: string; email?: string; user_id?: string }) => Promise<boolean>;
  isSubmitting: boolean;
}

const AddMemberDialog: React.FC<AddMemberDialogProps> = ({
  open,
  onOpenChange,
  projectId,
  onAddMember,
  isSubmitting
}) => {
  const [activeTab, setActiveTab] = useState<'search' | 'invite'>('search');
  const [error, setError] = useState<string | null>(null);
  
  const handleAddMember = async (member: { name: string; role: string; email?: string; user_id?: string }) => {
    setError(null);
    debugLog('DIALOG', 'Adding team member in dialog:', member);
    
    try {
      const success = await onAddMember(member);
      
      if (success) {
        onOpenChange(false); // Close the dialog on success
      }
      
      return success;
    } catch (error) {
      console.error('Error in AddMemberDialog:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      return false;
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Project Team Member</DialogTitle>
          <DialogDescription>
            Add a new member to your project team.
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <div className="bg-destructive/15 text-destructive p-3 rounded-md flex items-start gap-2">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <span>Failed to add team member. {error}</span>
          </div>
        )}
        
        <Tabs defaultValue="search" value={activeTab} onValueChange={(value) => setActiveTab(value as 'search' | 'invite')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="search">Search Users</TabsTrigger>
            <TabsTrigger value="invite">Invite by Email</TabsTrigger>
          </TabsList>
          
          <TabsContent value="search">
            <SearchUserTab 
              projectId={projectId}
              onAddMember={handleAddMember}
              isSubmitting={isSubmitting}
            />
          </TabsContent>
          
          <TabsContent value="invite">
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
