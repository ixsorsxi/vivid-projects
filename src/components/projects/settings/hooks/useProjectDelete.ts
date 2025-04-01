
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/toast-wrapper";
import { useNavigate } from "react-router-dom";

interface UseProjectDeleteProps {
  projectId: string;
  onSuccess: () => void;
}

export function useProjectDelete({ projectId, onSuccess }: UseProjectDeleteProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const deleteProject = async (confirmText: string): Promise<boolean> => {
    if (confirmText !== "delete") return false;
    
    try {
      setIsDeleting(true);
      setDeleteError(null);
      
      console.log("Deleting project with ID:", projectId);
      
      // First get all task IDs for this project
      const { data: projectTasks, error: taskQueryError } = await supabase
        .from('tasks')
        .select('id')
        .eq('project_id', projectId);
      
      if (taskQueryError) {
        console.error("Error fetching project tasks:", taskQueryError);
        throw taskQueryError;
      }
      
      const taskIds = projectTasks?.map(task => task.id) || [];
      console.log(`Found ${taskIds.length} tasks to delete`);
      
      // 1. Delete task assignees
      if (taskIds.length > 0) {
        const { error: assigneesError } = await supabase
          .from('task_assignees')
          .delete()
          .in('task_id', taskIds);
        
        if (assigneesError) {
          console.error("Error deleting task assignees:", assigneesError);
          throw assigneesError;
        }
      }
      
      // 2. Delete task dependencies
      if (taskIds.length > 0) {
        const { error: dependenciesError } = await supabase
          .from('task_dependencies')
          .delete()
          .or(`task_id.in.(${taskIds.join(',')}),dependency_task_id.in.(${taskIds.join(',')})`);
        
        if (dependenciesError) {
          console.error("Error deleting task dependencies:", dependenciesError);
          throw dependenciesError;
        }
      }
      
      // 3. Delete task subtasks
      if (taskIds.length > 0) {
        const { error: subtasksError } = await supabase
          .from('task_subtasks')
          .delete()
          .in('parent_task_id', taskIds);
        
        if (subtasksError) {
          console.error("Error deleting subtasks:", subtasksError);
          throw subtasksError;
        }
      }
      
      // 4. Delete tasks
      const { error: tasksError } = await supabase
        .from('tasks')
        .delete()
        .eq('project_id', projectId);
      
      if (tasksError) {
        console.error("Error deleting tasks:", tasksError);
        throw tasksError;
      }
      
      // 5. Delete project members
      const { error: membersError } = await supabase
        .from('project_members')
        .delete()
        .eq('project_id', projectId);
      
      if (membersError) {
        console.error("Error deleting project members:", membersError);
        throw membersError;
      }
      
      // 6. Finally delete the project
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);
      
      if (error) {
        console.error("Error deleting project:", error);
        setDeleteError(error.message);
        return false;
      }
      
      // Success! Call the onSuccess callback
      onSuccess();
      
      // Show success toast
      toast.success("Project deleted", {
        description: "The project has been successfully deleted."
      });
      
      // Navigate to projects page after a short delay
      setTimeout(() => {
        navigate('/projects');
      }, 1000);
      
      return true;
      
    } catch (err: any) {
      console.error("Error in deleteProject:", err);
      setDeleteError("An unexpected error occurred while trying to delete the project.");
      return false;
    } finally {
      setIsDeleting(false);
    }
  };
  
  return {
    isDeleting,
    deleteError,
    deleteProject,
    setDeleteError
  };
}
