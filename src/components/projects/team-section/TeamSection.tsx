
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Trash2 } from "lucide-react";
import { useParams } from 'react-router-dom';
import AddMemberDialog from './AddMemberDialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/toast-wrapper';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  user_id?: string;
}

// Demo team members for fallback testing
const demoTeamMembers: TeamMember[] = [
  { 
    id: 'demo-1', 
    name: 'John Doe', 
    role: 'Project Manager', 
    user_id: '12345678-1234-1234-1234-123456789abc' 
  },
  { 
    id: 'demo-2', 
    name: 'Jane Smith', 
    role: 'Developer', 
    user_id: '87654321-4321-4321-4321-987654321def' 
  },
  { 
    id: 'demo-3', 
    name: 'Alex Johnson', 
    role: 'Designer', 
    user_id: 'abcdef12-3456-7890-abcd-ef1234567890' 
  }
];

const TeamSection = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [useDemoData, setUseDemoData] = useState(false);

  // Fetch team members when component mounts
  useEffect(() => {
    if (projectId) {
      fetchTeamMembers();
    }
  }, [projectId]);

  const fetchTeamMembers = async () => {
    if (!projectId) return;
    
    setIsLoading(true);
    
    try {
      // Direct query avoiding RLS issues
      const { data, error } = await supabase
        .from('project_members')
        .select('id, project_member_name, role, user_id')
        .eq('project_id', projectId);
      
      if (error) {
        console.error('Error fetching team members:', error);
        // Fallback to demo data on error
        setTeamMembers(demoTeamMembers);
        setUseDemoData(true);
        toast.info('Using demo data for team members');
      } else {
        const formattedMembers: TeamMember[] = data.map(member => ({
          id: member.id,
          name: member.project_member_name || 'Unnamed Member',
          role: member.role,
          user_id: member.user_id
        }));
        
        setTeamMembers(formattedMembers);
        setUseDemoData(false);
      }
    } catch (error) {
      console.error('Error in fetchTeamMembers:', error);
      // Fallback to demo data on error
      setTeamMembers(demoTeamMembers);
      setUseDemoData(true);
      toast.info('Using demo data for team members');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMember = async (member: { name: string; role: string; user_id?: string }) => {
    if (!projectId) return false;
    
    try {
      // If using demo data, just add to local state
      if (useDemoData) {
        const newMemberId = `demo-${Date.now()}`;
        const newMember: TeamMember = {
          id: newMemberId,
          name: member.name,
          role: member.role,
          user_id: member.user_id || `demo-user-${Date.now()}`
        };
        
        setTeamMembers(prev => [...prev, newMember]);
        toast.success('Demo team member added successfully');
        return true;
      }
      
      // Add member to database - ensuring we include user_id which is required by the schema
      const { data, error } = await supabase
        .from('project_members')
        .insert({
          project_id: projectId,
          project_member_name: member.name,
          role: member.role,
          user_id: member.user_id || '00000000-0000-0000-0000-000000000000' // Provide a default UUID if no user_id is given
        })
        .select('id')
        .single();
      
      if (error) {
        console.error('Error adding team member to database:', error);
        toast.error('Failed to add team member to database');
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
    } catch (error) {
      console.error('Exception in handleAddMember:', error);
      toast.error('Failed to add team member');
      return false;
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!projectId) return;
    
    try {
      // If using demo data, just remove from local state
      if (useDemoData) {
        setTeamMembers(prev => prev.filter(member => member.id !== memberId));
        toast.success('Demo team member removed');
        return;
      }
      
      // Remove from database
      const { error } = await supabase
        .from('project_members')
        .delete()
        .eq('id', memberId);
      
      if (error) {
        console.error('Error removing team member from database:', error);
        toast.error('Failed to remove team member from database');
        return;
      }
      
      // Update local state
      setTeamMembers(prev => prev.filter(member => member.id !== memberId));
      toast.success('Team member removed');
    } catch (error) {
      console.error('Exception in handleRemoveMember:', error);
      toast.error('Failed to remove team member');
    }
  };

  // Toggle between demo data and real data
  const toggleDemoData = () => {
    if (useDemoData) {
      // Switch back to real data
      fetchTeamMembers();
    } else {
      // Switch to demo data
      setTeamMembers(demoTeamMembers);
      setUseDemoData(true);
      toast.info('Using demo data for team members');
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
          <div className="flex gap-2">
            <Button 
              onClick={toggleDemoData}
              size="sm"
              variant="outline"
              className="flex items-center gap-1"
            >
              {useDemoData ? 'Use Real Data' : 'Use Demo Data'}
            </Button>
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              size="sm"
              className="flex items-center gap-1"
            >
              <UserPlus className="h-4 w-4" />
              Add Member
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">Loading team members...</p>
            </div>
          ) : teamMembers.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No team members yet. Add team members to collaborate on this project.
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
