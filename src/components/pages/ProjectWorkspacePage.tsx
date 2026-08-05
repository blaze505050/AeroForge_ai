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
  Plus,
  X,
} from 'lucide-react';
import { useProjectStore } from '@/stores/projectStore';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CommandCenterSidebar from '@/components/CommandCenterSidebar';

export default function ProjectWorkspacePage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { currentProject, workspace, updateWorkspaceTab } = useProjectStore();
  const [notebookContent, setNotebookContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load project workspace data
    setIsLoading(false);
    setNotebookContent(`# ${currentProject?.name || 'Project'} - Engineering Notebook

## Project Overview
${currentProject?.description || 'Add project description here'}

## Design Requirements
- [ ] Requirement 1
- [ ] Requirement 2
- [ ] Requirement 3

## Design Approach
Document your design methodology and approach here.

## Simulation Plan
Outline the simulations you plan to run.

## Results & Analysis
Document your findings and analysis.

## Conclusions
Summarize your conclusions and next steps.
`);
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
                <div className="bg-primary border border-secondary/20 rounded-lg overflow-hidden">
                  <div className="p-6 border-b border-secondary/20 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-foreground">Engineering Notebook</h2>
                    <button className="flex items-center gap-2 px-4 py-2 bg-aerospace-blue/10 hover:bg-aerospace-blue/20 text-aerospace-blue rounded-lg transition-colors">
                      <Plus className="w-4 h-4" />
                      Add Section
                    </button>
                  </div>
                  <textarea
                    value={notebookContent}
                    onChange={(e) => setNotebookContent(e.target.value)}
                    className="w-full h-96 p-6 bg-aerospace-dark text-foreground font-mono text-sm focus:outline-none resize-none"
                    placeholder="# Engineering Notebook

Document your design process, assumptions, and findings here..."
                  />
                </div>
              )}

              {activeTab === 'simulations' && (
                <div className="bg-primary border border-secondary/20 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-foreground">Simulations</h2>
                    <button className="flex items-center gap-2 px-4 py-2 bg-aerospace-blue hover:bg-aerospace-accent text-white rounded-lg transition-colors">
                      <Plus className="w-4 h-4" />
                      New Simulation
                    </button>
                  </div>
                  <div className="text-center py-12">
                    <Cpu className="w-12 h-12 text-secondary-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-secondary-foreground">No simulations yet</p>
                    <p className="text-sm text-secondary-foreground mt-2">Create your first simulation to get started</p>
                  </div>
                </div>
              )}

              {activeTab === 'datasets' && (
                <div className="bg-primary border border-secondary/20 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-foreground">Datasets</h2>
                    <button className="flex items-center gap-2 px-4 py-2 bg-aerospace-blue hover:bg-aerospace-accent text-white rounded-lg transition-colors">
                      <Plus className="w-4 h-4" />
                      Upload Dataset
                    </button>
                  </div>
                  <div className="text-center py-12">
                    <Database className="w-12 h-12 text-secondary-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-secondary-foreground">No datasets yet</p>
                    <p className="text-sm text-secondary-foreground mt-2">Upload geometry, meshes, or results files</p>
                  </div>
                </div>
              )}

              {activeTab === 'results' && (
                <div className="bg-primary border border-secondary/20 rounded-lg p-6">
                  <h2 className="text-lg font-bold text-foreground mb-6">Results</h2>
                  <div className="text-center py-12">
                    <BarChart3 className="w-12 h-12 text-secondary-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-secondary-foreground">No results yet</p>
                    <p className="text-sm text-secondary-foreground mt-2">Run simulations to generate results</p>
                  </div>
                </div>
              )}

              {activeTab === 'validation' && (
                <div className="bg-primary border border-secondary/20 rounded-lg p-6">
                  <h2 className="text-lg font-bold text-foreground mb-6">Validation</h2>
                  <div className="text-center py-12">
                    <CheckCircle2 className="w-12 h-12 text-secondary-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-secondary-foreground">No validation reports yet</p>
                    <p className="text-sm text-secondary-foreground mt-2">Validation reports will appear here</p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
