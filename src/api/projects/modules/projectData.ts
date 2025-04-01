
import { ProjectMilestone, ProjectRisk, ProjectFinancial } from '@/lib/types/project';

/**
 * Fetches milestones for a specific project
 */
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

/**
 * Fetches risks for a specific project
 */
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

/**
 * Fetches financial data for a specific project
 */
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
