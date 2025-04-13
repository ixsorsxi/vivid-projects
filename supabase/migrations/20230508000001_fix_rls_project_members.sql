
-- Fix the infinite recursion issue with project_members RLS
-- Drop existing RLS policies for project_members if they exist
DROP POLICY IF EXISTS "Users can view their project members" ON project_members;
DROP POLICY IF EXISTS "Users can modify their project members" ON project_members;

-- Create security definer function to check project access without recursion
CREATE OR REPLACE FUNCTION public.check_project_membership_safe(p_project_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Direct checks to determine access rights
  
  -- Check if user is project owner (most reliable, no recursion risk)
  RETURN EXISTS (
    SELECT 1 FROM public.projects 
    WHERE id = p_project_id AND user_id = auth.uid()
  ) OR 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$;

-- Create improved policies using the safe function
CREATE POLICY "Users can view their project members" 
ON project_members 
FOR SELECT 
USING (
  -- Check if user is project owner or admin (using safe function)
  check_project_membership_safe(project_id) OR
  -- Allow users to see projects they are members of
  (user_id = auth.uid() AND left_at IS NULL)
);

CREATE POLICY "Users can insert project members" 
ON project_members 
FOR INSERT 
WITH CHECK (
  -- Only project owners and admins can add members
  check_project_membership_safe(project_id)
);

CREATE POLICY "Users can update project members" 
ON project_members 
FOR UPDATE 
USING (
  -- Only project owners and admins can update members
  check_project_membership_safe(project_id)
);

CREATE POLICY "Users can delete project members" 
ON project_members 
FOR DELETE 
USING (
  -- Only project owners and admins can delete members
  check_project_membership_safe(project_id)
);

-- Create a new secure RPC function to get project roles
CREATE OR REPLACE FUNCTION public.get_project_roles_v2()
RETURNS TABLE (
  id uuid,
  role_key text,
  description text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pr.id,
    pr.role_key,
    pr.description
  FROM 
    public.project_roles pr
  ORDER BY 
    pr.role_key;
END;
$$;

-- Create improved get_team_members function that avoids recursion
CREATE OR REPLACE FUNCTION public.get_team_members_safe(p_project_id uuid)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  name text,
  role text,
  joined_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Verify access using the safe function (no recursion risk)
  IF NOT check_project_membership_safe(p_project_id) THEN
    RAISE EXCEPTION 'Permission denied: You cannot view this project team';
  END IF;

  -- Return team members
  RETURN QUERY
  SELECT 
    pm.id,
    pm.user_id,
    pm.project_member_name AS name,
    pm.role,
    pm.joined_at
  FROM 
    public.project_members pm
  WHERE 
    pm.project_id = p_project_id
    AND pm.left_at IS NULL
  ORDER BY 
    pm.joined_at;
END;
$$;

COMMENT ON FUNCTION public.check_project_membership_safe(uuid) IS 'Securely check project membership without risking RLS recursion';
COMMENT ON FUNCTION public.get_project_roles_v2() IS 'Securely fetch project roles without RLS recursion issues';
COMMENT ON FUNCTION public.get_team_members_safe(uuid) IS 'Securely fetch project team members without RLS recursion issues';
