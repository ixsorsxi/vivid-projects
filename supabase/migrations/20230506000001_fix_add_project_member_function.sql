
-- Drop the existing function if it exists
DROP FUNCTION IF EXISTS public.add_project_member(uuid, uuid, text, text, text);

-- Create an improved version of the function with better error handling
CREATE OR REPLACE FUNCTION public.add_project_member(
  p_project_id uuid,
  p_user_id uuid,
  p_name text,
  p_role text,
  p_email text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_member_id UUID;
  v_project_role_id UUID;
  v_user_exists BOOLEAN;
  v_is_already_member BOOLEAN;
  v_can_add BOOLEAN;
BEGIN
  -- Check if the user exists in profiles
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = p_user_id
  ) INTO v_user_exists;
  
  IF NOT v_user_exists THEN
    RAISE EXCEPTION 'User with ID % does not exist', p_user_id;
  END IF;

  -- Check if the user is already a member of this project
  SELECT EXISTS (
    SELECT 1 FROM public.project_members
    WHERE project_id = p_project_id
    AND user_id = p_user_id
    AND left_at IS NULL
  ) INTO v_is_already_member;
  
  IF v_is_already_member THEN
    RAISE EXCEPTION 'User is already a member of this project';
  END IF;

  -- Check if current user has access to the project
  SELECT (
    EXISTS (SELECT 1 FROM public.projects WHERE id = p_project_id AND user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin') OR
    EXISTS (
      SELECT 1 FROM public.project_members
      WHERE project_id = p_project_id
      AND user_id = auth.uid()
      AND role IN ('project_manager', 'admin')
    )
  ) INTO v_can_add;
  
  IF NOT v_can_add THEN
    RAISE EXCEPTION 'Permission denied: You do not have rights to add members to this project';
  END IF;

  -- Get the project role ID if we have a role key
  SELECT id INTO v_project_role_id 
  FROM public.project_roles 
  WHERE role_key = p_role 
  LIMIT 1;

  -- Insert the new member
  INSERT INTO public.project_members (
    project_id,
    user_id,
    project_member_name,
    role,
    project_role_id,
    joined_at
  ) VALUES (
    p_project_id,
    p_user_id,
    p_name,
    p_role,
    v_project_role_id,
    now()
  )
  RETURNING id INTO v_member_id;

  RETURN v_member_id;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error and re-raise
    RAISE LOG 'Error in add_project_member: %', SQLERRM;
    RAISE;
END;
$$;

-- Ensure the function has the proper comments
COMMENT ON FUNCTION public.add_project_member(uuid, uuid, text, text, text) IS 'Adds a user to a project team with proper permission checks and error handling';
