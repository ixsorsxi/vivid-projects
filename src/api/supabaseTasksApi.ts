
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/toast-wrapper";
import { Task, Assignee, DependencyType } from "@/lib/data";

// Convert Supabase data to our Task model
const mapToTask = (task: any, assignees: any[] = []): Task => {
  return {
    id: task.id,
    title: task.title,
    description: task.description || '',
    status: task.status,
    priority: task.priority,
    dueDate: task.due_date,
    project: task.project_name || 'Personal Tasks',
    assignees: assignees.map(assignee => ({ 
      name: assignee.full_name || assignee.username || 'Unknown User',
      avatar: assignee.avatar_url
    })),
    completed: task.completed,
    // Add these properties if they exist
    parentId: task.parent_id,
    dependencies: task.dependencies || []
  };
};

// Fetch all tasks for the current user
export const fetchUserTasks = async (): Promise<Task[]> => {
  try {
    // Get tasks where user is the owner
    const { data: ownedTasks, error: ownedError } = await supabase
      .from('tasks')
      .select(`
        *,
        projects:project_id(name)
      `)
      .order('created_at', { ascending: false });

    if (ownedError) throw ownedError;

    // Get tasks where user is an assignee
    const { data: assignedTasksIds, error: assignedError } = await supabase
      .from('task_assignees')
      .select('task_id')
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

    if (assignedError) throw assignedError;

    const assignedIds = assignedTasksIds.map(item => item.task_id);
    
    let assignedTasks: any[] = [];
    if (assignedIds.length > 0) {
      const { data: tasks, error } = await supabase
        .from('tasks')
        .select(`
          *,
          projects:project_id(name)
        `)
        .in('id', assignedIds)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      assignedTasks = tasks || [];
    }

    // Combine and remove duplicates
    const allTasks = [
      ...(ownedTasks || []),
      ...assignedTasks.filter(aTask => 
        !ownedTasks?.some(oTask => oTask.id === aTask.id)
      )
    ];

    // Get assignees for all tasks
    const allTasksWithAssignees = await Promise.all(
      allTasks.map(async (task) => {
        const { data: assigneeData, error: assigneeError } = await supabase
          .from('task_assignees')
          .select(`
            profiles:user_id(
              id,
              full_name,
              username,
              avatar_url
            )
          `)
          .eq('task_id', task.id);

        if (assigneeError) {
          console.error("Error fetching assignees:", assigneeError);
          return mapToTask(task);
        }

        const assignees = assigneeData.map(a => a.profiles) || [];
        return mapToTask({
          ...task,
          project_name: task.projects?.name || 'Personal Tasks'
        }, assignees);
      })
    );

    // Get subtasks and dependencies
    const tasksWithRelations = await Promise.all(
      allTasksWithAssignees.map(async (task) => {
        // Get subtasks
        const { data: subtasksData, error: subtasksError } = await supabase
          .from('task_subtasks')
          .select('*')
          .eq('parent_task_id', task.id);

        // Get dependencies
        const { data: dependenciesData, error: dependenciesError } = await supabase
          .from('task_dependencies')
          .select(`
            dependency_task_id,
            dependency_type,
            tasks:dependency_task_id(title)
          `)
          .eq('task_id', task.id);

        if (subtasksError) console.error("Error fetching subtasks:", subtasksError);
        if (dependenciesError) console.error("Error fetching dependencies:", dependenciesError);

        const subtasks = subtasksData?.map(st => ({
          id: st.id,
          title: st.title,
          status: st.completed ? 'completed' : 'to-do',
          priority: 'medium',
          dueDate: task.dueDate,
          project: task.project,
          assignees: task.assignees,
          completed: st.completed,
          parentId: task.id
        })) || [];

        const dependencies = dependenciesData?.map(dep => ({
          taskId: dep.dependency_task_id,
          type: dep.dependency_type as DependencyType
        })) || [];

        return {
          ...task,
          subtasks: subtasks.length > 0 ? subtasks : undefined,
          dependencies: dependencies.length > 0 ? dependencies : undefined
        };
      })
    );

    return tasksWithRelations;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    toast.error("Failed to load tasks");
    return [];
  }
};

// Create a new task
export const createTask = async (taskData: Partial<Task>): Promise<Task | null> => {
  try {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error("User not authenticated");

    // Insert task
    const { data: newTask, error } = await supabase
      .from('tasks')
      .insert({
        title: taskData.title,
        description: taskData.description,
        status: taskData.status || 'to-do',
        priority: taskData.priority || 'medium',
        due_date: taskData.dueDate,
        completed: taskData.completed || false,
        user_id: user.id
      })
      .select()
      .single();

    if (error) throw error;
    if (!newTask) throw new Error("Failed to create task");

    // Handle assignees
    if (taskData.assignees && taskData.assignees.length > 0) {
      const assigneePromises = taskData.assignees.map(async (assignee) => {
        // Find user by name (in a real app, you'd likely have a more robust way to do this)
        const { data: userData } = await supabase
          .from('profiles')
          .select('id')
          .ilike('full_name', assignee.name)
          .maybeSingle();

        if (userData) {
          // Add assignee
          await supabase
            .from('task_assignees')
            .insert({
              task_id: newTask.id,
              user_id: userData.id
            });
        } else {
          // If user not found, use current user
          await supabase
            .from('task_assignees')
            .insert({
              task_id: newTask.id,
              user_id: user.id
            });
        }
      });

      await Promise.all(assigneePromises);
    } else {
      // Default assignee is current user
      await supabase
        .from('task_assignees')
        .insert({
          task_id: newTask.id,
          user_id: user.id
        });
    }

    return await getTaskById(newTask.id);
  } catch (error) {
    console.error("Error creating task:", error);
    toast.error("Failed to create task");
    return null;
  }
};

// Get a single task by ID with all relationships
export const getTaskById = async (taskId: string): Promise<Task | null> => {
  try {
    const { data: task, error } = await supabase
      .from('tasks')
      .select(`
        *,
        projects:project_id(name)
      `)
      .eq('id', taskId)
      .single();

    if (error) throw error;
    if (!task) return null;

    // Get assignees
    const { data: assigneeData, error: assigneeError } = await supabase
      .from('task_assignees')
      .select(`
        profiles:user_id(
          id,
          full_name,
          username,
          avatar_url
        )
      `)
      .eq('task_id', taskId);

    if (assigneeError) throw assigneeError;
    const assignees = assigneeData.map(a => a.profiles) || [];

    // Get subtasks
    const { data: subtasksData, error: subtasksError } = await supabase
      .from('task_subtasks')
      .select('*')
      .eq('parent_task_id', taskId);

    // Get dependencies
    const { data: dependenciesData, error: dependenciesError } = await supabase
      .from('task_dependencies')
      .select(`
        dependency_task_id,
        dependency_type,
        tasks:dependency_task_id(title)
      `)
      .eq('task_id', taskId);

    if (subtasksError) console.error("Error fetching subtasks:", subtasksError);
    if (dependenciesError) console.error("Error fetching dependencies:", dependenciesError);

    const mappedTask = mapToTask({
      ...task,
      project_name: task.projects?.name || 'Personal Tasks'
    }, assignees);

    const subtasks = subtasksData?.map(st => ({
      id: st.id,
      title: st.title,
      status: st.completed ? 'completed' : 'to-do',
      priority: 'medium',
      dueDate: mappedTask.dueDate,
      project: mappedTask.project,
      assignees: mappedTask.assignees,
      completed: st.completed,
      parentId: taskId
    })) || [];

    const dependencies = dependenciesData?.map(dep => ({
      taskId: dep.dependency_task_id,
      type: dep.dependency_type as DependencyType
    })) || [];

    return {
      ...mappedTask,
      subtasks: subtasks.length > 0 ? subtasks : undefined,
      dependencies: dependencies.length > 0 ? dependencies : undefined
    };
  } catch (error) {
    console.error("Error fetching task:", error);
    return null;
  }
};

// Update a task
export const updateTask = async (taskData: Task): Promise<Task | null> => {
  try {
    // Update main task data
    const { error } = await supabase
      .from('tasks')
      .update({
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        priority: taskData.priority,
        due_date: taskData.dueDate,
        completed: taskData.completed
      })
      .eq('id', taskData.id);

    if (error) throw error;

    // Handle assignees - this is a simplified approach
    // In a real app, you'd likely want to compare current vs new assignees
    // and only add/remove the differences
    if (taskData.assignees && taskData.assignees.length > 0) {
      // Clear existing assignees
      await supabase
        .from('task_assignees')
        .delete()
        .eq('task_id', taskData.id);

      // Add new assignees
      const assigneePromises = taskData.assignees.map(async (assignee) => {
        // Find user by name
        const { data: userData } = await supabase
          .from('profiles')
          .select('id')
          .ilike('full_name', assignee.name)
          .maybeSingle();

        if (userData) {
          // Add assignee
          await supabase
            .from('task_assignees')
            .insert({
              task_id: taskData.id,
              user_id: userData.id
            });
        }
      });

      await Promise.all(assigneePromises);
    }

    return await getTaskById(taskData.id);
  } catch (error) {
    console.error("Error updating task:", error);
    toast.error("Failed to update task");
    return null;
  }
};

// Delete a task
export const deleteTask = async (taskId: string): Promise<boolean> => {
  try {
    // The DB cascades deletes for related records due to the ON DELETE CASCADE constraints
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting task:", error);
    toast.error("Failed to delete task");
    return false;
  }
};

// Toggle task status
export const toggleTaskStatus = async (taskId: string): Promise<Task | null> => {
  try {
    // Get current task status
    const { data: task, error: fetchError } = await supabase
      .from('tasks')
      .select('status, completed')
      .eq('id', taskId)
      .single();

    if (fetchError) throw fetchError;
    if (!task) throw new Error("Task not found");

    // Determine new status
    const newStatus = task.status === 'completed' ? 'in-progress' : 'completed';
    const newCompleted = newStatus === 'completed';

    // Update task
    const { error: updateError } = await supabase
      .from('tasks')
      .update({
        status: newStatus,
        completed: newCompleted
      })
      .eq('id', taskId);

    if (updateError) throw updateError;

    return await getTaskById(taskId);
  } catch (error) {
    console.error("Error toggling task status:", error);
    toast.error("Failed to update task status");
    return null;
  }
};

// Add dependency to task
export const addTaskDependency = async (
  taskId: string, 
  dependencyTaskId: string, 
  dependencyType: DependencyType
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('task_dependencies')
      .insert({
        task_id: taskId,
        dependency_task_id: dependencyTaskId,
        dependency_type: dependencyType
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error adding task dependency:", error);
    toast.error("Failed to add task dependency");
    return false;
  }
};

// Remove dependency from task
export const removeTaskDependency = async (
  taskId: string, 
  dependencyTaskId: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('task_dependencies')
      .delete()
      .eq('task_id', taskId)
      .eq('dependency_task_id', dependencyTaskId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error removing task dependency:", error);
    toast.error("Failed to remove task dependency");
    return false;
  }
};

// Add subtask
export const addTaskSubtask = async (
  parentTaskId: string, 
  title: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('task_subtasks')
      .insert({
        parent_task_id: parentTaskId,
        title: title,
        completed: false
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error adding subtask:", error);
    toast.error("Failed to add subtask");
    return false;
  }
};

// Toggle subtask completion
export const toggleSubtaskCompletion = async (subtaskId: string): Promise<boolean> => {
  try {
    // Get current completion status
    const { data: subtask, error: fetchError } = await supabase
      .from('task_subtasks')
      .select('completed')
      .eq('id', subtaskId)
      .single();

    if (fetchError) throw fetchError;
    if (!subtask) throw new Error("Subtask not found");

    // Toggle completion
    const { error: updateError } = await supabase
      .from('task_subtasks')
      .update({
        completed: !subtask.completed
      })
      .eq('id', subtaskId);

    if (updateError) throw updateError;
    return true;
  } catch (error) {
    console.error("Error toggling subtask completion:", error);
    toast.error("Failed to update subtask");
    return false;
  }
};

// Delete subtask
export const deleteSubtask = async (subtaskId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('task_subtasks')
      .delete()
      .eq('id', subtaskId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting subtask:", error);
    toast.error("Failed to delete subtask");
    return false;
  }
};

// Fetch available users for assignee selection
export const fetchAvailableUsers = async (): Promise<Assignee[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, username, avatar_url');

    if (error) throw error;

    return (data || []).map(user => ({
      name: user.full_name || user.username || 'Unknown User',
      avatar: user.avatar_url
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};
