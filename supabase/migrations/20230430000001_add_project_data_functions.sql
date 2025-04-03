
-- Update get_project_milestones to return actual milestones
CREATE OR REPLACE FUNCTION public.get_project_milestones(p_project_id uuid)
RETURNS TABLE (
  id uuid,
  project_id uuid,
  title text,
  description text,
  due_date timestamp with time zone,
  completion_date timestamp with time zone,
  status text,
  created_at timestamp with time zone
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pm.id,
    pm.project_id,
    pm.title,
    pm.description,
    pm.due_date,
    pm.completion_date,
    pm.status,
    pm.created_at
  FROM 
    public.project_milestones pm
  WHERE 
    pm.project_id = p_project_id AND
    (
      EXISTS (SELECT 1 FROM public.projects p WHERE p.id = p_project_id AND p.user_id = auth.uid()) OR
      EXISTS (SELECT 1 FROM public.project_members m WHERE m.project_id = p_project_id AND m.user_id = auth.uid())
    );
END;
$$;

-- Update get_project_risks to return actual risks
CREATE OR REPLACE FUNCTION public.get_project_risks(p_project_id uuid)
RETURNS TABLE (
  id uuid,
  project_id uuid,
  title text,
  description text,
  severity text,
  probability text,
  impact text,
  mitigation_plan text,
  status text,
  created_at timestamp with time zone
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pr.id,
    pr.project_id,
    pr.title,
    pr.description,
    pr.severity,
    pr.probability,
    pr.impact,
    pr.mitigation_plan,
    pr.status,
    pr.created_at
  FROM 
    public.project_risks pr
  WHERE 
    pr.project_id = p_project_id AND
    (
      EXISTS (SELECT 1 FROM public.projects p WHERE p.id = p_project_id AND p.user_id = auth.uid()) OR
      EXISTS (SELECT 1 FROM public.project_members m WHERE m.project_id = p_project_id AND m.user_id = auth.uid())
    );
END;
$$;

-- Update get_project_financials to return actual financials
CREATE OR REPLACE FUNCTION public.get_project_financials(p_project_id uuid)
RETURNS TABLE (
  id uuid,
  project_id uuid,
  transaction_date timestamp with time zone,
  amount numeric,
  transaction_type text,
  category text,
  description text,
  payment_status text,
  created_at timestamp with time zone
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pf.id,
    pf.project_id,
    pf.transaction_date,
    pf.amount,
    pf.transaction_type,
    pf.category,
    pf.description,
    pf.payment_status,
    pf.created_at
  FROM 
    public.project_financials pf
  WHERE 
    pf.project_id = p_project_id AND
    (
      EXISTS (SELECT 1 FROM public.projects p WHERE p.id = p_project_id AND p.user_id = auth.uid()) OR
      EXISTS (SELECT 1 FROM public.project_members m WHERE m.project_id = p_project_id AND m.user_id = auth.uid())
    );
END;
$$;

-- Add functions to create milestone, risk, and financial entries
CREATE OR REPLACE FUNCTION public.add_project_milestone(
  p_project_id uuid,
  p_title text,
  p_description text,
  p_due_date timestamp with time zone,
  p_status text DEFAULT 'not-started'
)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_milestone_id uuid;
BEGIN
  -- Check if user has permission (is project owner or member)
  IF NOT (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = p_project_id AND p.user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.project_members m WHERE m.project_id = p_project_id AND m.user_id = auth.uid())
  ) THEN
    RAISE EXCEPTION 'Permission denied: You cannot add milestones to this project';
  END IF;

  -- Insert new milestone
  INSERT INTO public.project_milestones (
    project_id,
    title,
    description,
    due_date,
    status
  ) VALUES (
    p_project_id,
    p_title,
    p_description,
    p_due_date,
    p_status
  ) RETURNING id INTO v_milestone_id;

  RETURN v_milestone_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.add_project_risk(
  p_project_id uuid,
  p_title text,
  p_description text,
  p_severity text,
  p_probability text,
  p_impact text,
  p_mitigation_plan text,
  p_status text DEFAULT 'open'
)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_risk_id uuid;
BEGIN
  -- Check if user has permission (is project owner or member)
  IF NOT (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = p_project_id AND p.user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.project_members m WHERE m.project_id = p_project_id AND m.user_id = auth.uid())
  ) THEN
    RAISE EXCEPTION 'Permission denied: You cannot add risks to this project';
  END IF;

  -- Insert new risk
  INSERT INTO public.project_risks (
    project_id,
    title,
    description,
    severity,
    probability,
    impact,
    mitigation_plan,
    status
  ) VALUES (
    p_project_id,
    p_title,
    p_description,
    p_severity,
    p_probability,
    p_impact,
    p_mitigation_plan,
    p_status
  ) RETURNING id INTO v_risk_id;

  RETURN v_risk_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.add_project_financial(
  p_project_id uuid,
  p_transaction_date timestamp with time zone,
  p_amount numeric,
  p_transaction_type text,
  p_category text,
  p_description text,
  p_payment_status text DEFAULT 'pending'
)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_financial_id uuid;
BEGIN
  -- Check if user has permission (is project owner or member)
  IF NOT (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = p_project_id AND p.user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.project_members m WHERE m.project_id = p_project_id AND m.user_id = auth.uid())
  ) THEN
    RAISE EXCEPTION 'Permission denied: You cannot add financial entries to this project';
  END IF;

  -- Insert new financial entry
  INSERT INTO public.project_financials (
    project_id,
    transaction_date,
    amount,
    transaction_type,
    category,
    description,
    payment_status
  ) VALUES (
    p_project_id,
    p_transaction_date,
    p_amount,
    p_transaction_type,
    p_category,
    p_description,
    p_payment_status
  ) RETURNING id INTO v_financial_id;

  RETURN v_financial_id;
END;
$$;
