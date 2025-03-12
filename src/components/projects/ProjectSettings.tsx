
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";

const ProjectSettings: React.FC = () => {
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  
  const [settings, setSettings] = useState({
    visibility: "private",
    emailNotifications: true,
    taskReminders: true,
    projectName: "Current Project",
    projectSlug: "current-project",
    category: "Development"
  });
  
  const handleSettingChange = (
    settingKey: keyof typeof settings,
    value: string | boolean
  ) => {
    setSettings({
      ...settings,
      [settingKey]: value
    });
    
    toast({
      title: "Setting updated",
      description: `The ${settingKey} setting has been updated successfully.`,
    });
  };
  
  const handleDeleteProject = () => {
    toast({
      title: "Project deleted",
      description: "The project has been successfully deleted.",
      variant: "destructive"
    });
    setIsDeleteDialogOpen(false);
    // In a real app, we would navigate away or refresh
    setTimeout(() => {
      window.location.href = "/";
    }, 1500);
  };
  
  return (
    <div className="glass-card p-6 rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Project Settings</h2>
      <p className="text-muted-foreground mb-6">
        Manage project configuration, permissions, and other settings.
      </p>
      
      <div className="space-y-6">
        <div className="border-b pb-4">
          <h3 className="font-medium mb-4">Project Information</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  value={settings.projectName}
                  onChange={(e) => 
                    setSettings({...settings, projectName: e.target.value})
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="projectSlug">Project URL Slug</Label>
                <Input
                  id="projectSlug"
                  value={settings.projectSlug}
                  onChange={(e) => 
                    setSettings({...settings, projectSlug: e.target.value})
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={settings.category}
                  onValueChange={(value) => 
                    handleSettingChange("category", value)
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Development">Development</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Research">Research</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button 
              onClick={() => {
                toast({
                  title: "Project information updated",
                  description: "Project details have been saved successfully.",
                });
              }}
            >
              Save Changes
            </Button>
          </div>
        </div>
        
        <div className="border-b pb-4">
          <h3 className="font-medium mb-2">Project Visibility</h3>
          <div className="flex items-center gap-4">
            <Button 
              variant={settings.visibility === "private" ? "outline" : "ghost"} 
              size="sm" 
              className={settings.visibility === "private" ? "rounded-full" : "rounded-full"}
              onClick={() => handleSettingChange("visibility", "private")}
            >
              Private
            </Button>
            <Button 
              variant={settings.visibility === "public" ? "outline" : "ghost"} 
              size="sm" 
              className={settings.visibility === "public" ? "rounded-full" : "rounded-full"}
              onClick={() => handleSettingChange("visibility", "public")}
            >
              Public
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {settings.visibility === "private" 
              ? "Only team members can access this project." 
              : "Anyone with the link can view this project."}
          </p>
        </div>
        
        <div className="border-b pb-4">
          <h3 className="font-medium mb-2">Notification Settings</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="emailNotifications">Email notifications</Label>
                <p className="text-sm text-muted-foreground">Receive email updates about this project</p>
              </div>
              <Switch 
                id="emailNotifications"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => 
                  handleSettingChange("emailNotifications", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="taskReminders">Task reminders</Label>
                <p className="text-sm text-muted-foreground">Get notified about upcoming deadlines</p>
              </div>
              <Switch 
                id="taskReminders"
                checked={settings.taskReminders}
                onCheckedChange={(checked) => 
                  handleSettingChange("taskReminders", checked)
                }
              />
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-2 text-red-500 dark:text-red-400">Danger Zone</h3>
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
                  onClick={handleDeleteProject}
                  disabled={confirmText !== "delete"}
                >
                  Delete Project
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <p className="text-xs text-muted-foreground mt-2">
            Once deleted, it's gone forever and cannot be recovered.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectSettings;
