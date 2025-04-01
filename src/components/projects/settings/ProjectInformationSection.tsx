
import React, { useEffect, useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { toast } from "@/components/ui/toast-wrapper";
import { supabase } from "@/integrations/supabase/client";
import SettingsCard from "@/pages/Admin/settings/components/SettingsCard";
import { Button } from "@/components/ui/button";

interface ProjectInformationProps {
  projectName: string;
  projectSlug: string;
  category: string;
  onProjectNameChange: (value: string) => void;
  onProjectSlugChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

const ProjectInformationSection: React.FC<ProjectInformationProps> = ({
  projectName,
  projectSlug,
  category,
  onProjectNameChange,
  onProjectSlugChange,
  onCategoryChange
}) => {
  const [name, setName] = useState(projectName);
  const [slug, setSlug] = useState(projectSlug);
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [isSaving, setIsSaving] = useState(false);

  // Update local state when props change
  useEffect(() => {
    setName(projectName);
    setSlug(projectSlug);
    setSelectedCategory(category);
  }, [projectName, projectSlug, category]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Update the project information in the database
      const { error } = await supabase
        .from('projects')
        .update({
          name: name,
          category: selectedCategory
        })
        .eq('id', projectSlug);

      if (error) {
        console.error("Error updating project:", error);
        toast.error("Failed to update project", {
          description: error.message,
        });
        return;
      }

      // Update the local state via callbacks
      onProjectNameChange(name);
      onCategoryChange(selectedCategory);

      toast("Project information updated", {
        description: "Project details have been saved successfully.",
      });
    } catch (error) {
      console.error("Error in handleSave:", error);
      toast.error("Error saving changes", {
        description: "There was a problem saving your changes.",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <SettingsCard 
      title="Project Information"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="projectName">Project Name</Label>
            <Input
              id="projectName"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="projectSlug">Project ID</Label>
            <Input
              id="projectSlug"
              value={slug}
              readOnly
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">Project ID cannot be changed</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select 
              value={selectedCategory}
              onValueChange={setSelectedCategory}
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
        <div className="flex justify-end">
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </SettingsCard>
  );
};

export default ProjectInformationSection;
