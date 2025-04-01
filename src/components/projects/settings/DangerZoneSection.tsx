
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface DangerZoneProps {
  projectId: string;
  onDeleteProject: () => void;
}

const DangerZoneSection: React.FC<DangerZoneProps> = ({
  projectId,
  onDeleteProject
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const handleProjectDelete = async () => {
    if (confirmText !== "delete") return;
    
    try {
      setIsDeleting(true);
      setDeleteError(null);
      
      console.log("Deleting project with ID:", projectId);
      
      // Call the RPC function to delete the project
      const { error } = await supabase.rpc('delete_project', {
        p_project_id: projectId
      });
      
      if (error) {
        console.error("Error deleting project:", error);
        setDeleteError(error.message);
        setIsAlertOpen(true);
        return;
      }
      
      // Call the onDeleteProject callback to update the UI
      onDeleteProject();
      
      // Close the dialog
      setIsDeleteDialogOpen(false);
      
      // Navigate to projects page
      setTimeout(() => {
        navigate('/projects');
      }, 1000);
      
    } catch (err) {
      console.error("Error in handleProjectDelete:", err);
      setDeleteError("An unexpected error occurred while trying to delete the project.");
      setIsAlertOpen(true);
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

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete failed</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteError || "There was a problem deleting this project. Please try again."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SettingsCard>
  );
};

export default DangerZoneSection;
