
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { CalendarEvent } from '@/lib/event-data';
import { CalendarIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface NewEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddEvent: (event: Partial<CalendarEvent>) => void;
  projects: { id: string; name: string }[];
}

const NewEventDialog: React.FC<NewEventDialogProps> = ({
  open,
  onOpenChange,
  onAddEvent,
  projects
}) => {
  const { toast } = useToast();
  const today = new Date();
  
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    title: '',
    description: '',
    start: today,
    end: new Date(today.getTime() + 60 * 60 * 1000), // 1 hour later
    projectId: '',
  });

  const [startDate, setStartDate] = useState<Date>(today);
  const [endDate, setEndDate] = useState<Date>(new Date(today.getTime() + 60 * 60 * 1000));
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');

  // Reset form when dialog is opened
  React.useEffect(() => {
    if (open) {
      const now = new Date();
      const startHour = now.getHours();
      const endHour = startHour + 1;
      
      setStartDate(now);
      setEndDate(now);
      setStartTime(`${startHour.toString().padStart(2, '0')}:00`);
      setEndTime(`${endHour.toString().padStart(2, '0')}:00`);
      
      setNewEvent({
        title: '',
        description: '',
        start: now,
        end: new Date(now.getTime() + 60 * 60 * 1000),
        projectId: '',
      });
    }
  }, [open]);

  const handleStartDateChange = (date: Date | undefined) => {
    if (!date) return;
    setStartDate(date);
    updateDateTimes(date, endDate, startTime, endTime);
  };

  const handleEndDateChange = (date: Date | undefined) => {
    if (!date) return;
    setEndDate(date);
    updateDateTimes(startDate, date, startTime, endTime);
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartTime(e.target.value);
    updateDateTimes(startDate, endDate, e.target.value, endTime);
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndTime(e.target.value);
    updateDateTimes(startDate, endDate, startTime, e.target.value);
  };

  const updateDateTimes = (
    start: Date,
    end: Date,
    startTimeStr: string,
    endTimeStr: string
  ) => {
    const [startHours, startMinutes] = startTimeStr.split(':').map(Number);
    const [endHours, endMinutes] = endTimeStr.split(':').map(Number);

    const newStartDate = new Date(start);
    newStartDate.setHours(startHours, startMinutes);

    const newEndDate = new Date(end);
    newEndDate.setHours(endHours, endMinutes);

    setNewEvent(prev => ({
      ...prev,
      start: newStartDate,
      end: newEndDate
    }));
  };

  const handleAddEvent = () => {
    if (!newEvent.title) {
      toast({
        title: "Error",
        description: "Event title is required",
        variant: "destructive",
      });
      return;
    }

    // Find the project name if a project is selected
    if (newEvent.projectId) {
      const selectedProject = projects.find(p => p.id === newEvent.projectId);
      if (selectedProject) {
        newEvent.project = selectedProject.name;
      }
    }

    onAddEvent(newEvent);
    onOpenChange(false);
    
    toast({
      title: "Success",
      description: "New event has been added",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Event</DialogTitle>
          <DialogDescription>
            Create a new event in your calendar. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title*
            </Label>
            <Input
              id="title"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              className="col-span-3"
              placeholder="Enter event title"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={newEvent.description || ''}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              className="col-span-3"
              placeholder="Add details about the event"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="project" className="text-right">
              Project
            </Label>
            <Select 
              value={newEvent.projectId} 
              onValueChange={(value) => setNewEvent({ ...newEvent, projectId: value })}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {projects.map(project => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Start Date and Time */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Start
            </Label>
            <div className="col-span-3 grid grid-cols-2 gap-2">
              <div className="relative">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={handleStartDateChange}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="time"
                  value={startTime}
                  onChange={handleStartTimeChange}
                  className="pl-9"
                />
              </div>
            </div>
          </div>
          
          {/* End Date and Time */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              End
            </Label>
            <div className="col-span-3 grid grid-cols-2 gap-2">
              <div className="relative">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={handleEndDateChange}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="time"
                  value={endTime}
                  onChange={handleEndTimeChange}
                  className="pl-9"
                />
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" onClick={handleAddEvent}>Add Event</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewEventDialog;
