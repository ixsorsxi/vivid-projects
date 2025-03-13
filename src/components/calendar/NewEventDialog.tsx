
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast-wrapper";
import { CalendarEvent } from '@/lib/event-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Project } from '@/lib/data';

interface NewEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddEvent: (event: Partial<CalendarEvent>) => void;
  projects: Project[];
}

const NewEventDialog: React.FC<NewEventDialogProps> = ({
  open,
  onOpenChange,
  onAddEvent,
  projects
}) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const [eventData, setEventData] = useState<Partial<CalendarEvent>>({
    title: '',
    description: '',
    start: new Date(),
    end: tomorrow,
    projectId: '',
    attendees: []
  });

  const handleCreateEvent = () => {
    if (!eventData.title) {
      toast.error("Missing information", {
        description: "Please provide a title for the event",
      });
      return;
    }

    if (!eventData.start || !eventData.end) {
      toast.error("Missing information", {
        description: "Please provide start and end times",
      });
      return;
    }
    
    // Add project name if projectId is selected
    let eventWithProject = { ...eventData };
    if (eventData.projectId) {
      const selectedProject = projects.find(p => p.id === eventData.projectId);
      if (selectedProject) {
        eventWithProject.project = selectedProject.name;
      }
    }
    
    onAddEvent(eventWithProject);
    
    // Reset form
    setEventData({
      title: '',
      description: '',
      start: new Date(),
      end: tomorrow,
      projectId: '',
      attendees: []
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Event</DialogTitle>
          <DialogDescription>
            Create a new calendar event. Fill out the details below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              value={eventData.title}
              onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
              placeholder="Enter event title"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={eventData.description}
              onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
              placeholder="Enter event description"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={eventData.start ? new Date(eventData.start).toISOString().slice(0, 16) : ''}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  setEventData({ ...eventData, start: date });
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={eventData.end ? new Date(eventData.end).toISOString().slice(0, 16) : ''}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  setEventData({ ...eventData, end: date });
                }}
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="project">Related Project</Label>
            <Select
              value={eventData.projectId}
              onValueChange={(value) => setEventData({ ...eventData, projectId: value })}
            >
              <SelectTrigger id="project">
                <SelectValue placeholder="Select a project (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No Project</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateEvent}>
            Create Event
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewEventDialog;
