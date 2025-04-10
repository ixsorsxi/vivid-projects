
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Trash2 } from "lucide-react";
import { useParams } from 'react-router-dom';
import AddMemberDialog from './AddMemberDialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/toast-wrapper';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { checkProjectMemberAccess } from '@/api/projects/modules/team/fixRlsPolicy';
import { useProjectAccessChecker } from '@/hooks/useProjectAccessChecker';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  user_id?: string;
}

const TeamSection = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const { hasAccess, isProjectOwner, isAdmin, isChecking } = useProjectAccessChecker(projectId);

  // Fetch team members whenever access status changes
  useEffect(() => {
    if (projectId && hasAccess && !isChecking) {
      fetchTeamMembers();
    }
  }, [projectId, hasAccess, isChecking]);

  // Fetch team members using the most reliable approach
  const fetchTeamMembers = async () => {
    if (!projectId) return;
    
    setIsLoading(true);
    setErrorDetails(null);
    
    try {
      console.log('Fetching team members for project:', projectId);
      
      // Get the current user's ID for debugging
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current user ID:', user?.id);
      
      // Try a direct query with project_id parameter
      const { data: members, error: membersError } = await supabase
        .from('project_members')
        .select('id, project_member_name, role, user_id')
        .eq('project_id', projectId)
        .is('left_at', null); // Only get active members
      
      if (membersError) {
        console.error('Error fetching team members:', membersError);
        setErrorDetails(membersError.message);
        
        // If we got an RLS error, try to use a different approach
        if (membersError.code === '42501' || membersError.message.includes('permission denied')) {
          console.log('Attempting to fetch with RPC...');
          
          // Try using an RPC function that has SECURITY DEFINER to bypass RLS
          const { data: rpcData, error: rpcError } = await supabase.rpc(
            'get_project_team_with_permissions',
            { p_project_id: projectId }
          );
          
          if (rpcError) {
            console.error('RPC fallback failed:', rpcError);
            toast.error('Access denied', { 
              description: 'You do not have permission to view team members for this project.'
            });
            setTeamMembers([]);
          } else if (rpcData) {
            console.log('Successfully fetched team members via RPC:', rpcData);
            
            const formattedMembers: TeamMember[] = rpcData.map((member: any) => ({
              id: member.id,
              name: member.name || 'Unnamed Member',
              role: member.role || 'Team Member',
              user_id: member.user_id
            }));
            
            setTeamMembers(formattedMembers);
          }
        } else {
          toast.error('Failed to load team members', {
            description: membersError.message
          });
          setTeamMembers([]);
        }
      } else if (!members) {
        setTeamMembers([]);
        console.log('No team members returned from query');
      } else {
        console.log('Team members loaded successfully:', members);
        
        const formattedMembers: TeamMember[] = members.map(member => ({
          id: member.id,
          name: member.project_member_name || 'Unnamed Member',
          role: member.role || 'Team Member',
          user_id: member.user_id
        }));
        
        setTeamMembers(formattedMembers);
      }
    } catch (error: any) {
      console.error('Exception in fetchTeamMembers:', error);
      setErrorDetails(error.message || 'Unknown error occurred');
      toast.error('Failed to load team members');
      setTeamMembers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMember = async (member: { name: string; role: string; user_id?: string }): Promise<boolean> => {
    if (!projectId) return false;
    if (!member.user_id) {
      toast.error('User ID is required');
      return false;
    }
    
    try {
      console.log('Adding team member to project:', projectId, member);
      
      // Try using the RPC function first for better security
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
        console.error('Error adding team member via RPC:', error);
        
        // Fallback to direct insert if RPC fails
        const { data: insertData, error: insertError } = await supabase
          .from('project_members')
          .insert({
            project_id: projectId,
            user_id: member.user_id,
            project_member_name: member.name,
            role: member.role
          })
          .select()
          .single();
        
        if (insertError) {
          console.error('Error adding team member via direct insert:', insertError);
          
          if (insertError.message.includes('already a member')) {
            toast.error('User already a member', {
              description: 'This user is already a member of the project.'
            });
          } else if (insertError.message.includes('permission denied')) {
            toast.error('Access denied', { 
              description: 'You do not have permission to add members to this project.'
            });
          } else {
            toast.error('Failed to add team member', {
              description: insertError.message
            });
          }
          return false;
        }
        
        // Add the new member to the local state
        if (insertData) {
          setTeamMembers(prev => [...prev, { 
            id: insertData.id,
            name: member.name,
            role: member.role,
            user_id: member.user_id
          }]);
        
          toast.success('Team member added successfully');
          fetchTeamMembers(); // Refresh the list to get correct data
          return true;
        }
      } else {
        toast.success('Team member added successfully');
        fetchTeamMembers(); // Refresh the list to get correct data
        return true;
      }
      
      return false;
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
      
      // Try using the RPC function first for better security
      const { data, error } = await supabase.rpc(
        'remove_project_member',
        { 
          p_project_id: projectId,
          p_member_id: memberId
        }
      );
      
      if (error) {
        console.error('Error removing team member via RPC:', error);
        
        // Fallback to direct update if RPC fails
        const { error: updateError } = await supabase
          .from('project_members')
          .update({ left_at: new Date().toISOString() })
          .eq('id', memberId)
          .eq('project_id', projectId);
        
        if (updateError) {
          console.error('Error removing team member via direct update:', updateError);
          
          if (updateError.message.includes('permission denied')) {
            toast.error('Access denied', { 
              description: 'You do not have permission to remove members from this project.'
            });
          } else {
            toast.error('Failed to remove team member', {
              description: updateError.message
            });
          }
          return;
        }
      }
      
      // Update local state on success
      setTeamMembers(prev => prev.filter(member => member.id !== memberId));
      toast.success('Team member removed');
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
            disabled={isChecking || !hasAccess}
          >
            <UserPlus className="h-4 w-4" />
            Add Member
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading || isChecking ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">Loading team members...</p>
            </div>
          ) : !hasAccess ? (
            <div className="text-center py-6 text-muted-foreground">
              <p>You don't have permission to view team members for this project.</p>
            </div>
          ) : teamMembers.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              {errorDetails ? (
                <Collapsible className="w-full">
                  <div className="text-center mb-2">
                    <p>Error loading team members.</p>
                    <CollapsibleTrigger className="text-primary text-sm underline">
                      Show details
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent className="bg-red-50 p-3 text-sm rounded-md border border-red-200 my-2">
                    <code className="text-red-600 whitespace-pre-wrap">{errorDetails}</code>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <p>No team members yet. Add team members to collaborate on this project.</p>
              )}
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
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveMember(member.id)}
                    disabled={isChecking || !hasAccess}
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
