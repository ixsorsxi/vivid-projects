
-- Create or replace function to get team members safely without RLS recursion
CREATE OR REPLACE FUNCTION public.get_project_team_members_safe(
  p_project_id uuid
)
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
  -- Check if current user has permission to view the project
  IF NOT (
    EXISTS (SELECT 1 FROM public.projects WHERE id = p_project_id AND user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin') OR
    EXISTS (
      SELECT 1 FROM public.project_members
      WHERE project_id = p_project_id AND user_id = auth.uid() AND left_at IS NULL
    )
  ) THEN
    RAISE EXCEPTION 'Permission denied: You do not have access to view this project team';
  END IF;

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

COMMENT ON FUNCTION public.get_project_team_members_safe(uuid) IS 'Securely fetch project team members without RLS recursion issues';
