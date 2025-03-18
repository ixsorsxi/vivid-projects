
import { ProjectDataState } from './useProjectState';

// Helper function for updating project data
export const setProjectData = (
  setter: React.Dispatch<React.SetStateAction<ProjectDataState>>,
  updater: (prev: ProjectDataState) => ProjectDataState
) => {
  setter(updater);
};
