
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Trash2 } from "lucide-react";
import { useParams } from 'react-router-dom';
import AddMemberDialog from './AddMemberDialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/toast-wrapper';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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

  // Fetch team members when component mounts or projectId changes
  useEffect(() => {
    if (projectId) {
      fetchTeamMembers();
    }
  }, [projectId]);

  const fetchTeamMembers = async () => {
    if (!projectId) return;
    
    setIsLoading(true);
    setErrorDetails(null);
    
    try {
      console.log('Fetching team members for project:', projectId);
      
      // Use the direct query with the fixed RLS policies
      const { data, error } = await supabase
        .from('project_members')
        .select('id, project_member_name, role, user_id')
        .eq('project_id', projectId)
        .is('left_at', null); // Only get active members
      
      if (error) {
        console.error('Error fetching team members:', error);
        setErrorDetails(error.message);
        
        if (error.message.includes('permission denied') || error.code === '42501') {
          toast.error('Access denied', { 
            description: 'You do not have permission to view team members for this project.'
          });
        } else if (error.message.includes('recursion')) {
          toast.error('Database policy issue', { 
            description: 'There was an issue with the database configuration. Please try again.'
          });
        } else {
          toast.error('Failed to load team members', {
            description: error.message
          });
        }
        
        setTeamMembers([]);
      } else if (!data) {
        setTeamMembers([]);
        console.log('No team members returned from query');
      } else {
        console.log('Team members loaded successfully:', data);
        
        const formattedMembers: TeamMember[] = data.map(member => ({
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
      
      // Checking if user is already a member
      const { data: existingMember, error: checkError } = await supabase
        .from('project_members')
        .select('id')
        .eq('project_id', projectId)
        .eq('user_id', member.user_id)
        .is('left_at', null)
        .maybeSingle();
        
      if (checkError) {
        console.error('Error checking existing membership:', checkError);
        throw new Error(`Error checking existing membership: ${checkError.message}`);
      }
      
      if (existingMember) {
        toast.error('User already a member', {
          description: 'This user is already a member of the project.'
        });
        return false;
      }
      
      // Add member to database using the fixed RLS policies
      const { data, error } = await supabase
        .from('project_members')
        .insert({
          project_id: projectId,
          project_member_name: member.name,
          role: member.role,
          user_id: member.user_id,
          joined_at: new Date().toISOString()
        })
        .select('id')
        .single();
      
      if (error) {
        console.error('Error adding team member:', error);
        
        if (error.message.includes('permission denied') || error.code === '42501') {
          toast.error('Access denied', { 
            description: 'You do not have permission to add members to this project.'
          });
        } else if (error.message.includes('violates foreign key constraint')) {
          toast.error('Invalid user', { 
            description: 'The selected user does not exist in the system.'
          });
        } else if (error.message.includes('violates row-level security policy')) {
          toast.error('Security policy violation', {
            description: 'You cannot add members to this project due to security restrictions.'
          });
        } else {
          toast.error('Failed to add team member', {
            description: error.message
          });
        }
        return false;
      }
      
      // Update local state with the real ID from the database
      setTeamMembers(prev => [...prev, { 
        id: data.id,
        name: member.name,
        role: member.role,
        user_id: member.user_id
      }]);
      
      toast.success('Team member added successfully');
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
      
      // Update with left_at timestamp instead of deleting to maintain history
      const { error } = await supabase
        .from('project_members')
        .update({ left_at: new Date().toISOString() })
        .eq('id', memberId)
        .eq('project_id', projectId);
      
      if (error) {
        console.error('Error removing team member:', error);
        
        if (error.message.includes('permission denied') || error.code === '42501') {
          toast.error('Access denied', { 
            description: 'You do not have permission to remove members from this project.'
          });
        } else if (error.message.includes('violates row-level security policy')) {
          toast.error('Security policy violation', {
            description: 'You cannot remove members from this project due to security restrictions.'
          });
        } else {
          toast.error('Failed to remove team member', {
            description: error.message
          });
        }
        return;
      }
      
      // Update local state
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
          >
            <UserPlus className="h-4 w-4" />
            Add Member
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">Loading team members...</p>
            </div>
          ) : teamMembers.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              {errorDetails ? (
                <Collapsible className="w-full">
                  <div className="text-center mb-2">
                    <p>Error loading team members.</p>
                    <CollapsibleTrigger className="text-primary-600 text-sm underline">
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
