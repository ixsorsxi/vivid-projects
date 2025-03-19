
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UserPlus, X, Trash2, Mail, Search, Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeamMember } from '@/hooks/useProjectForm';
import { SystemUser } from '@/components/projects/team/types';
import { useSystemUsers } from '@/hooks/project-form/useSystemUsers';
import Avatar from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";

interface TeamSectionProps {
  teamMembers: TeamMember[];
  addTeamMember: () => void;
  updateTeamMember: (memberId: string, field: keyof TeamMember, value: string) => void;
  removeTeamMember: (memberId: string) => void;
}

const TeamSection: React.FC<TeamSectionProps> = ({
  teamMembers,
  addTeamMember,
  updateTeamMember,
  removeTeamMember
}) => {
  const [activeTab, setActiveTab] = useState<'system' | 'external'>('system');
  const [searchQuery, setSearchQuery] = useState('');
  const { users, isLoading } = useSystemUsers();
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('');

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleUserSelection = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  };
  
  const handleAddSelectedUsers = () => {
    if (selectedUsers.length === 0) return;
    
    // Find the selected users from the users array
    const usersToAdd = users.filter(user => selectedUsers.includes(user.id));
    
    // Add each selected user as a team member
    usersToAdd.forEach(user => {
      // First add a team member
      addTeamMember();
      
      // Then update the fields of the newly added team member
      // We assume the latest team member is the one just added
      const newMemberId = teamMembers[teamMembers.length - 1]?.id;
      
      if (newMemberId) {
        updateTeamMember(newMemberId, 'name', user.name);
        updateTeamMember(newMemberId, 'role', user.role || 'Team Member');
        updateTeamMember(newMemberId, 'email', user.email);
      }
    });
    
    // Clear selection
    setSelectedUsers([]);
  };
  
  const handleInviteExternal = () => {
    if (!inviteEmail || !inviteRole) return;
    
    // First add a team member
    addTeamMember();
    
    // Then update the fields of the newly added team member
    const newMemberId = teamMembers[teamMembers.length - 1]?.id;
    
    if (newMemberId) {
      updateTeamMember(newMemberId, 'name', inviteEmail.split('@')[0]);
      updateTeamMember(newMemberId, 'role', inviteRole);
      updateTeamMember(newMemberId, 'email', inviteEmail);
    }
    
    // Clear form
    setInviteEmail('');
    setInviteRole('');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Project Team</h3>
      </div>
      
      <Tabs defaultValue="system" value={activeTab} onValueChange={(value) => setActiveTab(value as 'system' | 'external')}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="system">System Users</TabsTrigger>
          <TabsTrigger value="external">Invite External</TabsTrigger>
        </TabsList>
        
        <TabsContent value="system" className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search users..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          {isLoading ? (
            <div className="p-4 text-center">Loading users...</div>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <div className="max-h-60 overflow-y-auto">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <div 
                      key={user.id}
                      className="flex items-center px-4 py-3 border-b last:border-b-0 hover:bg-muted/50"
                    >
                      <Checkbox 
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => handleUserSelection(user.id)}
                        className="mr-3"
                      />
                      <Avatar className="h-8 w-8 mr-3">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-grow">
                        <p className="font-medium text-sm">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                      <div className="text-xs text-muted-foreground">{user.role}</div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    No users match your search
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="flex justify-end">
            <Button 
              type="button" 
              onClick={handleAddSelectedUsers}
              disabled={selectedUsers.length === 0}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Selected Users
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="external" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label>Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Enter email address" 
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="project-manager">Project Manager</SelectItem>
                  <SelectItem value="developer">Developer</SelectItem>
                  <SelectItem value="designer">Designer</SelectItem>
                  <SelectItem value="tester">QA Tester</SelectItem>
                  <SelectItem value="analyst">Business Analyst</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end">
              <Button 
                type="button" 
                onClick={handleInviteExternal}
                disabled={!inviteEmail || !inviteRole}
                className="gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Invite Team Member
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6">
        <h4 className="font-medium mb-3">Current Team Members</h4>
        
        {teamMembers.length > 0 ? (
          <div className="space-y-4">
            {teamMembers.map((member, index) => (
              <div key={member.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Team Member {index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTeamMember(member.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      placeholder="Member name"
                      value={member.name}
                      onChange={(e) => updateTeamMember(member.id, 'name', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Select
                      value={member.role}
                      onValueChange={(value) => updateTeamMember(member.id, 'role', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="project-manager">Project Manager</SelectItem>
                        <SelectItem value="developer">Developer</SelectItem>
                        <SelectItem value="designer">Designer</SelectItem>
                        <SelectItem value="tester">QA Tester</SelectItem>
                        <SelectItem value="analyst">Business Analyst</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      placeholder="Email address"
                      type="email"
                      value={member.email || ''}
                      onChange={(e) => updateTeamMember(member.id, 'email', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border rounded-lg p-6 text-center">
            <p className="text-muted-foreground">No team members added yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamSection;
