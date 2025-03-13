import React, { useState, useEffect } from 'react';
import PageContainer from '@/components/PageContainer';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ChevronLeft, 
  ChevronRight,
  PlusCircle,
  Clock,
  MapPin,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, addMonths, subMonths, isSameDay, parseISO } from 'date-fns';
import { demoEvents, CalendarEvent } from '@/lib/event-data';
import { demoProjects } from '@/lib/data';
import { toast } from '@/components/ui/toast-wrapper';
import NewEventDialog from '@/components/calendar/NewEventDialog';

const Calendar = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<"day" | "week" | "month" | "year">("month");
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>(demoEvents);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dayEvents, setDayEvents] = useState<CalendarEvent[]>([]);
  const [isNewEventOpen, setIsNewEventOpen] = useState(false);
  
  // Filter events when project selection changes
  useEffect(() => {
    if (selectedProject === "all") {
      setFilteredEvents(demoEvents);
    } else {
      setFilteredEvents(demoEvents.filter(event => event.projectId === selectedProject));
    }
  }, [selectedProject]);
  
  // Update day events when selected date changes
  useEffect(() => {
    const events = filteredEvents.filter(event => 
      isSameDay(event.start, selectedDate)
    );
    setDayEvents(events);
  }, [selectedDate, filteredEvents]);
  
  const handlePreviousMonth = () => setDate(subMonths(date, 1));
  const handleNextMonth = () => setDate(addMonths(date, 1));
  const handleToday = () => {
    const today = new Date();
    setDate(today);
    setSelectedDate(today);
  };

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setSelectedDate(newDate);
    }
  };

  const handleAddEvent = (newEvent: Partial<CalendarEvent>) => {
    // Generate a unique ID
    const eventId = `event-${Date.now()}`;
    
    // Create color based on project if available
    let color;
    if (newEvent.projectId) {
      const projectName = demoProjects.find(p => p.id === newEvent.projectId)?.name || '';
      // Simple hash function to generate a consistent color
      const colors = [
        'bg-blue-500',
        'bg-green-500',
        'bg-yellow-500',
        'bg-purple-500',
        'bg-pink-500',
        'bg-indigo-500',
        'bg-red-500',
      ];
      
      const hash = projectName.split('').reduce((acc, char) => {
        return acc + char.charCodeAt(0);
      }, 0);
      
      color = colors[hash % colors.length];
    }
    
    // Create the new event
    const fullEvent: CalendarEvent = {
      id: eventId,
      title: newEvent.title || 'Untitled Event',
      description: newEvent.description,
      start: newEvent.start || new Date(),
      end: newEvent.end || new Date(),
      project: newEvent.project,
      projectId: newEvent.projectId,
      color,
      attendees: newEvent.attendees || [],
    };
    
    // Add to events list
    const updatedEvents = [...filteredEvents, fullEvent];
    demoEvents.push(fullEvent); // Add to the master list
    setFilteredEvents(updatedEvents);
    
    // Update day events if the new event is on the selected date
    if (isSameDay(fullEvent.start, selectedDate)) {
      setDayEvents([...dayEvents, fullEvent]);
    }
    
    toast("Event Added", {
      description: `"${fullEvent.title}" has been added to your calendar`,
    });
  };

  return (
    <PageContainer 
      title="Calendar" 
      subtitle="Schedule and manage project timelines"
    >
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <h2 className="text-xl font-semibold">
              {format(date, 'MMMM yyyy')}
            </h2>
            <Button variant="outline" size="sm" onClick={handleToday}>
              Today
            </Button>
          </div>
          
          <div className="flex items-center gap-3">
            <Tabs value={view} onValueChange={(v) => setView(v as "day" | "week" | "month" | "year")}>
              <TabsList>
                <TabsTrigger value="day">Day</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="year">Year</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Select 
              value={selectedProject} 
              onValueChange={setSelectedProject}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Filter Projects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {demoProjects.map(project => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button 
              className="gap-2"
              onClick={() => setIsNewEventOpen(true)}
            >
              <PlusCircle className="h-4 w-4" />
              <span>New Event</span>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              month={date}
              onMonthChange={setDate}
              className="rounded-md border pointer-events-auto"
              showOutsideDays={true}
            />
          </div>
          
          <div className="md:col-span-1">
            <Card>
              <div className="p-4 border-b">
                <h3 className="text-lg font-medium">
                  Events for {format(selectedDate, 'MMMM d, yyyy')}
                </h3>
              </div>
              <div className="p-4">
                {dayEvents.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">
                    No events scheduled for this day
                  </p>
                ) : (
                  <div className="space-y-4">
                    {dayEvents.map(event => (
                      <div key={event.id} className="border rounded-lg overflow-hidden">
                        <div className={`h-2 ${event.color || 'bg-primary'}`} />
                        <div className="p-3">
                          <h4 className="font-medium">{event.title}</h4>
                          {event.description && (
                            <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                          )}
                          <div className="mt-3 flex flex-col gap-1">
                            <div className="flex items-center text-sm">
                              <Clock className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                              <span>
                                {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
                              </span>
                            </div>
                            {event.project && (
                              <div className="flex items-center text-sm">
                                <MapPin className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                                <span>{event.project}</span>
                              </div>
                            )}
                            {event.attendees && event.attendees.length > 0 && (
                              <div className="flex items-center text-sm">
                                <Users className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                                <span>{event.attendees.length} attendees</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </Card>
      
      {/* New Event Dialog */}
      <NewEventDialog 
        open={isNewEventOpen}
        onOpenChange={setIsNewEventOpen}
        onAddEvent={handleAddEvent}
        projects={demoProjects}
      />
    </PageContainer>
  );
};

export default Calendar;
