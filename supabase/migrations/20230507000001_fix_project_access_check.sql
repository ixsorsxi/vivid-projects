
-- Create improved project member access check function
CREATE OR REPLACE FUNCTION public.check_project_member_access_safe(p_project_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Check if user is project owner
  IF EXISTS (
    SELECT 1 FROM public.projects 
    WHERE id = p_project_id AND user_id = auth.uid()
  ) THEN
    RETURN TRUE;
  END IF;
  
  -- Check if user is admin
  IF EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RETURN TRUE;
  END IF;
  
  -- Check if user is a team member of this project
  IF EXISTS (
    SELECT 1 FROM public.project_members 
    WHERE project_id = p_project_id AND user_id = auth.uid() AND left_at IS NULL
  ) THEN
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$;

-- Add comment for the function
COMMENT ON FUNCTION public.check_project_member_access_safe(uuid) IS 'Securely check if a user has access to a project without RLS recursion';
