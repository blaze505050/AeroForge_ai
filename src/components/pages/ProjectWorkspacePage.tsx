import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Cpu,
  Database,
  BarChart3,
  CheckCircle2,
  Settings,
  Share2,
  Download,
} from 'lucide-react';
import { useProjectStore } from '@/stores/projectStore';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CommandCenterSidebar from '@/components/CommandCenterSidebar';
import AICopilotSidebar from '@/components/AICopilotSidebar';
import EngineeringNotebook from '@/components/EngineeringNotebook';
import SimulationManager from '@/components/SimulationManager';
import DatasetManager from '@/components/DatasetManager';
import ResultsViewer from '@/components/ResultsViewer';
import ValidationReportGenerator from '@/components/ValidationReportGenerator';

export default function ProjectWorkspacePage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { currentProject, workspace, updateWorkspaceTab } = useProjectStore();
  const [notebookContent, setNotebookContent] = useState('');
  const [showCopilot, setShowCopilot] = useState(true);

  useEffect(() => {
    // Load project workspace data
    setNotebookContent(`# ${currentProject?.name || 'Project'} - Engineering Notebook\n\n## Project Overview\n${currentProject?.description || 'Add project description here'}\n\n## Design Requirements\n- [ ] Requirement 1\n- [ ] Requirement 2\n- [ ] Requirement 3\n\n## Design Approach\nDocument your design methodology and approach here.\n\n## Simulation Plan\nOutline the simulations you plan to run.\n\n## Results & Analysis\nDocument your findings and analysis.\n\n## Conclusions\nSummarize your conclusions and next steps.\n`);
  }, [currentProject]);

  const tabs = [
    { id: 'notebook', label: 'Engineering Notebook', icon: BookOpen },
    { id: 'simulations', label: 'Simulations', icon: Cpu },
    { id: 'datasets', label: 'Datasets', icon: Database },
    { id: 'results', label: 'Results', icon: BarChart3 },
    { id: 'validation', label: 'Validation', icon: CheckCircle2 },
  ] as const;

  const activeTab = (workspace?.activeTab || 'notebook') as typeof tabs[number]['id'];

  return (
    <div className="min-h-screen bg-aerospace-dark flex flex-col">
      <Header />
      <div className="flex flex-1">
        <CommandCenterSidebar />
        <main className="flex-1 lg:ml-64">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
            {/* Project Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-foreground font-heading mb-2">
                    {currentProject?.name || 'Project Workspace'}
                  </h1>
                  <p className="text-secondary-foreground">
                    {currentProject?.description}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-primary/50 rounded-lg transition-colors">
                    <Share2 className="w-5 h-5 text-secondary-foreground" />
                  </button>
                  <button className="p-2 hover:bg-primary/50 rounded-lg transition-colors">
                    <Download className="w-5 h-5 text-secondary-foreground" />
                  </button>
                  <button className="p-2 hover:bg-primary/50 rounded-lg transition-colors">
                    <Settings className="w-5 h-5 text-secondary-foreground" />
                  </button>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex gap-2 border-b border-secondary/20 overflow-x-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => updateWorkspaceTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all whitespace-nowrap ${
                        isActive
                          ? 'border-aerospace-blue text-aerospace-blue'
                          : 'border-transparent text-secondary-foreground hover:text-foreground'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Tab Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {activeTab === 'notebook' && (
                <EngineeringNotebook projectId={projectId!} initialContent={notebookContent} />
              )}

              {activeTab === 'simulations' && (
                <SimulationManager projectId={projectId!} />
              )}

              {activeTab === 'datasets' && (
                <DatasetManager projectId={projectId!} />
              )}

              {activeTab === 'results' && (
                <ResultsViewer projectId={projectId!} />
              )}

              {activeTab === 'validation' && (
                <ValidationReportGenerator projectId={projectId!} />
              )}
            </motion.div>
          </div>
        </main>
      </div>
      <Footer />

      {/* AI Copilot Sidebar */}
      <AICopilotSidebar
        projectId={projectId!}
        isOpen={showCopilot}
        onToggle={setShowCopilot}
      />
    </div>
  );
}
