
import React from 'react';
import { Task } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, ChevronRight, Plus, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskSubtasksProps {
  task: Task;
  onAddSubtask?: (parentId: string, title: string) => void;
  onToggleSubtask?: (taskId: string) => void;
  onDeleteSubtask?: (taskId: string) => void;
}

export const TaskSubtasks: React.FC<TaskSubtasksProps> = ({
  task,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask
}) => {
  const [newSubtaskTitle, setNewSubtaskTitle] = React.useState('');
  const [expandedSubtasks, setExpandedSubtasks] = React.useState<Record<string, boolean>>({});

  const handleAddSubtask = () => {
    if (newSubtaskTitle.trim() && onAddSubtask) {
      onAddSubtask(task.id, newSubtaskTitle);
      setNewSubtaskTitle('');
    }
  };

  const toggleExpand = (subtaskId: string) => {
    setExpandedSubtasks(prev => ({
      ...prev,
      [subtaskId]: !prev[subtaskId]
    }));
  };

  const renderSubtask = (subtask: Task, level = 0) => {
    const hasNestedSubtasks = subtask.subtasks && subtask.subtasks.length > 0;
    const isExpanded = expandedSubtasks[subtask.id];
    
    return (
      <div key={subtask.id} className="space-y-1">
        <div className={cn(
          "flex items-center p-2 rounded-md hover:bg-muted/50 transition-colors",
          subtask.completed && "opacity-70"
        )}
        style={{ paddingLeft: `${(level * 16) + 8}px` }}
        >
          {hasNestedSubtasks && (
            <button 
              className="mr-1.5 text-muted-foreground hover:text-foreground"
              onClick={() => toggleExpand(subtask.id)}
            >
              {isExpanded ? 
                <ChevronDown className="h-4 w-4" /> : 
                <ChevronRight className="h-4 w-4" />
              }
            </button>
          )}
          
          {!hasNestedSubtasks && <div className="w-5" />}
          
          <Checkbox 
            checked={subtask.completed} 
            onCheckedChange={() => onToggleSubtask && onToggleSubtask(subtask.id)}
            className="mr-2"
          />
          
          <span className={cn(
            "text-sm flex-1",
            subtask.completed && "line-through text-muted-foreground"
          )}>
            {subtask.title}
          </span>
          
          {onDeleteSubtask && (
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => onDeleteSubtask(subtask.id)}
              className="opacity-0 group-hover:opacity-100 hover:opacity-100"
            >
              <Trash className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          )}
        </div>
        
        {hasNestedSubtasks && isExpanded && (
          <div className="pl-4">
            {subtask.subtasks!.map(nested => renderSubtask(nested, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium mb-2">Subtasks</h4>
      
      <div className="space-y-2 mb-3">
        {task.subtasks && task.subtasks.length > 0 ? (
          <div className="bg-muted/40 rounded-md py-1">
            {task.subtasks.map(subtask => renderSubtask(subtask))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No subtasks yet</p>
        )}
      </div>
      
      {onAddSubtask && (
        <div className="flex gap-2">
          <Input
            placeholder="New subtask"
            value={newSubtaskTitle}
            onChange={(e) => setNewSubtaskTitle(e.target.value)}
            className="flex-1"
          />
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleAddSubtask}
            disabled={!newSubtaskTitle.trim()}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      )}
    </div>
  );
};

export default TaskSubtasks;
