
-- Create the project_milestones table
CREATE TABLE IF NOT EXISTS public.project_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  completion_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'not-started',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies to project_milestones
ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project owners and members can view milestones"
  ON public.project_milestones
  FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.project_members m WHERE m.project_id = project_id AND m.user_id = auth.uid())
  );

CREATE POLICY "Project owners and members can insert milestones"
  ON public.project_milestones
  FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.project_members m WHERE m.project_id = project_id AND m.user_id = auth.uid())
  );

CREATE POLICY "Project owners and members can update milestones"
  ON public.project_milestones
  FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.project_members m WHERE m.project_id = project_id AND m.user_id = auth.uid())
  );

CREATE POLICY "Project owners and members can delete milestones"
  ON public.project_milestones
  FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.project_members m WHERE m.project_id = project_id AND m.user_id = auth.uid())
  );

-- Create the project_risks table
CREATE TABLE IF NOT EXISTS public.project_risks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  severity TEXT NOT NULL, -- 'low', 'medium', 'high', 'critical'
  probability TEXT NOT NULL, -- 'low', 'medium', 'high'
  impact TEXT NOT NULL, -- 'low', 'medium', 'high', 'severe'
  mitigation_plan TEXT,
  status TEXT NOT NULL DEFAULT 'open', -- 'open', 'mitigated', 'closed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies to project_risks
ALTER TABLE public.project_risks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project owners and members can view risks"
  ON public.project_risks
  FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.project_members m WHERE m.project_id = project_id AND m.user_id = auth.uid())
  );

CREATE POLICY "Project owners and members can insert risks"
  ON public.project_risks
  FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.project_members m WHERE m.project_id = project_id AND m.user_id = auth.uid())
  );

CREATE POLICY "Project owners and members can update risks"
  ON public.project_risks
  FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.project_members m WHERE m.project_id = project_id AND m.user_id = auth.uid())
  );

CREATE POLICY "Project owners and members can delete risks"
  ON public.project_risks
  FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.project_members m WHERE m.project_id = project_id AND m.user_id = auth.uid())
  );

-- Create the project_financials table
CREATE TABLE IF NOT EXISTS public.project_financials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  transaction_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  amount NUMERIC NOT NULL,
  transaction_type TEXT NOT NULL, -- 'income', 'expense'
  category TEXT NOT NULL, -- 'labor', 'materials', 'equipment', 'services', 'other'
  description TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'paid', 'cancelled'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies to project_financials
ALTER TABLE public.project_financials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project owners and members can view financials"
  ON public.project_financials
  FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.project_members m WHERE m.project_id = project_id AND m.user_id = auth.uid())
  );

CREATE POLICY "Project owners and members can insert financials"
  ON public.project_financials
  FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.project_members m WHERE m.project_id = project_id AND m.user_id = auth.uid())
  );

CREATE POLICY "Project owners and members can update financials"
  ON public.project_financials
  FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.project_members m WHERE m.project_id = project_id AND m.user_id = auth.uid())
  );

CREATE POLICY "Project owners and members can delete financials"
  ON public.project_financials
  FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.project_members m WHERE m.project_id = project_id AND m.user_id = auth.uid())
  );
