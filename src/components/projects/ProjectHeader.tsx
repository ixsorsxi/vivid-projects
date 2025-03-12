
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, CheckCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface ProjectHeaderProps {
  projectName: string;
  projectStatus: string;
  projectDescription: string;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  projectName,
  projectStatus,
  projectDescription
}) => {
  const [isAddMemberOpen, setIsAddMemberOpen] = React.useState(false);
  const [newMemberEmail, setNewMemberEmail] = React.useState('');
  const { toast } = useToast();

  const handleAddMember = () => {
    if (!newMemberEmail) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Invitation sent",
      description: `An invitation has been sent to ${newMemberEmail}`,
    });
    setNewMemberEmail('');
    setIsAddMemberOpen(false);
  };

  const handleMarkComplete = () => {
    toast({
      title: "Project status updated",
      description: "Project has been marked as complete",
    });
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">{projectName}</h1>
            <Badge variant={projectStatus === 'completed' ? 'success' : 'default'}>
              {projectStatus === 'in-progress' ? 'In Progress' : 
               projectStatus === 'completed' ? 'Completed' : 'Not Started'}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">{projectDescription}</p>
        </div>
        
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <Button variant="outline" size="sm" onClick={() => setIsAddMemberOpen(true)}>
            <User className="mr-2 h-4 w-4" />
            Add Member
          </Button>
          <Button variant="default" size="sm" onClick={handleMarkComplete}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Mark Complete
          </Button>
        </div>
      </div>

      <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>
              Send an invitation to a new team member via email.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              placeholder="Enter email address"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddMemberOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMember}>
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectHeader;
