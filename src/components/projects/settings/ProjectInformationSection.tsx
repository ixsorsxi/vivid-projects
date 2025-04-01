
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
import SettingsCard from "@/pages/Admin/settings/components/SettingsCard";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast-wrapper";

interface ProjectInformationProps {
  projectName: string;
  projectSlug: string;
  category: string;
  onProjectNameChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSave: () => void;
  isSaving?: boolean;
}

const ProjectInformationSection: React.FC<ProjectInformationProps> = ({
  projectName,
  projectSlug,
  category,
  onProjectNameChange,
  onCategoryChange,
  onSave,
  isSaving = false
}) => {
  const [name, setName] = useState(projectName || '');
  const [selectedCategory, setSelectedCategory] = useState(category || 'Development');

  // Update local state when props change
  useEffect(() => {
    console.log("ProjectInformationSection props updated:", { projectName, category });
    
    if (projectName && projectName !== name) {
      setName(projectName);
    }
    
    if (category) {
      console.log("Setting selectedCategory to:", category);
      setSelectedCategory(category);
    }
  }, [projectName, category, name]);

  const handleSave = () => {
    console.log("Saving with:", { name, selectedCategory });
    
    // Update values via callbacks
    if (name !== projectName) {
      onProjectNameChange(name);
    }
    
    if (selectedCategory !== category) {
      console.log("Changing category from", category, "to", selectedCategory);
      onCategoryChange(selectedCategory);
    }
    
    // Call the main save handler
    onSave();
    
    // Show success toast - fixed to use the correct toast API format
    toast.success("Changes saved", {
      description: "Project name and category updated successfully."
    });
  };
  
  console.log("Rendering ProjectInformationSection with:", { name, selectedCategory, projectName, category });
  
  return (
    <SettingsCard 
      title="Project Information"
      description="Update your project details and properties."
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
              value={projectSlug}
              readOnly
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">Project ID cannot be changed</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select 
              value={selectedCategory}
              onValueChange={(value) => {
                console.log("Category selected:", value);
                setSelectedCategory(value);
              }}
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
