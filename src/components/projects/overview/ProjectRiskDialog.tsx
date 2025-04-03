
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProjectRisk } from '@/lib/types/project';
import { addProjectRisk, updateProjectRisk } from '@/api/projects/modules/projectData';
import { toast } from '@/components/ui/toast-wrapper';
import { useQueryClient } from '@tanstack/react-query';

interface ProjectRiskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  risk?: ProjectRisk;
  isEditing?: boolean;
}

const ProjectRiskDialog: React.FC<ProjectRiskDialogProps> = ({
  open,
  onOpenChange,
  projectId,
  risk,
  isEditing = false
}) => {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: risk?.title || '',
    description: risk?.description || '',
    severity: risk?.severity || 'medium',
    probability: risk?.probability || 'medium',
    impact: risk?.impact || 'medium',
    mitigation_plan: risk?.mitigation_plan || '',
    status: risk?.status || 'active'
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title) {
      toast.error('Missing required fields', {
        description: 'Please provide a title for the risk'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing && risk) {
        const success = await updateProjectRisk(risk.id, formData);
        if (success) {
          toast.success('Risk updated', {
            description: 'The risk has been updated successfully'
          });
        } else {
          throw new Error('Failed to update risk');
        }
      } else {
        const result = await addProjectRisk(projectId, formData);
        if (result) {
          toast.success('Risk created', {
            description: 'The risk has been added to the project'
          });
        } else {
          throw new Error('Failed to create risk');
        }
      }
      
      // Invalidate queries to refresh data
      await queryClient.invalidateQueries({ queryKey: ['project-risks', projectId] });
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving risk:', error);
      toast.error('Error saving risk', {
        description: 'Please try again later'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Risk' : 'Add New Risk'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title*</Label>
            <Input 
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Risk title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe the risk"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="severity">Severity</Label>
              <Select 
                value={formData.severity} 
                onValueChange={(value) => handleChange('severity', value)}
              >
                <SelectTrigger id="severity">
                  <SelectValue placeholder="Severity" />
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
              <Label htmlFor="probability">Probability</Label>
              <Select 
                value={formData.probability} 
                onValueChange={(value) => handleChange('probability', value)}
              >
                <SelectTrigger id="probability">
                  <SelectValue placeholder="Probability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="impact">Impact</Label>
              <Select 
                value={formData.impact} 
                onValueChange={(value) => handleChange('impact', value)}
              >
                <SelectTrigger id="impact">
                  <SelectValue placeholder="Impact" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="severe">Severe</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="mitigation_plan">Mitigation Plan</Label>
            <Textarea 
              id="mitigation_plan"
              value={formData.mitigation_plan}
              onChange={(e) => handleChange('mitigation_plan', e.target.value)}
              placeholder="Steps to mitigate this risk"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value) => handleChange('status', value)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="monitored">Monitored</SelectItem>
                <SelectItem value="mitigated">Mitigated</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Risk' : 'Add Risk'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectRiskDialog;
