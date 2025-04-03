
import React, { useState } from 'react';
import { format, differenceInCalendarDays } from 'date-fns';
import { Calendar, CalendarX, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProjectMilestone } from '@/lib/types/project';
import ProjectMilestoneDialog from './ProjectMilestoneDialog';
import { updateProjectMilestone } from '@/api/projects/modules/projectData';
import { toast } from '@/components/ui/toast-wrapper';
import { useQueryClient } from '@tanstack/react-query';

interface ProjectTimelineProps {
  startDate?: string;
  dueDate: string;
  milestones: ProjectMilestone[];
  projectId?: string;
}

const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ 
  startDate, 
  dueDate, 
  milestones,
  projectId = ''
}) => {
  const queryClient = useQueryClient();
  const [addMilestoneOpen, setAddMilestoneOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<ProjectMilestone | undefined>(undefined);
  const [editMilestoneOpen, setEditMilestoneOpen] = useState(false);
  
  // Parse dates for calculations
  const startDateObj = startDate ? new Date(startDate) : new Date();
  const dueDateObj = new Date(dueDate);

  // Calculate project duration
  const totalDuration = differenceInCalendarDays(dueDateObj, startDateObj) + 1;
  
  // Helper to format dates
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Handle milestone status toggle
  const toggleMilestoneStatus = async (milestone: ProjectMilestone) => {
    const newStatus = milestone.status === 'completed' ? 'in-progress' : 'completed';
    const updates = { 
      status: newStatus,
      completion_date: newStatus === 'completed' ? new Date().toISOString() : null
    };
    
    try {
      const success = await updateProjectMilestone(milestone.id, updates);
      if (success) {
        toast.success(`Milestone ${newStatus === 'completed' ? 'completed' : 'reopened'}`, {
          description: `The milestone has been marked as ${newStatus}`
        });
        
        // Refresh milestones data
        queryClient.invalidateQueries({ queryKey: ['project-milestones', projectId] });
      }
    } catch (error) {
      console.error('Error updating milestone status:', error);
      toast.error('Could not update milestone', {
        description: 'Please try again later'
      });
    }
  };

  // Open edit dialog with selected milestone
  const handleEditMilestone = (milestone: ProjectMilestone) => {
    setSelectedMilestone(milestone);
    setEditMilestoneOpen(true);
  };
  
  // Sort milestones by due date
  const sortedMilestones = [...milestones].sort((a, b) => 
    new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b pb-2">
        <h3 className="font-semibold text-base">Project Timeline</h3>
        {projectId && (
          <Button 
            variant="outline" 
            size="sm"
            className="h-8"
            onClick={() => setAddMilestoneOpen(true)}
          >
            Add Milestone
          </Button>
        )}
      </div>
      
      <div className="space-y-1 pt-2">
        <div className="grid grid-cols-4 gap-4 mb-3">
          <div className="col-span-1 text-xs text-muted-foreground">Start Date</div>
          <div className="col-span-3 text-sm font-medium">
            {startDate ? formatDate(startDate) : 'Not set'}
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-4 mb-3">
          <div className="col-span-1 text-xs text-muted-foreground">Due Date</div>
          <div className="col-span-3 text-sm font-medium">
            {formatDate(dueDate)}
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-4 mb-3">
          <div className="col-span-1 text-xs text-muted-foreground">Duration</div>
          <div className="col-span-3 text-sm font-medium">
            {totalDuration} days
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <h4 className="text-sm font-medium mb-3">Milestones</h4>
        
        {sortedMilestones.length > 0 ? (
          <div className="space-y-3">
            {sortedMilestones.map((milestone) => {
              const milestoneDate = new Date(milestone.due_date);
              const isCompleted = milestone.status === 'completed';
              const isOverdue = !isCompleted && milestoneDate < new Date() && milestone.status !== 'blocked';
              
              return (
                <div 
                  key={milestone.id}
                  className={`p-3 rounded-lg border ${
                    isCompleted 
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30' 
                      : isOverdue 
                        ? 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30'
                        : 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-1.5 rounded-full ${
                      isCompleted 
                        ? 'bg-green-100 dark:bg-green-800/40' 
                        : isOverdue 
                          ? 'bg-red-100 dark:bg-red-800/40'
                          : 'bg-blue-100 dark:bg-blue-800/40'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                      ) : isOverdue ? (
                        <CalendarX className="h-4 w-4 text-red-600 dark:text-red-400" />
                      ) : (
                        <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h5 className="font-medium text-sm">{milestone.title}</h5>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Due: {formatDate(milestone.due_date)}
                          </p>
                        </div>
                        
                        {projectId && (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => toggleMilestoneStatus(milestone)}
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                isCompleted 
                                  ? 'bg-green-100 dark:bg-green-800/40 text-green-700 dark:text-green-300' 
                                  : 'bg-blue-100 dark:bg-blue-800/40 text-blue-700 dark:text-blue-300'
                              }`}
                            >
                              {isCompleted ? 'Completed' : 'Mark Complete'}
                            </button>
                            <button
                              onClick={() => handleEditMilestone(milestone)}
                              className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800/40 text-gray-700 dark:text-gray-300"
                            >
                              Edit
                            </button>
                          </div>
                        )}
                      </div>
                      
                      {milestone.description && (
                        <p className="text-xs mt-1">{milestone.description}</p>
                      )}
                      
                      {milestone.completion_date && (
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                          Completed on {formatDate(milestone.completion_date)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <Clock className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No milestones defined yet</p>
            {projectId && (
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => setAddMilestoneOpen(true)}
              >
                Add First Milestone
              </Button>
            )}
          </div>
        )}
      </div>
      
      {/* Add Milestone Dialog */}
      {projectId && (
        <ProjectMilestoneDialog
          open={addMilestoneOpen}
          onOpenChange={setAddMilestoneOpen}
          projectId={projectId}
        />
      )}
      
      {/* Edit Milestone Dialog */}
      {projectId && selectedMilestone && (
        <ProjectMilestoneDialog
          open={editMilestoneOpen}
          onOpenChange={setEditMilestoneOpen}
          projectId={projectId}
          milestone={selectedMilestone}
          isEditing={true}
        />
      )}
    </div>
  );
};

export default ProjectTimeline;
