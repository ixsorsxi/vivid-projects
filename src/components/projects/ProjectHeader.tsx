
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, CheckCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast-wrapper";

interface ProjectHeaderProps {
  projectName: string;
  projectStatus: string;
  projectDescription: string;
  onStatusChange?: (newStatus: string) => void;
  onAddMember?: (email: string) => void;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  projectName,
  projectStatus,
  projectDescription,
  onStatusChange,
  onAddMember
}) => {
  const [isAddMemberOpen, setIsAddMemberOpen] = React.useState(false);
  const [newMemberEmail, setNewMemberEmail] = React.useState('');

  const handleAddMember = () => {
    if (!newMemberEmail) {
      toast.error("Error", {
        description: "Please enter an email address",
      });
      return;
    }

    // Call the passed onAddMember function if provided
    if (onAddMember) {
      onAddMember(newMemberEmail);
    } else {
      // Fallback if no handler is provided
      toast("Invitation sent", {
        description: `An invitation has been sent to ${newMemberEmail}`,
      });
    }
    
    setNewMemberEmail('');
    setIsAddMemberOpen(false);
  };

  const handleMarkComplete = () => {
    const newStatus = projectStatus === 'completed' ? 'in-progress' : 'completed';
    
    // Call the passed onStatusChange function if provided
    if (onStatusChange) {
      onStatusChange(newStatus);
    } else {
      // Fallback if no handler is provided
      toast("Project status updated", {
        description: `Project has been marked as ${newStatus === 'completed' ? 'complete' : 'in progress'}`,
      });
    }
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
          <Button 
            variant={projectStatus === 'completed' ? 'outline' : 'default'} 
            size="sm" 
            onClick={handleMarkComplete}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            {projectStatus === 'completed' ? 'Mark In Progress' : 'Mark Complete'}
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
