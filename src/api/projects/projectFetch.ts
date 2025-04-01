
import { supabase } from '@/integrations/supabase/client';
import { Project, ProjectMilestone, ProjectRisk, ProjectFinancial } from '@/lib/types/project';
import { toast } from '@/components/ui/toast-wrapper';
import { ProjectStatus, TeamMember } from '@/lib/types/common';
import { timeoutPromise, handleDatabaseError } from './utils';

export const fetchProjectById = async (projectId: string): Promise<Project | null> => {
  try {
    if (!projectId) {
      console.error('No project ID provided');
      return null;
    }

    console.log('Attempting to fetch project with ID:', projectId);
    
    // Try using the get_project_by_id RPC function first since it has SECURITY DEFINER
    // which should avoid RLS recursion issues
    try {
      const { data: projectData, error: rpcError } = await supabase
        .rpc('get_project_by_id', { p_project_id: projectId });

      if (rpcError) {
        console.error('Error fetching project with RPC:', rpcError);
        // If RPC fails, we'll try the fallback method below
        throw rpcError;
      }

      if (!projectData) {
        console.log('No project found with ID:', projectId);
        return null;
      }

      console.log('Successfully fetched project via RPC:', projectData);
      
      // The RPC returns a single row object, not an array
      const project = Array.isArray(projectData) ? projectData[0] : projectData;
      
      if (!project) {
        return null;
      }
      
      // Process team data to ensure it's compatible with TeamMember type
      let teamMembers: TeamMember[] = [];
      if (project.team) {
        // Convert JSON team data to proper TeamMember objects
        teamMembers = Array.isArray(project.team) 
          ? project.team.map((member: any) => ({
              id: member.id || String(Date.now()),
              name: member.name || 'Team Member',
              role: member.role || 'Member'
            }))
          : [];
      }
      
      // Get project manager name
      let managerName = 'Not Assigned';
      if (project.project_manager_id) {
        // Look for the project manager in the team members list
        const manager = teamMembers.find(member => member.id.toString() === project.project_manager_id.toString() 
                                          || (member.user_id && member.user_id.toString() === project.project_manager_id.toString()));
        if (manager) {
          managerName = manager.name;
        }
      }
      
      // Transform the returned data to Project type
      return {
        id: project.id,
        name: project.name || '', 
        description: project.description || '',
        progress: project.progress || 0,
        status: project.status as ProjectStatus,
        dueDate: project.due_date || '',
        category: project.category || '',
        members: [], // Will be populated from team data
        team: teamMembers,
        project_type: project.project_type || 'Development',
        project_manager_id: project.project_manager_id || null,
        project_manager_name: managerName,
        start_date: project.start_date || '',
        estimated_cost: project.estimated_cost || 0,
        actual_cost: project.actual_cost || 0,
        budget_approved: project.budget_approved || false,
        performance_index: project.performance_index || 1.0
      };
    } catch (rpcError) {
      // Fallback to direct table query if RPC approach fails
      console.log('RPC method failed, falling back to direct query');
    }
    
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
      // Check if the project manager is in the team members list
      const manager = validTeamMembers.find(m => 
        m.user_id === projectData.project_manager_id || 
        m.id === projectData.project_manager_id
      );
      
      if (manager && manager.name) {
        managerName = manager.name;
      } else {
        // Try to fetch directly if not found in team members
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
    }

    console.log('Project category from database:', projectData.category);
    console.log('Project manager:', managerName);
    console.log('Team members count:', validTeamMembers.length);

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
    
    // Try the standard way first - querying projects directly
    try {
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
        // If this fails, we'll try the fallback below
        console.warn('Standard project fetch failed:', error);
        throw error;
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
    } catch (standardError) {
      console.log('Attempting to use get_user_projects function due to standard fetch failure');
      
      // Try using the RPC function as a fallback (if it exists)
      try {
        const { data: rpcData, error: rpcError } = await supabase
          .rpc('get_user_projects');
          
        if (rpcError) {
          console.error('Error using get_user_projects RPC:', rpcError);
          // Since both methods failed, fall back to demo data
          return getDemoProjects();
        }
        
        console.log('Successfully fetched projects using RPC:', rpcData);
        
        // Transform database records to Project type
        return (rpcData || []).map(proj => ({
          id: proj.id,
          name: proj.name,
          description: proj.description || '',
          progress: proj.progress || 0,
          status: proj.status as ProjectStatus,
          dueDate: proj.due_date || '',
          category: proj.category || '',
          project_type: 'Development', // Default since RPC might not return this
          project_manager_id: null, // Default since RPC might not return this
          members: []
        }));
      } catch (rpcError) {
        console.error('All methods of fetching projects failed');
        // Both methods failed, return demo data
        return getDemoProjects();
      }
    }
  } catch (error) {
    console.error('Error in fetchUserProjects:', error);
    // Return demo data as fallback
    return getDemoProjects();
  }
};

// Demo data fallback for when database access fails
function getDemoProjects(): Project[] {
  return [
    {
      id: 'demo-1',
      name: 'Website Redesign',
      description: 'Redesign the company website with modern UI/UX',
      progress: 65,
      status: 'in-progress',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      category: 'Design',
      project_type: 'Design',
      members: [
        { id: 'user1', name: 'John Doe', role: 'Project Manager' },
        { id: 'user2', name: 'Jane Smith', role: 'Designer' }
      ],
      project_manager_id: 'user1',
      project_manager_name: 'John Doe'
    },
    {
      id: 'demo-2',
      name: 'Mobile App Development',
      description: 'Develop a mobile app for customer engagement',
      progress: 30,
      status: 'in-progress',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      category: 'Development',
      project_type: 'Development',
      members: [
        { id: 'user1', name: 'John Doe', role: 'Product Owner' },
        { id: 'user3', name: 'Mike Johnson', role: 'Developer' }
      ],
      project_manager_id: 'user1',
      project_manager_name: 'John Doe'
    },
    {
      id: 'demo-3',
      name: 'Marketing Campaign',
      description: 'Q3 Marketing Campaign for new product launch',
      progress: 100,
      status: 'completed',
      dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      category: 'Marketing',
      project_type: 'Marketing',
      members: [
        { id: 'user4', name: 'Sarah Williams', role: 'Marketing Lead' },
        { id: 'user5', name: 'James Brown', role: 'Content Creator' }
      ],
      project_manager_id: 'user4',
      project_manager_name: 'Sarah Williams'
    }
  ];
}

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
