
import React from 'react';
import PageContainer from '@/components/PageContainer';
import { 
  TimerCard, 
  TimeEntriesCard, 
  WeeklySummaryCard, 
  ProjectHoursCard,
  TimeEntry,
  WeeklySummaryItem,
  ProjectHours
} from '@/components/time-tracking';

const TimeTracking: React.FC = () => {
  // Mock time entries data
  const timeEntries: TimeEntry[] = [
    { 
      id: '1', 
      task: 'Website Redesign', 
      project: 'Website Redesign',
      date: 'Today',
      startTime: '09:00 AM',
      endTime: '11:30 AM',
      duration: '2h 30m',
      status: 'completed',
      user: 'John Doe',
    },
    { 
      id: '2', 
      task: 'API Integration', 
      project: 'Mobile App Development',
      date: 'Today',
      startTime: '12:30 PM',
      endTime: 'Running',
      duration: '1h 15m',
      status: 'running',
      user: 'John Doe',
    },
    { 
      id: '3', 
      task: 'UI Design Review', 
      project: 'Website Redesign',
      date: 'Yesterday',
      startTime: '02:00 PM',
      endTime: '04:15 PM',
      duration: '2h 15m',
      status: 'completed',
      user: 'Jane Smith',
    },
    { 
      id: '4', 
      task: 'Client Meeting', 
      project: 'Marketing Campaign',
      date: 'Yesterday',
      startTime: '10:00 AM',
      endTime: '11:00 AM',
      duration: '1h 0m',
      status: 'completed',
      user: 'Emily Davis',
    },
    { 
      id: '5', 
      task: 'Database Optimization', 
      project: 'Website Redesign',
      date: '2 days ago',
      startTime: '03:00 PM',
      endTime: '06:30 PM',
      duration: '3h 30m',
      status: 'completed',
      user: 'Robert Johnson',
    },
  ];
  
  // Weekly summary data
  const weeklySummary: WeeklySummaryItem[] = [
    { day: 'Mon', hours: 8.5 },
    { day: 'Tue', hours: 7.2 },
    { day: 'Wed', hours: 9.0 },
    { day: 'Thu', hours: 6.5 },
    { day: 'Fri', hours: 5.0 },
    { day: 'Sat', hours: 2.0 },
    { day: 'Sun', hours: 0 },
  ];
  
  // Project hours data
  const projectHours: ProjectHours[] = [
    { project: 'Website Redesign', hours: 24.5, color: 'bg-blue-500' },
    { project: 'Mobile App Development', hours: 12.0, color: 'bg-green-500' },
    { project: 'Marketing Campaign', hours: 8.5, color: 'bg-purple-500' },
    { project: 'Product Launch', hours: 3.0, color: 'bg-amber-500' },
  ];
  
  return (
    <PageContainer 
      title="Time Tracking" 
      subtitle="Monitor and manage working hours"
    >
      <div className="space-y-6">
        {/* Timer card */}
        <TimerCard />
        
        {/* Time entries card */}
        <TimeEntriesCard entries={timeEntries} />
        
        {/* Analytics cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <WeeklySummaryCard data={weeklySummary} />
          <ProjectHoursCard projects={projectHours} />
        </div>
      </div>
    </PageContainer>
  );
};

export default TimeTracking;
