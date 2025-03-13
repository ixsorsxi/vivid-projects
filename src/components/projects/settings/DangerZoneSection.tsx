
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

interface DangerZoneProps {
  onDeleteProject: () => void;
}

const DangerZoneSection: React.FC<DangerZoneProps> = ({
  onDeleteProject
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  
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
                  onClick={onDeleteProject}
                  disabled={confirmText !== "delete"}
                >
                  Delete Project
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
