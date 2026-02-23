import React, { useState } from 'react';
import { motion } from 'framer-motion';
import CADWorkspace from '@/components/CADWorkspace';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { aiMLService } from '@/services/aiMLService';
import { apiIntegrationService } from '@/services/apiIntegrationService';
import {
  Brain, Zap, BarChart3, Lightbulb, Download, Upload, Share2,
  Settings, HelpCircle, Bell, User, LogOut, Maximize2, Minimize2,
  Play, Pause, Save, RotateCw, Copy, Trash2, Plus, Minus
} from 'lucide-react';

interface EditorState {
  projectId: string;
  projectName: string;
  isFullscreen: boolean;
  showAIPanel: boolean;
  showAnalytics: boolean;
  isProcessing: boolean;
}

export default function CADEditorPage() {
  const [state, setState] = useState<EditorState>({
    projectId: 'proj-001',
    projectName: 'Advanced Aerospace Component',
    isFullscreen: false,
    showAIPanel: true,
    showAnalytics: false,
    isProcessing: false,
  });

  const [aiSuggestions, setAISuggestions] = useState<any[]>([]);
  const [simulationResults, setSimulationResults] = useState<any>(null);

  const handleAIAnalysis = async () => {
    setState(prev => ({ ...prev, isProcessing: true }));
    try {
      const analysis = await aiMLService.analyzeDesign({ id: state.projectId });
      setAISuggestions(analysis.predictions);
    } catch (error) {
      console.error('AI analysis failed:', error);
    } finally {
      setState(prev => ({ ...prev, isProcessing: false }));
    }
  };

  const handleRunSimulation = async () => {
    setState(prev => ({ ...prev, isProcessing: true }));
    try {
      const results = await apiIntegrationService.runSimulation(
        state.projectId,
        'structural-analysis',
        {}
      );
      setSimulationResults(results);
    } catch (error) {
      console.error('Simulation failed:', error);
    } finally {
      setState(prev => ({ ...prev, isProcessing: false }));
    }
  };

  const handleExport = async () => {
    try {
      const blob = await apiIntegrationService.exportDesign(state.projectId, 'step');
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${state.projectName}.step`;
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-aerospace-dark">
      {/* Top Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-primary/80 border-b border-aerospace-blue/30 px-6 py-3 flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div>
            <h1 className="font-heading font-bold text-white text-lg">{state.projectName}</h1>
            <p className="text-secondary-foreground text-xs">ID: {state.projectId}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleAIAnalysis}
            disabled={state.isProcessing}
            className="flex items-center gap-2"
          >
            <Brain className="w-4 h-4" />
            AI Analysis
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={handleRunSimulation}
            disabled={state.isProcessing}
            className="flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            Simulate
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={handleExport}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>

          <Button
            size="sm"
            variant="ghost"
            className="flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share
          </Button>

          <Button
            size="sm"
            variant="ghost"
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
          </Button>

          <Button
            size="sm"
            variant="ghost"
            className="flex items-center gap-2"
          >
            <User className="w-4 h-4" />
          </Button>
        </div>
      </motion.nav>

      {/* Main Editor Area */}
      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        {/* CAD Workspace */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 min-w-0"
        >
          <CADWorkspace
            projectId={state.projectId}
            projectName={state.projectName}
          />
        </motion.div>

        {/* Right Sidebar - AI & Analytics */}
        {state.showAIPanel && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="w-96 flex flex-col gap-4 overflow-hidden"
          >
            {/* AI Suggestions Panel */}
            <Card className="bg-primary/50 border-aerospace-blue/30 p-4 flex-1 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-semibold text-white flex items-center gap-2">
                  <Brain className="w-5 h-5 text-aerospace-accent" />
                  AI Suggestions
                </h3>
                <button
                  onClick={() => setState(prev => ({ ...prev, showAIPanel: false }))}
                  className="text-secondary-foreground hover:text-white"
                >
                  ×
                </button>
              </div>

              {state.isProcessing ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <LoadingSpinner />
                  <p className="text-secondary-foreground text-sm mt-3">Analyzing design...</p>
                </div>
              ) : aiSuggestions.length > 0 ? (
                <div className="space-y-3">
                  {aiSuggestions.map((suggestion, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-primary/30 border border-aerospace-blue/20 rounded-lg p-3 hover:border-aerospace-accent/50 transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-white text-sm capitalize">
                          {suggestion.type.replace('-', ' ')}
                        </h4>
                        <span className="text-xs bg-aerospace-accent/20 text-aerospace-accent px-2 py-1 rounded">
                          {(suggestion.confidenceScore * 100).toFixed(0)}%
                        </span>
                      </div>
                      <p className="text-secondary-foreground text-xs mb-2">{suggestion.suggestion}</p>
                      <Button size="sm" className="w-full bg-aerospace-blue/20 hover:bg-aerospace-blue/30 text-aerospace-blue text-xs">
                        Apply Suggestion
                      </Button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Lightbulb className="w-8 h-8 text-secondary-foreground mx-auto mb-2 opacity-50" />
                  <p className="text-secondary-foreground text-sm">Run AI analysis to get suggestions</p>
                  <Button
                    size="sm"
                    onClick={handleAIAnalysis}
                    className="mt-3 bg-aerospace-accent hover:bg-aerospace-accent/90 text-black"
                  >
                    Analyze Now
                  </Button>
                </div>
              )}
            </Card>

            {/* Simulation Results Panel */}
            <Card className="bg-primary/50 border-aerospace-blue/30 p-4 flex-1 overflow-y-auto">
              <h3 className="font-heading font-semibold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-aerospace-accent" />
                Simulation Results
              </h3>

              {simulationResults ? (
                <div className="space-y-3">
                  {[
                    { label: 'Max Stress', value: `${simulationResults.results.maxStress} MPa`, icon: '📊' },
                    { label: 'Max Deflection', value: `${simulationResults.results.maxDeflection} mm`, icon: '📈' },
                    { label: 'Safety Factor', value: `${simulationResults.results.safetyFactor}x`, icon: '🛡️' },
                    { label: 'Temperature', value: `${simulationResults.results.temperature}°C`, icon: '🌡️' },
                  ].map((result, i) => (
                    <div key={i} className="bg-primary/30 border border-aerospace-blue/20 rounded-lg p-3">
                      <p className="text-secondary-foreground text-xs mb-1">{result.label}</p>
                      <p className="text-white font-bold text-lg">{result.value}</p>
                    </div>
                  ))}
                  <Button
                    size="sm"
                    onClick={handleRunSimulation}
                    className="w-full bg-aerospace-blue/20 hover:bg-aerospace-blue/30 text-aerospace-blue"
                  >
                    Re-run Simulation
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <BarChart3 className="w-8 h-8 text-secondary-foreground mx-auto mb-2 opacity-50" />
                  <p className="text-secondary-foreground text-sm">Run simulation to see results</p>
                  <Button
                    size="sm"
                    onClick={handleRunSimulation}
                    className="mt-3 bg-aerospace-accent hover:bg-aerospace-accent/90 text-black"
                  >
                    Run Simulation
                  </Button>
                </div>
              )}
            </Card>

            {/* Quick Actions */}
            <Card className="bg-primary/50 border-aerospace-blue/30 p-4">
              <h3 className="font-heading font-semibold text-white mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" variant="outline" className="border-aerospace-blue text-aerospace-blue hover:bg-aerospace-blue/10">
                  <Plus className="w-4 h-4 mr-1" />
                  New Layer
                </Button>
                <Button size="sm" variant="outline" className="border-aerospace-blue text-aerospace-blue hover:bg-aerospace-blue/10">
                  <Copy className="w-4 h-4 mr-1" />
                  Duplicate
                </Button>
                <Button size="sm" variant="outline" className="border-aerospace-blue text-aerospace-blue hover:bg-aerospace-blue/10">
                  <RotateCw className="w-4 h-4 mr-1" />
                  Undo
                </Button>
                <Button size="sm" variant="outline" className="border-aerospace-blue text-aerospace-blue hover:bg-aerospace-blue/10">
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
