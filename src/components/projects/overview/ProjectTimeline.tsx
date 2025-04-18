
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Calendar, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { formatDistance } from "date-fns";
import { ProjectMilestone } from "@/lib/types/project";
import { useProjectMilestones } from "@/hooks/project/useProjectMilestones";
import ProjectMilestoneDialog from "./ProjectMilestoneDialog";

interface ProjectTimelineProps {
  projectId: string;
}

export function ProjectTimeline({ projectId }: ProjectTimelineProps) {
  const { milestones, addMilestone, updateMilestone, isLoading } = useProjectMilestones(projectId);
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  
  // Sort milestones by due date
  const sortedMilestones = [...milestones].sort((a, b) => {
    return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
  });
  
  // Get today's date
  const today = new Date();
  
  // Completed count
  const completedCount = milestones.filter(m => m.status === 'completed').length;
  const totalCount = milestones.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  
  // Get the next upcoming milestone
  const upcomingMilestone = sortedMilestones.find(m => 
    m.status !== 'completed' && new Date(m.due_date) >= today
  );
  
  // Get status badge configuration
  const getStatusBadge = (status: string, dueDate: string) => {
    const dueDateTime = new Date(dueDate).getTime();
    const isOverdue = dueDateTime < today.getTime() && status !== 'completed';
    
    if (isOverdue) {
      return {
        label: 'Overdue',
        variant: 'destructive' as const,
        icon: <AlertTriangle className="h-3 w-3 mr-1" />
      };
    }
    
    switch (status) {
      case 'completed':
        return {
          label: 'Completed',
          variant: 'default' as const,
          icon: <CheckCircle className="h-3 w-3 mr-1" />
        };
      case 'in-progress':
        return {
          label: 'In Progress',
          variant: 'secondary' as const,
          icon: <Clock className="h-3 w-3 mr-1" />
        };
      case 'delayed':
        return {
          label: 'Delayed',
          variant: 'destructive' as const,
          icon: <AlertTriangle className="h-3 w-3 mr-1" />
        };
      default:
        return {
          label: 'Not Started',
          variant: 'outline' as const,
          icon: <Calendar className="h-3 w-3 mr-1" />
        };
    }
  };
  
  const markMilestoneComplete = async (id: string) => {
    await updateMilestone(id, { 
      status: 'completed', 
      completion_date: new Date().toISOString() 
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Project Timeline</CardTitle>
        <Button 
          size="sm" 
          onClick={() => setShowAddMilestone(true)}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Add Milestone
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <p className="text-muted-foreground">Loading milestones...</p>
          </div>
        ) : milestones.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-muted-foreground mb-2">No milestones added yet</p>
            <Button variant="outline" size="sm" onClick={() => setShowAddMilestone(true)}>
              Add First Milestone
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium">Progress</h4>
                <span className="text-sm font-medium">{completionRate}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary" 
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{completedCount} completed</span>
                <span>{totalCount} total</span>
              </div>
            </div>
            
            {upcomingMilestone && (
              <div className="p-4 border rounded-lg">
                <h4 className="text-sm font-medium">Next Milestone</h4>
                <div className="mt-2">
                  <p className="font-medium">{upcomingMilestone.title}</p>
                  <div className="flex items-center justify-between mt-1">
                    <Badge variant="outline" className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      Due {formatDistance(new Date(upcomingMilestone.due_date), today, { addSuffix: true })}
                    </Badge>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => markMilestoneComplete(upcomingMilestone.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Mark Complete
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="relative">
              <div className="absolute left-3.5 top-3 bottom-3 w-px bg-border"></div>
              
              <div className="space-y-6 relative">
                {sortedMilestones.map((milestone) => {
                  const statusBadge = getStatusBadge(milestone.status, milestone.due_date);
                  const isPast = new Date(milestone.due_date) < today;
                  const isNotStarted = milestone.status === 'not-started';
                  const isDelayed = milestone.status === 'delayed';
                  const needsAttention = (isPast && isNotStarted) || isDelayed;
                  
                  return (
                    <div 
                      key={milestone.id} 
                      className={`pl-8 relative ${needsAttention ? 'bg-amber-50/30 -mx-4 px-4 py-2 rounded-md border-l-2 border-amber-500' : ''}`}
                    >
                      <div className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-primary"></div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <h4 className="font-medium">{milestone.title}</h4>
                          {milestone.description && (
                            <p className="text-sm text-muted-foreground">{milestone.description}</p>
                          )}
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                          <Badge variant={statusBadge.variant} className="flex items-center">
                            {statusBadge.icon}
                            {statusBadge.label}
                          </Badge>
                          
                          <Badge variant="outline" className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(milestone.due_date).toLocaleDateString()}
                          </Badge>
                          
                          {milestone.status !== 'completed' && !milestone.status.includes('blocked') && (
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => markMilestoneComplete(milestone.id)}
                              className="ml-auto"
                            >
                              <CheckCircle className="h-3.5 w-3.5 mr-1" />
                              Complete
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        
        <ProjectMilestoneDialog
          open={showAddMilestone}
          onOpenChange={setShowAddMilestone}
          projectId={projectId}
          onAddMilestone={addMilestone}
        />
      </CardContent>
    </Card>
  );
}
