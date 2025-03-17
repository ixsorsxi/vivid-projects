
export interface TimeEntry {
  id: string;
  task: string;
  project: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  status: 'completed' | 'running';
  user: string;
}

export interface WeeklySummaryItem {
  day: string;
  hours: number;
}

export interface ProjectHours {
  project: string;
  hours: number;
  color: string;
}
