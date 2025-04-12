
import { ProjectRoleKey } from './types';

/**
 * Maps legacy role names to standardized role keys
 */
export const mapLegacyRole = (role: string): ProjectRoleKey => {
  // Normalize the role string
  const normalizedRole = role.toLowerCase().replace(/[\s-]/g, '_');
  
  // Map to valid ProjectRoleKey values
  switch (normalizedRole) {
    case 'project_manager':
    case 'project-manager':
    case 'projectmanager':
      return 'project_manager';
    case 'project_owner':
    case 'project-owner':
    case 'projectowner':
    case 'owner':
      return 'project_owner';
    case 'admin':
    case 'administrator':
      return 'admin';
    case 'developer':
    case 'dev':
      return 'developer';
    case 'designer':
      return 'designer';
    case 'client_stakeholder':
    case 'client-stakeholder':
    case 'client':
    case 'stakeholder':
      return 'client_stakeholder';
    case 'observer_viewer':
    case 'observer':
    case 'viewer':
      return 'observer_viewer';
    case 'qa_tester':
    case 'qa':
    case 'tester':
      return 'qa_tester';
    case 'scrum_master':
    case 'scrummaster':
      return 'scrum_master';
    case 'business_analyst':
    case 'analyst':
      return 'business_analyst';
    case 'coordinator':
      return 'coordinator';
    default:
      return 'team_member'; // Default fallback
  }
};
