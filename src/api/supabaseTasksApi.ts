import { supabase } from '@/integrations/supabase/client';
import { Task, Assignee } from '@/lib/data';

export const fetchTasks = async (): Promise<Task[]> => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }

    // Convert from database model to app model with simplified assignees
    return data.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      dueDate: task.due_date,
      completed: task.completed,
      project: task.project_id, // Map to project property
      assignees: [{ name: 'Assigned User' }] // Simplified assignees to avoid recursion issues
    }));
  } catch (e) {
    console.error('Unexpected error in fetchTasks:', e);
    return [];
  }
};

export const fetchTaskById = async (taskId: string): Promise<Task | null> => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .single();

    if (error) {
      console.error('Error fetching task:', error);
      return null;
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description || '',
      status: data.status,
      priority: data.priority,
      dueDate: data.due_date,
      completed: data.completed,
      project: data.project_id,
      assignees: [{ name: 'Assigned User' }]
    };
  } catch (e) {
    console.error('Unexpected error in fetchTaskById:', e);
    return null;
  }
};

export const createTask = async (task: Omit<Task, 'id'>): Promise<Task | null> => {
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      due_date: task.dueDate,
      completed: task.completed || false,
      project_id: task.project, // Use project property
      user_id: (await supabase.auth.getUser()).data.user?.id
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating task:', error);
    return null;
  }

  // Create task assignees if provided
  if (task.assignees && task.assignees.length > 0) {
    // For each assignee, try to find a user with a similar name
    const assigneesPromises = task.assignees.map(async (assignee) => {
      // In a real app, you would query users by name
      // For now, create a random UUID for demo
      return {
        task_id: data.id,
        user_id: (await supabase.auth.getUser()).data.user?.id
      };
    });
    
    const assigneesData = await Promise.all(assigneesPromises);

    const { error: assigneesError } = await supabase
      .from('task_assignees')
      .insert(assigneesData);

    if (assigneesError) {
      console.error('Error adding task assignees:', assigneesError);
    }
  }

  // Return the newly created task
  return {
    id: data.id,
    title: data.title,
    description: data.description || '',
    status: data.status,
    priority: data.priority,
    dueDate: data.due_date,
    completed: data.completed,
    project: data.project_id,
    assignees: task.assignees || []
  };
};

export const updateTask = async (taskId: string, task: Partial<Task>): Promise<Task | null> => {
  // Update the main task data
  const { data, error } = await supabase
    .from('tasks')
    .update({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      due_date: task.dueDate,
      completed: task.completed,
      project_id: task.project // Use project property
    })
    .eq('id', taskId)
    .select()
    .single();

  if (error) {
    console.error('Error updating task:', error);
    return null;
  }

  // Update assignees if provided
  if (task.assignees) {
    // First remove all existing assignees
    const { error: deleteError } = await supabase
      .from('task_assignees')
      .delete()
      .eq('task_id', taskId);

    if (deleteError) {
      console.error('Error deleting task assignees:', deleteError);
    }

    // Then add the new ones
    if (task.assignees.length > 0) {
      // For each assignee, try to find a user with a similar name
      const assigneesPromises = task.assignees.map(async (assignee) => {
        // In a real app, you would query users by name
        // For now, create a random UUID for demo
        return {
          task_id: taskId,
          user_id: (await supabase.auth.getUser()).data.user?.id
        };
      });
      
      const assigneesData = await Promise.all(assigneesPromises);

      const { error: assigneesError } = await supabase
        .from('task_assignees')
        .insert(assigneesData);

      if (assigneesError) {
        console.error('Error adding task assignees:', assigneesError);
      }
    }
  }

  // Return the updated task
  return {
    id: data.id,
    title: data.title,
    description: data.description || '',
    status: data.status,
    priority: data.priority,
    dueDate: data.due_date,
    completed: data.completed,
    project: data.project_id,
    assignees: task.assignees || []
  };
};

export const deleteTask = async (taskId: string): Promise<boolean> => {
  // Delete the task (cascade will handle related records)
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);

  if (error) {
    console.error('Error deleting task:', error.message);
    return false;
  }

  return true;
};

export const toggleTaskStatus = async (taskId: string, completed: boolean): Promise<Task | null> => {
  const { data, error } = await supabase
    .from('tasks')
    .update({ completed })
    .eq('id', taskId)
    .select()
    .single();

  if (error) {
    console.error('Error toggling task status:', error);
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    description: data.description || '',
    status: data.status,
    priority: data.priority,
    dueDate: data.due_date,
    completed: data.completed,
    project: data.project_id,
    assignees: [] // We don't load assignees here for simplicity
  };
};

export const fetchTasksByProject = async (projectId: string): Promise<Task[]> => {
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      id,
      title,
      description,
      status,
      priority,
      due_date,
      completed,
      project_id,
      task_assignees (
        id,
        user_id
      )
    `)
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching project tasks:', error);
    return [];
  }

  // Convert from database model to app model
  return data.map(task => ({
    id: task.id,
    title: task.title,
    description: task.description || '',
    status: task.status,
    priority: task.priority,
    dueDate: task.due_date,
    completed: task.completed,
    project: task.project_id,
    assignees: task.task_assignees?.map((assignee: any) => ({
      name: `User ${assignee.user_id.substring(0, 5)}`,
      avatar: undefined
    })) || []
  }));
};

// Utility function to fetch user tasks
export const fetchUserTasks = async (): Promise<Task[]> => {
  try {
    // In case of database issues, provide a fallback of demo tasks
    const demoTasks: Task[] = [
      {
        id: 'demo-1',
        title: 'Complete project proposal',
        description: 'Write up the proposal for the new client project',
        status: 'in-progress',
        priority: 'high',
        dueDate: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
        completed: false,
        project: 'Client Project',
        assignees: [{ name: 'Demo User' }]
      },
      {
        id: 'demo-2',
        title: 'Review wireframes',
        description: 'Review the design wireframes from the design team',
        status: 'to-do',
        priority: 'medium',
        dueDate: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
        completed: false,
        project: 'Website Redesign',
        assignees: [{ name: 'Demo User' }]
      },
      {
        id: 'demo-3',
        title: 'Fix sidebar navigation bug',
        description: 'The sidebar navigation collapses unexpectedly on small screens',
        status: 'to-do',
        priority: 'high',
        dueDate: new Date(Date.now() + 86400000).toISOString(), // 1 day from now
        completed: false,
        project: 'Bug Fixes',
        assignees: [{ name: 'Demo User' }]
      },
      {
        id: 'demo-4',
        title: 'Write documentation',
        description: 'Document the new API endpoints for the developer portal',
        status: 'completed',
        priority: 'low',
        dueDate: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
        completed: true,
        project: 'Documentation',
        assignees: [{ name: 'Demo User' }]
      }
    ];
    
    // Try to get tasks from the database
    const tasks = await fetchTasks();
    
    // If we got tasks successfully, return them, otherwise use demo tasks
    return tasks.length > 0 ? tasks : demoTasks;
  } catch (error) {
    console.error('Error in fetchUserTasks:', error);
    
    // Return demo tasks as fallback
    return [
      {
        id: 'demo-1',
        title: 'Complete project proposal',
        description: 'Write up the proposal for the new client project',
        status: 'in-progress',
        priority: 'high',
        dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
        completed: false,
        project: 'Client Project',
        assignees: [{ name: 'Demo User' }]
      },
      {
        id: 'demo-2',
        title: 'Review wireframes',
        description: 'Review the design wireframes from the design team',
        status: 'to-do',
        priority: 'medium',
        dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
        completed: false,
        project: 'Website Redesign',
        assignees: [{ name: 'Demo User' }]
      }
    ];
  }
};

export const addTaskDependency = async (taskId: string, dependencyTaskId: string, dependencyType: string): Promise<boolean> => {
  const { error } = await supabase
    .from('task_dependencies')
    .insert({
      task_id: taskId,
      dependency_task_id: dependencyTaskId,
      dependency_type: dependencyType
    });

  if (error) {
    console.error('Error adding task dependency:', error);
    return false;
  }

  return true;
};

export const removeTaskDependency = async (taskId: string, dependencyTaskId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('task_dependencies')
    .delete()
    .eq('task_id', taskId)
    .eq('dependency_task_id', dependencyTaskId);

  if (error) {
    console.error('Error removing task dependency:', error);
    return false;
  }

  return true;
};

export const addTaskSubtask = async (parentId: string, title: string): Promise<boolean> => {
  const { error } = await supabase
    .from('task_subtasks')
    .insert({
      parent_task_id: parentId,
      title: title,
      completed: false
    });

  if (error) {
    console.error('Error adding subtask:', error);
    return false;
  }

  return true;
};

export const toggleSubtaskCompletion = async (subtaskId: string): Promise<boolean> => {
  // First get the current status
  const { data: currentData, error: fetchError } = await supabase
    .from('task_subtasks')
    .select('completed')
    .eq('id', subtaskId)
    .single();

  if (fetchError) {
    console.error('Error fetching subtask:', fetchError);
    return false;
  }

  // Toggle the status
  const { error } = await supabase
    .from('task_subtasks')
    .update({ completed: !currentData.completed })
    .eq('id', subtaskId);

  if (error) {
    console.error('Error toggling subtask completion:', error);
    return false;
  }

  return true;
};

export const deleteSubtask = async (subtaskId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('task_subtasks')
    .delete()
    .eq('id', subtaskId);

  if (error) {
    console.error('Error deleting subtask:', error);
    return false;
  }

  return true;
};

export const fetchAvailableUsers = async (): Promise<Assignee[]> => {
  // In a real app, you would fetch users from Supabase
  // For now, return some dummy users
  return [
    { name: 'John Doe', avatar: undefined },
    { name: 'Jane Smith', avatar: undefined },
    { name: 'Robert Johnson', avatar: undefined },
    { name: 'Emily Davis', avatar: undefined }
  ];
};
