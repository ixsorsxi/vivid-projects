
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import SettingsCard from "@/pages/Admin/settings/components/SettingsCard";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/toast-wrapper";
import { useNavigate } from "react-router-dom";

interface DangerZoneProps {
  projectId: string;
  onDeleteProject: () => void;
}

const DangerZoneSection: React.FC<DangerZoneProps> = ({
  projectId,
  onDeleteProject
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  
  const handleProjectDelete = async () => {
    if (confirmText !== "delete") return;
    
    try {
      setIsDeleting(true);
      
      console.log("Deleting project with ID:", projectId);
      
      // Delete the project from Supabase
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);
      
      if (error) {
        console.error("Error deleting project:", error);
        toast.error("Delete failed", {
          description: "There was a problem deleting this project. Please try again."
        });
        return;
      }
      
      // Call the onDeleteProject callback to update the UI
      onDeleteProject();
      
      // Close the dialog
      setIsDeleteDialogOpen(false);
      
      // Navigate to projects page
      setTimeout(() => {
        navigate('/projects');
      }, 500);
      
    } catch (err) {
      console.error("Error in handleProjectDelete:", err);
      toast.error("Unexpected error", {
        description: "An error occurred while trying to delete the project."
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <SettingsCard 
      title="Danger Zone"
      description="Actions that can't be undone"
      onSave={() => {}}
      footer={null}
    >
      <div className="space-y-4">
        <Separator className="my-4" />
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-red-500 dark:text-red-400">Delete Project</p>
            <p className="text-sm text-muted-foreground">
              Once deleted, it's gone forever and cannot be recovered.
            </p>
          </div>
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">Delete Project</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete the project
                  and all associated data including tasks, files, and comments.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <p className="text-sm text-muted-foreground">
                  Please type <strong>delete</strong> to confirm:
                </p>
                <Input
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Type 'delete' to confirm"
                />
              </div>
              
              <DialogFooter>
                <Button 
                  variant="ghost" 
                  onClick={() => setIsDeleteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleProjectDelete}
                  disabled={confirmText !== "delete" || isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete Project"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </SettingsCard>
  );
};

export default DangerZoneSection;
