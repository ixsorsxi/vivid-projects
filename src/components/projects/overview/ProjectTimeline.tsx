
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { format, parseISO, differenceInDays } from 'date-fns';
import { ProjectMilestone } from '@/lib/types/project';

interface ProjectTimelineProps {
  startDate?: string;
  dueDate: string;
  milestones: ProjectMilestone[];
}

const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ 
  startDate, 
  dueDate, 
  milestones = [] 
}) => {
  // Fallback to 30 days before dueDate if startDate is not provided
  const actualStartDate = startDate 
    ? parseISO(startDate) 
    : parseISO(dueDate) ? new Date(parseISO(dueDate).getTime() - 30 * 24 * 60 * 60 * 1000) : new Date();
  
  const actualDueDate = parseISO(dueDate) || new Date(actualStartDate.getTime() + 30 * 24 * 60 * 60 * 1000);
  
  // Calculate project duration
  const totalDuration = differenceInDays(actualDueDate, actualStartDate);
  
  // Generate a data structure for the chart
  const timelineData = [
    {
      name: 'Project Timeline',
      start: 0,
      duration: totalDuration,
      fill: '#60a5fa'
    },
    ...milestones.map((milestone, index) => ({
      name: milestone.title,
      start: differenceInDays(parseISO(milestone.due_date), actualStartDate),
      duration: 1, // Milestones are points in time
      fill: milestone.status === 'completed' ? '#10b981' : '#f59e0b'
    }))
  ];
  
  // Format the milestones data for display
  const formattedMilestones = milestones.map(milestone => ({
    ...milestone,
    formattedDueDate: milestone.due_date 
      ? format(parseISO(milestone.due_date), 'MMM d, yyyy')
      : 'No date set',
    statusClass: 
      milestone.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
      milestone.status === 'in-progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
      'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
  }));
  
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-base border-b pb-2">Project Timeline</h3>
      
      <div className="aspect-video w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={timelineData}
            margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="number" 
              label={{ value: 'Days', position: 'insideBottom', offset: -10 }} 
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              formatter={(value, name, props) => {
                if (name === 'start') return [`Day ${value}`, 'Start'];
                if (name === 'duration') {
                  if (props.payload.name === 'Project Timeline') {
                    return [`${value} days`, 'Duration'];
                  }
                  return ['Milestone', ''];
                }
                return [value, name];
              }}
            />
            <Legend />
            <Bar dataKey="duration" stackId="a" fill="#60a5fa" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4">
        <h4 className="font-medium text-sm mb-2">Key Milestones</h4>
        {formattedMilestones.length > 0 ? (
          <div className="space-y-2">
            {formattedMilestones.map((milestone) => (
              <div key={milestone.id} className="flex justify-between items-center p-2 rounded bg-gray-50 dark:bg-gray-800">
                <div>
                  <span className="font-medium">{milestone.title}</span>
                  <p className="text-xs text-muted-foreground">{milestone.formattedDueDate}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${milestone.statusClass}`}>
                  {milestone.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No milestones have been added yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProjectTimeline;
