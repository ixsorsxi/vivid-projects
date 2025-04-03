
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, PlusCircle, Trash2, Users } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProjectTask } from '@/hooks/project-form/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth";
import TaskAssigneeSelector from "./task-form/components/TaskAssigneeSelector";
import { TeamMember } from '@/components/projects/team/types';

interface TasksSectionProps {
  tasks: ProjectTask[];
  addTask: (task: ProjectTask) => Promise<any>;
  updateTask: (taskId: string, field: keyof ProjectTask, value: string) => Promise<void>;
  removeTask: (taskId: string) => Promise<void>;
  projectId?: string;
}

const TasksSection: React.FC<TasksSectionProps> = ({
  tasks,
  addTask,
  updateTask,
  removeTask,
  projectId
}) => {
  const { user } = useAuth();
  const isManagerOrAdmin = user?.role === 'admin' || user?.role === 'manager';
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<ProjectTask | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  
  // New task form state
  const [newTask, setNewTask] = useState<ProjectTask>({
    id: '',
    title: '',
    description: '',
    status: 'to-do',
    priority: 'medium',
    dueDate: '',
    assignees: []
  });
  
  const [selectedMember, setSelectedMember] = useState<string>('');
  
  // Get team members from the project
  const teamMembers: TeamMember[] = tasks.reduce((members, task) => {
    if (task.assignees) {
      task.assignees.forEach(assignee => {
        if (!members.some(m => m.name === assignee.name)) {
          members.push({
            id: assignee.id || `${assignee.name}-${Date.now()}`,
            name: assignee.name,
            role: 'Team Member'
          });
        }
      });
    }
    return members;
  }, [] as TeamMember[]);
  
  const handleAddTask = () => {
    const taskId = `task-${Date.now()}`;
    const taskToAdd: ProjectTask = {
      ...newTask,
      id: taskId
    };
    
    // If we have a projectId, add it to the task
    if (projectId) {
      (taskToAdd as any).project_id = projectId;
    }
    
    addTask(taskToAdd).then(() => {
      // Reset form
      setNewTask({
        id: '',
        title: '',
        description: '',
        status: 'to-do',
        priority: 'medium',
        dueDate: '',
        assignees: []
      });
      setIsDialogOpen(false);
    });
  };
  
  const openEditDialog = (task: ProjectTask) => {
    setActiveTask(task);
    setIsDialogOpen(true);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'to-do': return 'bg-slate-100 text-slate-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      case 'review': return 'bg-amber-100 text-amber-700';
      case 'completed': return 'bg-green-100 text-green-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-slate-100 text-slate-700';
      case 'medium': return 'bg-blue-100 text-blue-700';
      case 'high': return 'bg-amber-100 text-amber-700';
      case 'urgent': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };
  
  // Handle assignee operations
  const handleAddAssignee = () => {
    if (!selectedMember) return;
    
    // Check if already assigned
    if (newTask.assignees && newTask.assignees.some(a => a.name === selectedMember)) {
      return;
    }
    
    setNewTask({
      ...newTask,
      assignees: [...(newTask.assignees || []), { name: selectedMember }]
    });
    setSelectedMember('');
  };

  const handleRemoveAssignee = (name: string) => {
    setNewTask({
      ...newTask,
      assignees: (newTask.assignees || []).filter(a => a.name !== name)
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold">Project Tasks</h3>
          <span className="text-muted-foreground text-sm">{tasks.length} tasks</span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="rounded-lg border p-1 flex">
            <Button 
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm" 
              onClick={() => setViewMode('list')}
              className="px-3"
            >
              List
            </Button>
            <Button 
              variant={viewMode === 'kanban' ? 'default' : 'ghost'}
              size="sm" 
              onClick={() => setViewMode('kanban')}
              className="px-3"
            >
              Kanban
            </Button>
          </div>
          
          <Button 
            onClick={() => {
              setActiveTask(null);
              setNewTask({
                id: '',
                title: '',
                description: '',
                status: 'to-do',
                priority: 'medium',
                dueDate: '',
                assignees: []
              });
              setIsDialogOpen(true);
            }}
            className="gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>
      
      {/* Task List View */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {tasks.length > 0 ? tasks.map((task) => (
            <Card key={task.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => openEditDialog(task)}>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
                  <div className="lg:col-span-3">
                    <h4 className="font-medium">{task.title || 'Untitled Task'}</h4>
                    {task.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{task.description}</p>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 lg:justify-center">
                    <Badge className={cn("rounded-full", getStatusColor(task.status || 'to-do'))}>
                      {task.status === 'to-do' ? 'To Do' : 
                        task.status === 'in-progress' ? 'In Progress' :
                        task.status === 'review' ? 'Review' : 'Completed'}
                    </Badge>
                    <Badge className={cn("rounded-full", getPriorityColor(task.priority || 'medium'))}>
                      {task.priority?.charAt(0).toUpperCase() + task.priority?.slice(1) || 'Medium'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-1 lg:justify-center">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{task.dueDate || 'No due date'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 lg:justify-end">
                    {task.assignees && task.assignees.length > 0 ? (
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{task.assignees.length} assignee(s)</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Unassigned</span>
                      </div>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTask(task.id || '');
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )) : (
            <div className="text-center p-12 border border-dashed rounded-lg">
              <h4 className="font-medium text-muted-foreground">No tasks added yet</h4>
              <p className="text-sm text-muted-foreground mt-1">Click the "Add Task" button to create your first task</p>
            </div>
          )}
        </div>
      )}
      
      {/* Task Kanban View */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {['to-do', 'in-progress', 'review', 'completed'].map((status) => (
            <div key={status} className="border rounded-lg p-4">
              <h4 className="font-medium mb-3">
                {status === 'to-do' ? 'To Do' : 
                  status === 'in-progress' ? 'In Progress' :
                  status === 'review' ? 'Review' : 'Completed'}
              </h4>
              
              <div className="space-y-2">
                {tasks.filter(task => task.status === status).map((task) => (
                  <Card key={task.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => openEditDialog(task)}>
                    <CardContent className="p-3">
                      <h5 className="font-medium">{task.title || 'Untitled Task'}</h5>
                      {task.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{task.description}</p>
                      )}
                      
                      <div className="flex justify-between items-center mt-2">
                        <Badge className={cn("rounded-full text-xs", getPriorityColor(task.priority || 'medium'))}>
                          {task.priority?.charAt(0).toUpperCase() + task.priority?.slice(1) || 'Medium'}
                        </Badge>
                        
                        <div className="flex items-center gap-1">
                          {task.assignees && task.assignees.length > 0 ? (
                            <div className="flex items-center">
                              <Users className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs ml-1">{task.assignees.length}</span>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <Users className="h-3 w-3 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {tasks.filter(task => task.status === status).length === 0 && (
                  <div className="text-center p-4 border border-dashed rounded-lg">
                    <p className="text-xs text-muted-foreground">No tasks</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Task Dialog Form */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{activeTask ? 'Edit Task' : 'Add New Task'}</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={activeTask ? activeTask.title : newTask.title}
                onChange={(e) => {
                  if (activeTask) {
                    updateTask(activeTask.id || '', 'title', e.target.value);
                    setActiveTask({...activeTask, title: e.target.value});
                  } else {
                    setNewTask({...newTask, title: e.target.value});
                  }
                }}
                placeholder="Enter task title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={activeTask ? activeTask.description : newTask.description}
                onChange={(e) => {
                  if (activeTask) {
                    updateTask(activeTask.id || '', 'description', e.target.value);
                    setActiveTask({...activeTask, description: e.target.value});
                  } else {
                    setNewTask({...newTask, description: e.target.value});
                  }
                }}
                placeholder="Enter task description"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={activeTask ? activeTask.dueDate : newTask.dueDate}
                  onChange={(e) => {
                    if (activeTask) {
                      updateTask(activeTask.id || '', 'dueDate', e.target.value);
                      setActiveTask({...activeTask, dueDate: e.target.value});
                    } else {
                      setNewTask({...newTask, dueDate: e.target.value});
                    }
                  }}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={activeTask ? activeTask.status : newTask.status}
                  onValueChange={(value) => {
                    if (activeTask) {
                      updateTask(activeTask.id || '', 'status', value);
                      setActiveTask({...activeTask, status: value});
                    } else {
                      setNewTask({...newTask, status: value});
                    }
                  }}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="to-do">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={activeTask ? activeTask.priority : newTask.priority}
                  onValueChange={(value) => {
                    if (activeTask) {
                      updateTask(activeTask.id || '', 'priority', value);
                      setActiveTask({...activeTask, priority: value});
                    } else {
                      setNewTask({...newTask, priority: value});
                    }
                  }}
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Task Assignees Section - Only visible to managers and admins */}
            {isManagerOrAdmin && (
              <div className="space-y-2">
                <Label>Assignees</Label>
                {activeTask ? (
                  <div className="flex flex-wrap gap-2">
                    {activeTask.assignees && activeTask.assignees.map((assignee, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        {assignee.name}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 rounded-full"
                          onClick={() => {
                            const newAssignees = (activeTask.assignees || []).filter((_, i) => i !== index);
                            updateTask(activeTask.id || '', 'assignees', JSON.stringify(newAssignees));
                            setActiveTask({...activeTask, assignees: newAssignees});
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                    
                    <div className="mt-2 w-full">
                      <Select
                        value=""
                        onValueChange={(value) => {
                          if (!value) return;
                          
                          // Check if already assigned
                          if (activeTask.assignees && activeTask.assignees.some(a => a.name === value)) {
                            return;
                          }
                          
                          const newAssignees = [...(activeTask.assignees || []), { name: value }];
                          updateTask(activeTask.id || '', 'assignees', JSON.stringify(newAssignees));
                          setActiveTask({...activeTask, assignees: newAssignees});
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Add team member" />
                        </SelectTrigger>
                        <SelectContent>
                          {teamMembers.map((member) => (
                            <SelectItem key={member.id.toString()} value={member.name}>
                              {member.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ) : (
                  <TaskAssigneeSelector
                    assignees={newTask.assignees || []}
                    teamMembers={teamMembers}
                    selectedMember={selectedMember}
                    setSelectedMember={setSelectedMember}
                    handleAddAssignee={handleAddAssignee}
                    handleRemoveAssignee={handleRemoveAssignee}
                  />
                )}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            {activeTask ? (
              <Button onClick={() => setIsDialogOpen(false)}>
                Update Task
              </Button>
            ) : (
              <Button onClick={handleAddTask}>
                Create Task
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TasksSection;
