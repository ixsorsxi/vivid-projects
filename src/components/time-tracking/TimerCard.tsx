
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Clock, RotateCcw, Save } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/toast-wrapper';

const TimerCard: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [task, setTask] = useState('');
  const [project, setProject] = useState('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<Date | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    
    return [
      h.toString().padStart(2, '0'),
      m.toString().padStart(2, '0'),
      s.toString().padStart(2, '0')
    ].join(':');
  };

  const startTimer = () => {
    if (!project) {
      toast("Project required", {
        description: "Please select a project before starting the timer",
      });
      return;
    }
    
    if (!task) {
      toast("Task required", {
        description: "Please enter a task description before starting the timer",
      });
      return;
    }
    
    setIsRunning(true);
    startTimeRef.current = new Date();
    
    intervalRef.current = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    
    toast("Timer started", {
      description: `Tracking time for ${task}`,
    });
  };

  const pauseTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
    
    toast("Timer paused", {
      description: `${formatTime(elapsedTime)} recorded so far`,
    });
  };

  const resetTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
    setElapsedTime(0);
    startTimeRef.current = null;
    
    toast("Timer reset", {
      description: "Time tracking has been reset",
    });
  };

  const saveTimeEntry = () => {
    if (elapsedTime < 60) {
      toast("Too short", {
        description: "Time entries must be at least 1 minute long",
      });
      return;
    }
    
    // Here we would normally save the time entry to a database
    toast("Time entry saved", {
      description: `Saved ${formatTime(elapsedTime)} for ${task}`,
    });
    
    // Reset the timer
    resetTimer();
    setTask('');
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Timer</h3>
        <div className="text-3xl font-mono font-semibold tabular-nums">
          {formatTime(elapsedTime)}
        </div>
      </div>
      
      <div className="space-y-4 mb-6">
        <div>
          <label htmlFor="task" className="block text-sm mb-1">Task</label>
          <Input 
            id="task"
            placeholder="What are you working on?" 
            value={task}
            onChange={(e) => setTask(e.target.value)}
            disabled={isRunning}
          />
        </div>
        
        <div>
          <label htmlFor="project" className="block text-sm mb-1">Project</label>
          <Select 
            value={project} 
            onValueChange={setProject}
            disabled={isRunning}
          >
            <SelectTrigger id="project">
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Website Redesign">Website Redesign</SelectItem>
              <SelectItem value="Mobile App Development">Mobile App Development</SelectItem>
              <SelectItem value="Marketing Campaign">Marketing Campaign</SelectItem>
              <SelectItem value="Product Launch">Product Launch</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex gap-2 justify-between">
        {!isRunning ? (
          <Button 
            className="flex-1"
            onClick={startTimer} 
            disabled={!task || !project}
          >
            <Play className="h-4 w-4 mr-2" />
            Start
          </Button>
        ) : (
          <Button 
            className="flex-1" 
            variant="secondary" 
            onClick={pauseTimer}
          >
            <Pause className="h-4 w-4 mr-2" />
            Pause
          </Button>
        )}
        
        <Button 
          variant="outline" 
          onClick={resetTimer}
          disabled={elapsedTime === 0}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="outline" 
          onClick={saveTimeEntry}
          disabled={elapsedTime === 0}
        >
          <Save className="h-4 w-4" />
        </Button>
      </div>
      
      {startTimeRef.current && (
        <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>Started at {startTimeRef.current.toLocaleTimeString()}</span>
        </div>
      )}
    </Card>
  );
};

export default TimerCard;
