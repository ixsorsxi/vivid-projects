
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ProjectRisk } from '@/lib/types/project';
import { toast } from '@/components/ui/toast-wrapper';

export interface ProjectRiskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  risk?: ProjectRisk;
  isEditing?: boolean;
  onAddRisk: (risk: Omit<ProjectRisk, "id" | "created_at" | "project_id">) => Promise<void>;
}

const ProjectRiskDialog: React.FC<ProjectRiskDialogProps> = ({
  open,
  onOpenChange,
  projectId,
  risk,
  isEditing = false,
  onAddRisk
}) => {
  const [title, setTitle] = useState(risk?.title || '');
  const [description, setDescription] = useState(risk?.description || '');
  const [severity, setSeverity] = useState<ProjectRisk['severity']>(risk?.severity || 'medium');
  const [probability, setProbability] = useState(risk?.probability || 50);
  const [impact, setImpact] = useState<ProjectRisk['impact']>(risk?.impact || 'medium');
  const [status, setStatus] = useState<ProjectRisk['status']>(risk?.status || 'active');
  const [mitigationPlan, setMitigationPlan] = useState(risk?.mitigation_plan || '');
  const [ownerName, setOwnerName] = useState(risk?.owner_name || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title) {
      toast.error('Required fields missing', {
        description: 'Please enter a title for this risk.'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Convert probability number to string for the backend requirement
      const probabilityValue = typeof probability === 'number' 
        ? probability <= 33 ? 'low' : probability <= 66 ? 'medium' : 'high' 
        : probability;
      
      await onAddRisk({
        title,
        description,
        severity,
        probability: probabilityValue,
        impact,
        status,
        mitigation_plan: mitigationPlan,
        owner_name: ownerName,
        updated_at: new Date().toISOString()
      });
      
      toast({
        title: `Risk ${isEditing ? 'Updated' : 'Added'}`,
        description: `${title} has been ${isEditing ? 'updated' : 'added'} successfully.`,
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving risk:', error);
      toast.error('Failed to save risk', {
        description: 'An error occurred while saving the risk.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Risk' : 'Add Risk'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
            <Input
              id="title"
              placeholder="Risk title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the risk"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="severity">Severity</Label>
              <Select value={severity} onValueChange={(value) => setSeverity(value as ProjectRisk['severity'])}>
                <SelectTrigger>
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="impact">Impact</Label>
              <Select value={impact} onValueChange={(value) => setImpact(value as ProjectRisk['impact'])}>
                <SelectTrigger>
                  <SelectValue placeholder="Select impact" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="probability">
              Probability: {probability}%
            </Label>
            <Slider
              id="probability"
              defaultValue={[typeof probability === 'string' ? 50 : probability]}
              max={100}
              step={1}
              onValueChange={(values) => setProbability(values[0])}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as ProjectRisk['status'])}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="mitigated">Mitigated</SelectItem>
                <SelectItem value="occurred">Occurred</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="mitigationPlan">Mitigation Plan</Label>
            <Textarea
              id="mitigationPlan"
              placeholder="Describe how this risk will be mitigated"
              value={mitigationPlan}
              onChange={(e) => setMitigationPlan(e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ownerName">Risk Owner</Label>
            <Input
              id="ownerName"
              placeholder="Risk owner name"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
            />
          </div>
          
          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !title}>
              {isSubmitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Risk'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectRiskDialog;
