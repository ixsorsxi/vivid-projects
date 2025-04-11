
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Trash2, Loader2 } from "lucide-react";
import { useParams } from 'react-router-dom';
import AddMemberDialog from './AddMemberDialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/toast-wrapper';
import { useProjectTeamAccess } from './useProjectTeamAccess';

const TeamSection = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const {
    teamMembers,
    isLoading,
    hasAccess,
    error,
    refreshTeamMembers
  } = useProjectTeamAccess(projectId);

  const handleAddMember = async (member: { name: string; role: string; user_id?: string }): Promise<boolean> => {
    if (!projectId) return false;
    if (!member.user_id) {
      toast.error('User ID is required');
      return false;
    }
    
    try {
      // Use the security definer RPC function to add a member
      const { data, error } = await supabase.rpc(
        'add_project_member',
        { 
          p_project_id: projectId,
          p_user_id: member.user_id,
          p_name: member.name,
          p_role: member.role
        }
      );
      
      if (error) {
        console.error('Error adding team member:', error);
        
        if (error.message.includes('already a member')) {
          toast.error('User already a member', {
            description: 'This user is already a member of the project.'
          });
        } else {
          toast.error('Failed to add team member', {
            description: error.message
          });
        }
        return false;
      }
      
      toast.success('Team member added successfully');
      refreshTeamMembers();
      return true;
    } catch (error: any) {
      console.error('Exception in handleAddMember:', error);
      toast.error('Failed to add team member', {
        description: error.message || 'An unexpected error occurred'
      });
      return false;
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!projectId) return;
    
    try {
      // Use the security definer RPC function to remove a member
      const { data, error } = await supabase.rpc(
        'remove_project_member',
        { 
          p_project_id: projectId,
          p_member_id: memberId
        }
      );
      
      if (error) {
        console.error('Error removing team member:', error);
        toast.error('Failed to remove team member', {
          description: error.message
        });
        return;
      }
      
      toast.success('Team member removed');
      refreshTeamMembers();
    } catch (error: any) {
      console.error('Exception in handleRemoveMember:', error);
      toast.error('Failed to remove team member', {
        description: error.message || 'An unexpected error occurred'
      });
    }
  };

  if (!projectId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Project Team</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Please select a project to view its team.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Project Team</CardTitle>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            size="sm"
            className="flex items-center gap-1"
            disabled={!hasAccess || isLoading}
          >
            <UserPlus className="h-4 w-4" />
            Add Member
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-6 flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <p className="text-muted-foreground">Loading team members...</p>
            </div>
          ) : !hasAccess ? (
            <div className="text-center py-6 text-muted-foreground">
              <p>You don't have permission to view team members for this project.</p>
            </div>
          ) : error ? (
            <div className="text-center py-6 text-muted-foreground">
              <p>Error loading team members.</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshTeamMembers}
                className="mt-3"
              >
                <Loader2 className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          ) : teamMembers.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <p>No team members yet. Add team members to collaborate on this project.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {teamMembers.map(member => (
                <div 
                  key={member.id} 
                  className="flex items-center justify-between p-3 rounded-md border"
                >
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                      {member.name?.charAt(0) || 'T'}
                    </div>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.user_id || 'No user assigned'}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveMember(member.id)}
                    disabled={!hasAccess}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AddMemberDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        projectId={projectId}
        onAddMember={handleAddMember}
      />
    </div>
  );
};

export default TeamSection;
