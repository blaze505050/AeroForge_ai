import { create } from 'zustand';

export interface Project {
  _id: string;
  name: string;
  description?: string;
  status: 'active' | 'archived' | 'completed';
  createdDate: Date;
  updatedDate: Date;
  owner?: string;
  tags?: string[];
}

export interface ProjectWorkspace {
  projectId: string;
  activeTab: 'notebook' | 'simulations' | 'datasets' | 'results' | 'validation';
  notebookContent?: string;
  selectedDataset?: string;
  selectedSimulation?: string;
}

interface ProjectStore {
  currentProject: Project | null;
  workspace: ProjectWorkspace | null;
  projects: Project[];
  
  setCurrentProject: (project: Project | null) => void;
  setWorkspace: (workspace: ProjectWorkspace | null) => void;
  setProjects: (projects: Project[]) => void;
  updateWorkspaceTab: (tab: ProjectWorkspace['activeTab']) => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  currentProject: null,
  workspace: null,
  projects: [],
  
  setCurrentProject: (project) => set({ currentProject: project }),
  setWorkspace: (workspace) => set({ workspace }),
  setProjects: (projects) => set({ projects }),
  updateWorkspaceTab: (tab) => set((state) => ({
    workspace: state.workspace ? { ...state.workspace, activeTab: tab } : null,
  })),
}));
