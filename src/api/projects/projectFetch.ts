
import { supabase } from '@/integrations/supabase/client';
import { Project, ProjectMilestone, ProjectRisk, ProjectFinancial } from '@/lib/types/project';
import { toast } from '@/components/ui/toast-wrapper';
import { ProjectStatus } from '@/lib/types/common';
import { timeoutPromise, handleDatabaseError } from './utils';

export const fetchProjectById = async (projectId: string): Promise<Project | null> => {
  try {
    if (!projectId) {
      console.error('No project ID provided');
      return null;
    }

    console.log('Attempting to fetch project with ID:', projectId);
    
    // Basic project data
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .select(`
        id, 
        name, 
        description, 
        progress, 
        status, 
        due_date, 
        category,
        project_type,
        project_manager_id,
        start_date,
        estimated_cost,
        actual_cost,
        budget_approved,
        performance_index
      `)
      .eq('id', projectId)
      .single();

    if (projectError) {
      console.error('Error fetching project:', projectError);
      throw handleDatabaseError(projectError);
    }

    if (!projectData) {
      console.log('No project found with ID:', projectId);
      return null;
    }

    console.log('Successfully fetched project:', projectData);

    // Fetch project team members with error handling
    const { data: teamMembers, error: teamError } = await supabase
      .from('project_members')
      .select('id, user_id, name, role')
      .eq('project_id', projectId);
    
    if (teamError) {
      console.error('Error fetching team members:', teamError);
      // Continue with empty team members rather than failing the whole request
    }

    // Safely use the team members data
    const validTeamMembers = teamError ? [] : (teamMembers || []);

    // If we have a project manager ID, try to get their name
    let managerName = 'Not Assigned';
    if (projectData.project_manager_id) {
      const { data: manager, error: managerError } = await supabase
        .from('project_members')
        .select('name')
        .eq('project_id', projectId)
        .eq('user_id', projectData.project_manager_id)
        .single();
      
      if (!managerError && manager && manager.name) {
        managerName = manager.name;
      }
    }

    console.log('Project category from database:', projectData.category);

    // Transform database record to Project type
    return {
      id: projectData.id,
      name: projectData.name || '', 
      description: projectData.description || '',
      progress: projectData.progress || 0,
      status: projectData.status as ProjectStatus,
      dueDate: projectData.due_date || '',
      category: projectData.category || '',
      members: validTeamMembers.map(t => ({ 
        id: t.user_id, 
        name: t.name || 'Unnamed', 
        role: t.role || 'Member' 
      })) || [],
      team: validTeamMembers.map(t => ({ 
        id: t.id, 
        name: t.name || 'Unnamed', 
        role: t.role || 'Member',
        user_id: t.user_id 
      })) || [],
      project_type: projectData.project_type || 'Development',
      project_manager_id: projectData.project_manager_id || null,
      project_manager_name: managerName,
      start_date: projectData.start_date || '',
      estimated_cost: projectData.estimated_cost || 0,
      actual_cost: projectData.actual_cost || 0,
      budget_approved: projectData.budget_approved || false,
      performance_index: projectData.performance_index || 1.0
    };
  } catch (error) {
    console.error('Error in fetchProjectById:', error);
    throw error;
  }
};

export const fetchUserProjects = async (userId: string): Promise<Project[]> => {
  try {
    if (!userId) {
      console.error('No user ID provided for fetching projects');
      return [];
    }

    console.log('Fetching projects for user ID:', userId);
    
    const { data, error } = await supabase
      .from('projects')
      .select(`
        id, 
        name, 
        description, 
        progress, 
        status, 
        due_date, 
        category,
        project_type,
        project_manager_id
      `);

    if (error) {
      console.error('Error fetching projects:', error);
      throw handleDatabaseError(error);
    }

    console.log('Successfully fetched projects:', data);

    // Transform database records to Project type
    return (data || []).map(proj => ({
      id: proj.id,
      name: proj.name,
      description: proj.description || '',
      progress: proj.progress || 0,
      status: proj.status as ProjectStatus,
      dueDate: proj.due_date || '',
      category: proj.category || '',
      project_type: proj.project_type || 'Development',
      project_manager_id: proj.project_manager_id || null,
      members: []
    }));
  } catch (error) {
    console.error('Error in fetchUserProjects:', error);
    throw error;
  }
};

export const fetchProjectMilestones = async (projectId: string): Promise<ProjectMilestone[]> => {
  try {
    if (!projectId) {
      console.error('No project ID provided for fetching milestones');
      return [];
    }

    // For now, using a mock implementation until actual milestones table is created
    const mockMilestones: ProjectMilestone[] = [
      {
        id: '1',
        project_id: projectId,
        title: 'Project Kickoff',
        description: 'Initial project meeting and setup',
        due_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        completion_date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'completed',
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        project_id: projectId,
        title: 'Design Phase',
        description: 'Complete all design assets',
        due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'in-progress',
        created_at: new Date().toISOString()
      }
    ];

    return mockMilestones;
  } catch (error) {
    console.error('Error in fetchProjectMilestones:', error);
    return [];
  }
};

export const fetchProjectRisks = async (projectId: string): Promise<ProjectRisk[]> => {
  try {
    if (!projectId) {
      console.error('No project ID provided for fetching risks');
      return [];
    }

    // For now, using a mock implementation until actual risks table is created
    const mockRisks: ProjectRisk[] = [
      {
        id: '1',
        project_id: projectId,
        title: 'Timeline Delay',
        description: 'Potential delay due to resource constraints',
        severity: 'medium',
        probability: 'high',
        impact: 'medium',
        mitigation_plan: 'Allocate additional resources if needed',
        status: 'active'
      },
      {
        id: '2',
        project_id: projectId,
        title: 'Budget Overrun',
        description: 'Possible budget overrun due to scope changes',
        severity: 'high',
        probability: 'medium',
        impact: 'high',
        mitigation_plan: 'Strict change control process',
        status: 'monitored'
      }
    ];

    return mockRisks;
  } catch (error) {
    console.error('Error in fetchProjectRisks:', error);
    return [];
  }
};

export const fetchProjectFinancials = async (projectId: string): Promise<ProjectFinancial[]> => {
  try {
    if (!projectId) {
      console.error('No project ID provided for fetching financials');
      return [];
    }

    // For now, using a mock implementation until actual financials table is created
    const mockFinancials: ProjectFinancial[] = [
      {
        id: '1',
        project_id: projectId,
        transaction_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        amount: 5000,
        transaction_type: 'expense',
        category: 'Software',
        description: 'Software licenses',
        payment_status: 'paid'
      },
      {
        id: '2',
        project_id: projectId,
        transaction_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        amount: 2500,
        transaction_type: 'expense',
        category: 'Consulting',
        description: 'External consultant fees',
        payment_status: 'pending'
      }
    ];

    return mockFinancials;
  } catch (error) {
    console.error('Error in fetchProjectFinancials:', error);
    return [];
  }
};
