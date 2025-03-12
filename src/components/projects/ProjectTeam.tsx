
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Trash2, Search, Mail, AtSign } from 'lucide-react';

interface TeamMember {
  id: number;
  name: string;
  role: string;
}

interface SystemUser {
  id: number;
  name: string;
  email: string;
  role?: string;
}

interface ProjectTeamProps {
  team: TeamMember[];
  onAddMember?: (name: string, role: string) => void;
  onRemoveMember?: (id: number) => void;
}

const ProjectTeam: React.FC<ProjectTeamProps> = ({ 
  team,
  onAddMember,
  onRemoveMember
}) => {
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [selectedRole, setSelectedRole] = useState('');
  const { toast } = useToast();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(team);

  // Mock data for system users - in a real application, this would come from an API
  const [systemUsers] = useState<SystemUser[]>([
    { id: 101, name: 'Alex Johnson', email: 'alex@example.com' },
    { id: 102, name: 'Maria Garcia', email: 'maria@example.com' },
    { id: 103, name: 'Sam Wilson', email: 'sam@example.com' },
    { id: 104, name: 'Taylor Kim', email: 'taylor@example.com' },
    { id: 105, name: 'Jordan Lee', email: 'jordan@example.com' },
  ]);

  React.useEffect(() => {
    setTeamMembers(team);
  }, [team]);

  const filteredUsers = systemUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddExistingUser = () => {
    if (!selectedUser || !selectedRole) {
      toast({
        title: "Error",
        description: "Please select a user and specify their role",
        variant: "destructive",
      });
      return;
    }

    if (onAddMember) {
      onAddMember(selectedUser.email, selectedRole);
    } else {
      const newMember: TeamMember = {
        id: selectedUser.id,
        name: selectedUser.name,
        role: selectedRole
      };
      
      setTeamMembers([...teamMembers, newMember]);
      
      toast({
        title: "Team member added",
        description: `${selectedUser.name} has been added to the project as ${selectedRole}`,
      });
    }

    setSelectedUser(null);
    setSelectedRole('');
    setSearchQuery('');
    setIsAddMemberOpen(false);
  };

  const handleInviteByEmail = () => {
    if (!inviteEmail || !inviteRole) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (onAddMember) {
      onAddMember(inviteEmail, inviteRole);
    } else {
      const newMember: TeamMember = {
        id: Date.now(),
        name: inviteEmail.split('@')[0],
        role: inviteRole
      };
      
      setTeamMembers([...teamMembers, newMember]);
      
      toast({
        title: "Invitation sent",
        description: `An invitation has been sent to ${inviteEmail} for the role of ${inviteRole}`,
      });
    }

    setInviteEmail('');
    setInviteRole('');
    setIsAddMemberOpen(false);
  };

  const handleRemoveMember = (id: number) => {
    if (onRemoveMember) {
      onRemoveMember(id);
    } else {
      const updatedTeam = teamMembers.filter(member => member.id !== id);
      setTeamMembers(updatedTeam);
      
      toast({
        title: "Team member removed",
        description: "The team member has been removed from the project",
      });
    }
  };

  return (
    <>
      <div className="glass-card p-6 rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">Team Members</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Project team ({teamMembers.length} members)
            </p>
          </div>
          <Button size="sm" onClick={() => setIsAddMemberOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teamMembers.map(member => (
            <div key={member.id} className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                {member.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <p className="font-medium">{member.name}</p>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-destructive"
                onClick={() => handleRemoveMember(member.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          {teamMembers.length === 0 && (
            <div className="col-span-2 p-6 text-center border rounded-lg">
              <p className="text-muted-foreground">No team members yet</p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>
              Search for existing users or invite someone by email.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="search" className="w-full mt-4">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="search">
                <Search className="h-4 w-4 mr-2" />
                Search Users
              </TabsTrigger>
              <TabsTrigger value="invite">
                <AtSign className="h-4 w-4 mr-2" />
                Invite by Email
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="search" className="space-y-4">
              <div>
                <Label htmlFor="search-user">Search Users</Label>
                <Input
                  id="search-user"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or email"
                  prefix={<Search className="h-4 w-4 text-muted-foreground" />}
                />
              </div>
              
              <div className="max-h-60 overflow-y-auto border rounded-md">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <div
                      key={user.id}
                      className={`flex items-center gap-3 p-3 hover:bg-muted cursor-pointer ${
                        selectedUser?.id === user.id ? 'bg-muted' : ''
                      }`}
                      onClick={() => setSelectedUser(user)}
                    >
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    No matching users found
                  </div>
                )}
              </div>
              
              <div>
                <Label htmlFor="role">Assign Role</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Project Manager">Project Manager</SelectItem>
                    <SelectItem value="Developer">Developer</SelectItem>
                    <SelectItem value="Designer">Designer</SelectItem>
                    <SelectItem value="QA Engineer">QA Engineer</SelectItem>
                    <SelectItem value="Product Owner">Product Owner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setIsAddMemberOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddExistingUser}>
                  Add to Project
                </Button>
              </DialogFooter>
            </TabsContent>
            
            <TabsContent value="invite" className="space-y-4">
              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="Enter email address"
                  prefix={<Mail className="h-4 w-4 text-muted-foreground" />}
                />
              </div>
              <div>
                <Label htmlFor="invite-role">Role</Label>
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger id="invite-role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Project Manager">Project Manager</SelectItem>
                    <SelectItem value="Developer">Developer</SelectItem>
                    <SelectItem value="Designer">Designer</SelectItem>
                    <SelectItem value="QA Engineer">QA Engineer</SelectItem>
                    <SelectItem value="Product Owner">Product Owner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setIsAddMemberOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleInviteByEmail}>
                  Send Invitation
                </Button>
              </DialogFooter>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectTeam;
