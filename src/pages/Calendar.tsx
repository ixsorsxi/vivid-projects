
import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Task } from '@/lib/types/task';
import { Project } from '@/lib/types/project';
import { useNavigate } from 'react-router-dom';
import useTaskManagement from '@/hooks/tasks/useTaskManagement';
import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ViewIcon } from '@/components/icons/ViewIcon';

// Import interface for project type
import { ProjectType as ProjectCalendarType } from '@/types/project';

// Setup the localizer
const localizer = momentLocalizer(moment);

// CalendarEvent represents the event in the calendar
interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resource: any;
  type: 'task' | 'project' | 'milestone';
  status: string;
  priority?: string;
}

const CalendarPage: React.FC = () => {
  const navigate = useNavigate();
  const { tasks, projects } = useTaskManagement();
  const [view, setView] = useState<'month' | 'week' | 'day' | 'agenda'>('month');
  const [date, setDate] = useState(new Date());

  // Convert tasks to calendar events
  const taskEvents: CalendarEvent[] = tasks.map((task) => {
    const dueDate = task.due_date ? new Date(task.due_date) : 
                    task.dueDate ? new Date(task.dueDate) : new Date();
    
    // Create a copy of the end date and set it to end of day
    const endDate = new Date(dueDate);
    endDate.setHours(23, 59, 59);
    
    return {
      id: task.id,
      title: task.title,
      start: dueDate,
      end: endDate,
      allDay: true,
      resource: task,
      type: 'task',
      status: task.status,
      priority: task.priority
    };
  });

  // Convert projects to calendar events
  const projectEvents: CalendarEvent[] = projects.map((project) => {
    const dueDate = new Date(project.dueDate);
    
    // Create a copy of the end date and set it to end of day
    const endDate = new Date(dueDate);
    endDate.setHours(23, 59, 59);
    
    return {
      id: project.id,
      title: project.name,
      start: dueDate,
      end: endDate,
      allDay: true,
      resource: project,
      type: 'project',
      status: project.status
    };
  });

  // Combine all events
  const events = [...taskEvents, ...projectEvents];

  // Handle event selection
  const handleSelectEvent = (event: CalendarEvent) => {
    if (event.type === 'task') {
      // Open task details
      // Implementation depends on your routing structure
      console.log('Selected task:', event.resource);
    } else if (event.type === 'project') {
      // Navigate to project details
      navigate(`/projects/${event.resource.id}`);
    } else if (event.type === 'milestone') {
      // Navigate to milestone or open milestone details
      navigate(`/projects/${event.resource.project_id}`);
    }
  };

  // Custom event styles based on status and priority
  const eventStyleGetter = (event: CalendarEvent) => {
    let backgroundColor = '#3788d8';
    let borderColor = '#2c6cb0';
    
    if (event.type === 'task') {
      if (event.status === 'done' || event.status === 'completed') {
        backgroundColor = '#4caf50';
        borderColor = '#388e3c';
      } else if (event.priority === 'high' || event.priority === 'urgent') {
        backgroundColor = '#f44336';
        borderColor = '#d32f2f';
      } else if (event.priority === 'medium') {
        backgroundColor = '#ff9800';
        borderColor = '#f57c00';
      }
    } else if (event.type === 'project') {
      if (event.status === 'completed') {
        backgroundColor = '#8bc34a';
        borderColor = '#689f38';
      } else if (event.status === 'on-hold') {
        backgroundColor = '#9e9e9e';
        borderColor = '#757575';
      } else {
        backgroundColor = '#673ab7';
        borderColor = '#512da8';
      }
    }
    
    return {
      style: {
        backgroundColor,
        borderColor,
        opacity: 0.8,
        color: 'white',
        border: 'none',
        display: 'block'
      }
    };
  };

  // Custom toolbar component
  const CustomToolbar = ({ label }: any) => (
    <div className="flex justify-between items-center mb-4">
      <div className="text-lg font-semibold">{label}</div>
      <div className="flex gap-2">
        <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
          Tasks: {taskEvents.length}
        </Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
          Projects: {projectEvents.length}
        </Badge>
      </div>
      <div className="flex gap-2">
        <Badge
          variant={view === 'month' ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => setView('month')}
        >
          Month
        </Badge>
        <Badge
          variant={view === 'week' ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => setView('week')}
        >
          Week
        </Badge>
        <Badge
          variant={view === 'day' ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => setView('day')}
        >
          Day
        </Badge>
        <Badge
          variant={view === 'agenda' ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => setView('agenda')}
        >
          Agenda
        </Badge>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Calendar</h1>
        </div>
        
        <Card className="p-4 md:p-6 bg-background">
          <CustomToolbar label={moment(date).format('MMMM YYYY')} />
          
          <div className="h-[700px]">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              onSelectEvent={handleSelectEvent}
              eventPropGetter={eventStyleGetter}
              view={view}
              onView={(newView: any) => setView(newView)}
              date={date}
              onNavigate={setDate}
              views={['month', 'week', 'day', 'agenda']}
              popup
              components={{
                event: (props) => (
                  <div className="px-1 truncate">
                    <span className="mr-1">
                      {props.event.type === 'task' ? '📝' : '📂'}
                    </span>
                    {props.title}
                  </div>
                )
              }}
            />
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CalendarPage;
