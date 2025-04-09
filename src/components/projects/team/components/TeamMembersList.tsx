
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  MoreHorizontal, 
  Trash2, 
  Crown,
  Shield,
  AlertCircle, 
  CheckCircle2,
  Loader2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TeamMember } from '../types';
import { Avatar } from '@/components/ui/avatar.custom';
import { Badge } from '@/components/ui/badge';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TeamMembersListProps {
  members: TeamMember[];
  isRemoving?: boolean;
  isUpdating?: boolean;
  onRemove?: (id: string) => Promise<boolean>;
  onMakeManager?: (id: string) => Promise<boolean>;
}

const TeamMembersList: React.FC<TeamMembersListProps> = ({ 
  members,
  isRemoving = false,
  isUpdating = false,
  onRemove,
  onMakeManager
}) => {
  const [memberId, setMemberId] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [operationType, setOperationType] = useState<'remove' | 'manager'>('remove');
  
  // Get member being operated on
  const activeMember = memberId 
    ? members.find(m => m.id === memberId) 
    : null;
  
  // Check if member is a project manager
  const isManager = (member: TeamMember) => 
    member.role === 'Project Manager' || 
    member.role === 'project_manager';
  
  // Open confirm dialog for an operation
  const openConfirmDialog = (id: string, type: 'remove' | 'manager') => {
    setMemberId(id);
    setOperationType(type);
    setConfirmDialogOpen(true);
  };
  
  // Handle confirm dialog action
  const handleConfirmAction = async () => {
    if (!memberId) return;
    
    try {
      if (operationType === 'remove' && onRemove) {
        await onRemove(memberId);
      } else if (operationType === 'manager' && onMakeManager) {
        await onMakeManager(memberId);
      }
    } catch (error) {
      console.error(`Error performing ${operationType} operation:`, error);
    } finally {
      setConfirmDialogOpen(false);
      setMemberId(null);
    }
  };
  
  return (
    <>
      <div className="space-y-3">
        {members.map((member) => (
          <Card 
            key={member.id} 
            className="p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Avatar 
                name={member.name} 
                size="md" 
              />
              
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{member.name}</p>
                  
                  {isManager(member) && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>
                            <Crown className="h-4 w-4 text-yellow-500" />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Project Manager</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  
                  {member.role === 'admin' && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>
                            <Shield className="h-4 w-4 text-primary" />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Administrator</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {member.role}
                  </Badge>
                  
                  {member.user_id && (
                    <span className="text-xs text-muted-foreground">
                      System user
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {onRemove && onMakeManager && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {!isManager(member) && (
                    <DropdownMenuItem 
                      onClick={() => openConfirmDialog(member.id, 'manager')}
                      disabled={isUpdating}
                    >
                      <Crown className="mr-2 h-4 w-4 text-yellow-500" />
                      Make Project Manager
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuItem 
                    onClick={() => openConfirmDialog(member.id, 'remove')}
                    disabled={isRemoving}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove Member
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </Card>
        ))}
      </div>
      
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {operationType === 'remove' 
                ? 'Remove Team Member' 
                : 'Assign Project Manager'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {operationType === 'remove' 
                ? `Are you sure you want to remove ${activeMember?.name} from the project team?` 
                : `Are you sure you want to make ${activeMember?.name} the project manager? This will replace the current project manager if one exists.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAction}>
              {operationType === 'remove' 
                ? (isRemoving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Removing...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove
                    </>
                  ))
                : (isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Assigning...
                    </>
                  ) : (
                    <>
                      <Crown className="mr-2 h-4 w-4" />
                      Assign
                    </>
                  ))
              }
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TeamMembersList;
