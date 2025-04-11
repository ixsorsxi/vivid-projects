
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Trash2, Loader2, RefreshCw } from "lucide-react";
import { useParams } from 'react-router-dom';
import AddMemberDialog from './AddMemberDialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/toast-wrapper';
import { useProjectTeamAccess } from './useProjectTeamAccess';

const TeamSection = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  
  const {
    teamMembers,
    isLoading,
    hasAccess,
    error,
    refreshTeamMembers
  } = useProjectTeamAccess(projectId);

  // Effect to log when component mounts/updates
  useEffect(() => {
    console.log('TeamSection mounted/updated for project:', projectId);
    return () => console.log('TeamSection unmounted for project:', projectId);
  }, [projectId]);

  const handleAddMember = async (member: { name: string; role: string; user_id?: string }): Promise<boolean> => {
    if (!projectId) return false;
    if (!member.user_id) {
      toast.error('User ID is required');
      return false;
    }
    
    try {
      console.log('Adding team member:', member);
      
      // Use the RPC function to bypass RLS issues
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
      await refreshTeamMembers();
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
      console.log('Removing team member:', memberId);
      
      // Use the RPC function to bypass RLS issues
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
      await refreshTeamMembers();
    } catch (error: any) {
      console.error('Exception in handleRemoveMember:', error);
      toast.error('Failed to remove team member', {
        description: error.message || 'An unexpected error occurred'
      });
    }
  };

  const handleRetryFetch = async () => {
    setIsRetrying(true);
    try {
      await refreshTeamMembers();
    } finally {
      setIsRetrying(false);
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
          <div className="flex items-center space-x-2">
            <CardTitle>Project Team</CardTitle>
            {!isLoading && !isRetrying && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleRetryFetch}
                className="h-8 w-8 p-0"
                title="Refresh team members"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
          </div>
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
          {isLoading || isRetrying ? (
            <div className="text-center py-6 flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <p className="text-muted-foreground">Loading team members...</p>
            </div>
          ) : !hasAccess ? (
            <div className="text-center py-6 text-muted-foreground">
              <p>You don't have permission to view team members for this project.</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRetryFetch}
                className="mt-3"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Check Access Again
              </Button>
            </div>
          ) : error ? (
            <div className="text-center py-6 text-muted-foreground">
              <p>Error loading team members: {error.message}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRetryFetch}
                className="mt-3"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
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
                      <p className="text-sm text-muted-foreground capitalize">{member.role || 'Team Member'}</p>
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
