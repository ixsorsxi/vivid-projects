import { demoProjects } from './data/demoProjects';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  project?: string;
  projectId?: string;
  color?: string;
  attendees?: { name: string }[];
}

// Generate color based on project name for consistency
function generateColor(projectName: string): string {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-red-500',
  ];
  
  // Simple hash function to assign consistent colors
  const hash = projectName.split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);
  
  return colors[hash % colors.length];
}

// Helper function to get project attendees
function getProjectAttendees(project: any): { name: string }[] {
  if (project.members) {
    return project.members;
  }
  if (project.team) {
    return project.team.map((member: any) => ({ name: member.name }));
  }
  return [];
}

// Create demo events from projects
export const demoEvents: CalendarEvent[] = [
  // Project kickoff meetings
  ...demoProjects.map((project, index) => {
    // Create a date for the kickoff, starting from today and spacing them out
    const kickoffDate = new Date();
    kickoffDate.setDate(kickoffDate.getDate() + index * 2);
    kickoffDate.setHours(10, 0, 0, 0);
    
    const endDate = new Date(kickoffDate);
    endDate.setHours(11, 30, 0, 0);
    
    return {
      id: `kickoff-${project.id}`,
      title: `${project.name} Kickoff`,
      description: `Initial planning meeting for ${project.name}`,
      start: kickoffDate,
      end: endDate,
      project: project.name,
      projectId: project.id,
      color: generateColor(project.name),
      attendees: getProjectAttendees(project),
    };
  }),
  
  // Add some project milestones
  {
    id: 'milestone-1',
    title: 'Website Design Review',
    description: 'Review design mockups with stakeholders',
    start: (() => {
      const date = new Date();
      date.setDate(date.getDate() + 5);
      date.setHours(14, 0, 0, 0);
      return date;
    })(),
    end: (() => {
      const date = new Date();
      date.setDate(date.getDate() + 5);
      date.setHours(15, 30, 0, 0);
      return date;
    })(),
    project: 'Website Redesign',
    projectId: '1',
    color: generateColor('Website Redesign'),
    attendees: getProjectAttendees(demoProjects[0]),
  },
  
  {
    id: 'milestone-2',
    title: 'Mobile App Prototype',
    description: 'Present interactive prototype to product team',
    start: (() => {
      const date = new Date();
      date.setDate(date.getDate() + 7);
      date.setHours(11, 0, 0, 0);
      return date;
    })(),
    end: (() => {
      const date = new Date();
      date.setDate(date.getDate() + 7);
      date.setHours(12, 0, 0, 0);
      return date;
    })(),
    project: 'Mobile App Development',
    projectId: '2',
    color: generateColor('Mobile App Development'),
    attendees: getProjectAttendees(demoProjects[1]),
  },
  
  // Add some all day events
  {
    id: 'allday-1',
    title: 'Marketing Campaign Launch',
    start: (() => {
      const date = new Date();
      date.setDate(date.getDate() + 3);
      date.setHours(0, 0, 0, 0);
      return date;
    })(),
    end: (() => {
      const date = new Date();
      date.setDate(date.getDate() + 3);
      date.setHours(23, 59, 59, 0);
      return date;
    })(),
    allDay: true,
    project: 'Marketing Campaign',
    projectId: '3',
    color: generateColor('Marketing Campaign'),
  },
  
  // Add more regular meetings
  {
    id: 'meeting-1',
    title: 'Weekly Team Sync',
    description: 'Regular team status update meeting',
    start: (() => {
      const date = new Date();
      date.setDate(date.getDate() + 1);
      date.setHours(9, 0, 0, 0);
      return date;
    })(),
    end: (() => {
      const date = new Date();
      date.setDate(date.getDate() + 1);
      date.setHours(10, 0, 0, 0);
      return date;
    })(),
    project: 'All Projects',
    attendees: [
      { name: 'John Doe' },
      { name: 'Jane Smith' },
      { name: 'Robert Johnson' },
    ],
  },
];
