import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Trash2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface TeamMember {
  id: number;
  name: string;
  role: string;
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
  const [isInviteOpen, setIsInviteOpen] = React.useState(false);
  const [inviteEmail, setInviteEmail] = React.useState('');
  const [inviteRole, setInviteRole] = React.useState('');
  const { toast } = useToast();
  const [teamMembers, setTeamMembers] = React.useState<TeamMember[]>(team);

  React.useEffect(() => {
    setTeamMembers(team);
  }, [team]);

  const handleInviteMember = () => {
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
    setIsInviteOpen(false);
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
          <Button size="sm" onClick={() => setIsInviteOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Member
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

      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Send an invitation to join the project team.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Enter email address"
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                placeholder="e.g. Developer, Designer, Manager"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInviteOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleInviteMember}>
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectTeam;
