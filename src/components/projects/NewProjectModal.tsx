
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircle, Calendar, User, Hash, DollarSign, Milestone, Timer, X } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface Phase {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  milestones: Milestone[];
}

interface Milestone {
  id: string;
  name: string;
  dueDate: string;
}

const NewProjectModal = ({ buttonClassName }: { buttonClassName?: string }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = React.useState(false);
  
  // Basic project details
  const [projectName, setProjectName] = React.useState('');
  const [projectDescription, setProjectDescription] = React.useState('');
  const [projectCategory, setProjectCategory] = React.useState('');
  const [dueDate, setDueDate] = React.useState('');
  const [isPrivate, setIsPrivate] = React.useState(false);
  const [projectCode, setProjectCode] = React.useState('');
  
  // Advanced project details
  const [budget, setBudget] = React.useState('');
  const [currency, setCurrency] = React.useState('USD');
  const [phases, setPhases] = React.useState<Phase[]>([]);
  
  const generateProjectCode = () => {
    const random = Math.floor(1000 + Math.random() * 9000);
    setProjectCode(`PRJ-${random}`);
  };

  const addPhase = () => {
    const newPhase: Phase = {
      id: `phase-${phases.length + 1}`,
      name: '',
      startDate: '',
      endDate: '',
      milestones: []
    };
    setPhases([...phases, newPhase]);
  };

  const addMilestone = (phaseId: string) => {
    const updatedPhases = phases.map(phase => {
      if (phase.id === phaseId) {
        return {
          ...phase,
          milestones: [
            ...phase.milestones,
            {
              id: `milestone-${phase.milestones.length + 1}`,
              name: '',
              dueDate: ''
            }
          ]
        };
      }
      return phase;
    });
    setPhases(updatedPhases);
  };

  const updatePhase = (phaseId: string, field: keyof Phase, value: string) => {
    const updatedPhases = phases.map(phase => {
      if (phase.id === phaseId) {
        return { ...phase, [field]: value };
      }
      return phase;
    });
    setPhases(updatedPhases);
  };

  const updateMilestone = (phaseId: string, milestoneId: string, field: keyof Milestone, value: string) => {
    const updatedPhases = phases.map(phase => {
      if (phase.id === phaseId) {
        const updatedMilestones = phase.milestones.map(milestone => {
          if (milestone.id === milestoneId) {
            return { ...milestone, [field]: value };
          }
          return milestone;
        });
        return { ...phase, milestones: updatedMilestones };
      }
      return phase;
    });
    setPhases(updatedPhases);
  };

  const removePhase = (phaseId: string) => {
    setPhases(phases.filter(phase => phase.id !== phaseId));
  };

  const removeMilestone = (phaseId: string, milestoneId: string) => {
    const updatedPhases = phases.map(phase => {
      if (phase.id === phaseId) {
        return {
          ...phase,
          milestones: phase.milestones.filter(m => m.id !== milestoneId)
        };
      }
      return phase;
    });
    setPhases(updatedPhases);
  };

  React.useEffect(() => {
    if (isOpen) {
      generateProjectCode();
    }
  }, [isOpen]);

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectName.trim()) {
      toast({
        title: "Error",
        description: "Project name is required",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would create a project in the backend
    console.log('Creating new project:', {
      name: projectName,
      description: projectDescription,
      category: projectCategory,
      dueDate,
      isPrivate,
      code: projectCode,
      budget: parseFloat(budget),
      currency,
      phases
    });
    
    toast({
      title: "Success",
      description: `Project "${projectName}" created successfully`,
    });
    
    setIsOpen(false);
    navigate('/projects/' + encodeURIComponent(projectName.toLowerCase().replace(/\s+/g, '-')));
  };

  const resetForm = () => {
    setProjectName('');
    setProjectDescription('');
    setProjectCategory('');
    setDueDate('');
    setIsPrivate(false);
    setBudget('');
    setCurrency('USD');
    setPhases([]);
    generateProjectCode();
  };

  React.useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className={buttonClassName || "gap-2"}>
          <PlusCircle className="h-4 w-4" />
          <span>New Project</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Enter the details for your new project. Fill in all required information.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreateProject} className="space-y-6 mt-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="projectName">Project Name *</Label>
                <Input
                  id="projectName"
                  placeholder="Enter project name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="projectCode">Project Code</Label>
                <Input
                  id="projectCode"
                  value={projectCode}
                  onChange={(e) => setProjectCode(e.target.value)}
                  prefix={<Hash className="h-4 w-4 text-muted-foreground" />}
                  readOnly
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="projectDescription">Description</Label>
              <textarea
                id="projectDescription"
                placeholder="Enter project description"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="projectCategory">Category</Label>
                <Select value={projectCategory} onValueChange={setProjectCategory}>
                  <SelectTrigger id="projectCategory">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="research">Research</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  prefix={<Calendar className="h-4 w-4 text-muted-foreground" />}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectBudget">Budget</Label>
                <div className="flex gap-2">
                  <Input
                    id="projectBudget"
                    type="number"
                    placeholder="Enter budget"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    prefix={<DollarSign className="h-4 w-4 text-muted-foreground" />}
                  />
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Project Phases */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Project Phases</h3>
              <Button type="button" variant="outline" size="sm" onClick={addPhase}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Phase
              </Button>
            </div>
            
            <div className="space-y-4">
              {phases.map((phase, index) => (
                <div key={phase.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Phase {index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removePhase(phase.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      placeholder="Phase name"
                      value={phase.name}
                      onChange={(e) => updatePhase(phase.id, 'name', e.target.value)}
                    />
                    <Input
                      type="date"
                      value={phase.startDate}
                      onChange={(e) => updatePhase(phase.id, 'startDate', e.target.value)}
                      prefix={<Calendar className="h-4 w-4 text-muted-foreground" />}
                    />
                    <Input
                      type="date"
                      value={phase.endDate}
                      onChange={(e) => updatePhase(phase.id, 'endDate', e.target.value)}
                      prefix={<Calendar className="h-4 w-4 text-muted-foreground" />}
                    />
                  </div>
                  
                  {/* Milestones */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Milestones</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => addMilestone(phase.id)}
                      >
                        <Milestone className="h-4 w-4 mr-2" />
                        Add Milestone
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      {phase.milestones.map((milestone, mIndex) => (
                        <div key={milestone.id} className="flex items-center gap-2">
                          <Input
                            placeholder="Milestone name"
                            value={milestone.name}
                            onChange={(e) => updateMilestone(phase.id, milestone.id, 'name', e.target.value)}
                          />
                          <Input
                            type="date"
                            value={milestone.dueDate}
                            onChange={(e) => updateMilestone(phase.id, milestone.id, 'dueDate', e.target.value)}
                            prefix={<Calendar className="h-4 w-4 text-muted-foreground" />}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeMilestone(phase.id, milestone.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="isPrivate" 
              checked={isPrivate} 
              onCheckedChange={(checked) => setIsPrivate(checked as boolean)} 
            />
            <Label htmlFor="isPrivate" className="text-sm font-normal">
              Make this project private
            </Label>
          </div>
          
          <div className="flex justify-between pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create Project</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectModal;
