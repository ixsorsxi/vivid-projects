
import React from 'react';
import { Plus, Filter, Search, ArrowUpDown, Calendar, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageContainer from '@/components/PageContainer';
import TaskCard from '@/components/dashboard/TaskCard';
import { demoTasks } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import FadeIn from '@/components/animations/FadeIn';
import { useToast } from '@/hooks/use-toast';
import TaskForm from '@/components/tasks/TaskForm';
import { Task } from '@/lib/data';

const priorityColorMap = {
  high: 'bg-rose-500/15 text-rose-500 border-rose-500/20',
  medium: 'bg-amber-500/15 text-amber-500 border-amber-500/20',
  low: 'bg-blue-500/15 text-blue-500 border-blue-500/20',
};

const MyTasks = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState<string | null>(null);
  const [filterPriority, setFilterPriority] = React.useState<string | null>(null);
  const [tasks, setTasks] = React.useState<Task[]>(demoTasks);
  const [sortBy, setSortBy] = React.useState<'dueDate' | 'priority' | 'status'>('dueDate');
  const { toast } = useToast();
  const [isAddTaskOpen, setIsAddTaskOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('all');
  
  // Effect to sync tab state with filterStatus
  React.useEffect(() => {
    if (activeTab === 'all') {
      setFilterStatus(null);
    } else {
      setFilterStatus(activeTab);
    }
  }, [activeTab]);
  
  const filteredTasks = React.useMemo(() => {
    return tasks.filter(task => {
      // Apply search filter
      const matchesSearch = searchQuery === '' || 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description?.toLowerCase() || '').includes(searchQuery.toLowerCase());
      
      // Apply status filter
      const matchesStatus = filterStatus === null || task.status === filterStatus;
      
      // Apply priority filter
      const matchesPriority = filterPriority === null || task.priority === filterPriority;
      
      return matchesSearch && matchesStatus && matchesPriority;
    }).sort((a, b) => {
      if (sortBy === 'dueDate') {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else if (sortBy === 'priority') {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority as keyof typeof priorityOrder] - 
              priorityOrder[b.priority as keyof typeof priorityOrder];
      } else { // status
        const statusOrder = { 'to-do': 0, 'in-progress': 1, 'in-review': 2, 'completed': 3 };
        return statusOrder[a.status as keyof typeof statusOrder] - 
              statusOrder[b.status as keyof typeof statusOrder];
      }
    });
  }, [searchQuery, filterStatus, filterPriority, tasks, sortBy]);

  const handleToggleStatus = (taskId: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.id === taskId) {
          const newStatus = task.status === 'completed' ? 'in-progress' : 'completed';
          const newCompleted = newStatus === 'completed';
          
          toast({
            title: `Task ${newCompleted ? 'completed' : 'reopened'}`,
            description: `"${task.title}" has been ${newCompleted ? 'marked as complete' : 'reopened'}`,
          });
          
          return {
            ...task,
            status: newStatus,
            completed: newCompleted
          };
        }
        return task;
      })
    );
  };

  const handleAddTask = (newTask: Partial<Task>) => {
    const taskId = `task-${Date.now()}`;
    const task: Task = {
      id: taskId,
      title: newTask.title || 'Untitled Task',
      description: newTask.description || '',
      status: newTask.status || 'to-do',
      priority: newTask.priority || 'medium',
      dueDate: newTask.dueDate || new Date().toISOString(),
      completed: newTask.completed || false,
      project: 'Personal Tasks',
      assignees: newTask.assignees || [{ name: 'Me' }]
    };
    
    setTasks(prevTasks => [...prevTasks, task]);
    
    toast({
      title: "Task added",
      description: `"${task.title}" has been added to your tasks`,
    });
  };

  const formatDueDate = (date: string) => {
    const taskDate = new Date(date);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    if (taskDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (taskDate.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(taskDate);
    }
  };

  return (
    <PageContainer title="My Tasks" subtitle="Manage and track tasks assigned to you">
      <div className="space-y-6">
        <FadeIn duration={800}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-10 gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => setFilterPriority('high')}>
                      <span className="w-2 h-2 rounded-full bg-rose-500 mr-2"></span>
                      High Priority
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterPriority('medium')}>
                      <span className="w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
                      Medium Priority
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterPriority('low')}>
                      <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                      Low Priority
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterPriority(null)}>
                      Clear Priority Filter
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-10 gap-2">
                    <ArrowUpDown className="h-4 w-4" />
                    Sort
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => setSortBy('dueDate')}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Due Date
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('priority')}>
                    <Tag className="h-4 w-4 mr-2" />
                    Priority
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('status')}>
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    Status
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button size="sm" className="h-10 gap-2" onClick={() => setIsAddTaskOpen(true)}>
                <Plus className="h-4 w-4" />
                Add Task
              </Button>
            </div>
          </div>
        </FadeIn>
        
        <FadeIn duration={800} delay={100}>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">
                All Tasks
              </TabsTrigger>
              <TabsTrigger value="to-do">
                To Do
              </TabsTrigger>
              <TabsTrigger value="in-progress">
                In Progress
              </TabsTrigger>
              <TabsTrigger value="in-review">
                In Review
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed
              </TabsTrigger>
            </TabsList>
            
            {/* All the content is now rendered in a single TabsContent */}
            <TabsContent value={activeTab} className="mt-6">
              {filterPriority && (
                <div className="mb-4 flex items-center">
                  <span className="text-sm text-muted-foreground mr-2">Filtered by:</span>
                  <Badge 
                    variant="outline" 
                    className={priorityColorMap[filterPriority as keyof typeof priorityColorMap]}
                  >
                    {filterPriority.charAt(0).toUpperCase() + filterPriority.slice(1)} Priority
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 ml-2 p-0 text-xs"
                    onClick={() => setFilterPriority(null)}
                  >
                    Clear
                  </Button>
                </div>
              )}
              
              <div className="space-y-3">
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <TaskCard 
                      key={task.id} 
                      task={task} 
                      onStatusChange={() => handleToggleStatus(task.id)}
                    />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium">No tasks found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search or filters, or create a new task.
                    </p>
                    <Button className="mt-4" onClick={() => setIsAddTaskOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Task
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Task groups by due date */}
              {filteredTasks.length > 0 && sortBy === 'dueDate' && (
                <div className="mt-8 space-y-6">
                  {['Today', 'Tomorrow', 'Upcoming'].map((dateGroup) => {
                    const groupTasks = filteredTasks.filter(task => {
                      const dueDate = formatDueDate(task.dueDate);
                      if (dateGroup === 'Upcoming') {
                        return dueDate !== 'Today' && dueDate !== 'Tomorrow';
                      }
                      return dueDate === dateGroup;
                    });
                    
                    if (groupTasks.length === 0) return null;
                    
                    return (
                      <div key={dateGroup}>
                        <h3 className="text-md font-medium mb-3">{dateGroup}</h3>
                        <div className="space-y-3">
                          {groupTasks.map(task => (
                            <TaskCard 
                              key={task.id} 
                              task={task} 
                              onStatusChange={() => handleToggleStatus(task.id)} 
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </FadeIn>
      </div>

      {/* Task Form Modal */}
      <TaskForm 
        open={isAddTaskOpen}
        onOpenChange={setIsAddTaskOpen}
        onAddTask={handleAddTask}
      />
    </PageContainer>
  );
};

export default MyTasks;
