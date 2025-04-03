
import React, { useState } from 'react';
import { Trash2, UserCog } from 'lucide-react';
import { TeamMember } from './types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { TeamMemberAvatar, RoleBadge, TeamMemberInfo } from './ui';

interface TeamMemberCardProps {
  member: TeamMember;
  onRemove?: (id: string | number) => void;
  onMakeManager?: (id: string | number) => void;
  isRemoving?: boolean;
  isUpdating?: boolean;
  isProjectManager?: boolean;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  member,
  onRemove,
  onMakeManager,
  isRemoving = false,
  isUpdating = false,
  isProjectManager = false
}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmManagerOpen, setConfirmManagerOpen] = useState(false);
  
  const isCurrentlyProjectManager = 
    member.role === 'Project Manager' || 
    member.role === 'project-manager' || 
    member.role === 'project manager';

  return (
    <>
      <Card className="overflow-hidden">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <TeamMemberAvatar name={member.name} />
              
              <div className="space-y-1">
                <TeamMemberInfo 
                  name={member.name} 
                  role={member.role}
                  isManager={isCurrentlyProjectManager} 
                />
                <RoleBadge role={member.role} />
              </div>
            </div>
            
            <div className="flex space-x-2">
              {!isCurrentlyProjectManager && onMakeManager && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setConfirmManagerOpen(true)}
                  disabled={isUpdating}
                >
                  <UserCog className="h-4 w-4" />
                </Button>
              )}
              
              {onRemove && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setConfirmOpen(true)}
                  disabled={isRemoving}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Remove Member Confirmation Dialog */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {member.name} from the project team?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => onRemove && onRemove(member.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Make Project Manager Confirmation Dialog */}
      <AlertDialog open={confirmManagerOpen} onOpenChange={setConfirmManagerOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Assign Project Manager</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to assign {member.name} as the Project Manager?
              {isProjectManager && " This will replace the current Project Manager."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (onMakeManager) {
                  onMakeManager(member.id);
                  setConfirmManagerOpen(false);
                }
              }}
            >
              Assign as Project Manager
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TeamMemberCard;
