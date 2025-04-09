
import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { debugLog } from '@/utils/debugLogger';
import { useDialogForm } from './hooks/useDialogForm';
import DialogHeader from './components/DialogHeader';
import DialogFooter from './components/DialogFooter';
import MemberDialogContent from './components/DialogContent';

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  onAddMember: (member: { 
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
  const {
    activeTab,
    setActiveTab,
    name,
    setName,
    email,
    setEmail,
    role,
    setRole,
    error,
    setError,
    isFormValid,
    systemUsers,
    isLoadingUsers,
    selectedUser,
    setSelectedUser,
    resetForm
  } = useDialogForm(open);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      let memberData;
      
      if (activeTab === 'user') {
        if (!selectedUser) {
          setError('Please select a user');
          return;
        }
        
        memberData = {
          name: selectedUser.name,
          role,
          email: selectedUser.email,
          user_id: selectedUser.id
        };
      } else {
        if (!name.trim()) {
          setError('Name is required');
          return;
        }
        
        memberData = {
          name,
          role,
          email: email || undefined
        };
      }
      
      debugLog('AddMemberDialog', 'Submitting member data:', memberData);
      
      const success = await onAddMember(memberData);
      
      if (success) {
        onOpenChange(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error adding team member:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]" asChild>
        <form onSubmit={handleSubmit}>
          <DialogHeader />
          
          <MemberDialogContent
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            role={role}
            setRole={setRole}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            systemUsers={systemUsers}
            isLoadingUsers={isLoadingUsers}
            error={error}
            isSubmitting={isSubmitting}
          />
          
          <DialogFooter
            onClose={() => onOpenChange(false)}
            isFormValid={isFormValid}
            isSubmitting={isSubmitting}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberDialog;
