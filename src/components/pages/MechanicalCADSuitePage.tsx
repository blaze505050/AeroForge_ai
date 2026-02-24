import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { aiMLService, type DesignAnalysis } from '@/services/aiMLService';
import { 
  Zap, Brain, Cpu, BarChart3, Lightbulb, Rocket, 
  TrendingUp, Shield, Gauge, Layers, Code, Database,
  ArrowRight, CheckCircle, AlertCircle, Sparkles, Box, Settings,
  Play, Download, RotateCcw, Eye, Wand2, Wind
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'compiling' | 'editing' | 'analyzing' | 'optimized';
  geometry?: any;
  analysis?: DesignAnalysis;
  createdAt: Date;
}

interface DesignInput {
  naturalLanguage: string;
  parameters: Record<string, any>;
}

export default function MechanicalCADSuitePage() {
  const [activeTab, setActiveTab] = useState('design');
  const [projects, setProjects] = useState<Project[]>([
    { 
      id: '1', 
      title: 'Aerospace Wing Design', 
      description: 'High-performance wing with optimized aerodynamics',
      status: 'optimized',
      createdAt: new Date()
    },
    { 
      id: '2', 
      title: 'Robotics Arm Assembly', 
      description: 'Multi-joint robotic arm with load analysis',
      status: 'analyzing',
      createdAt: new Date()
    },
    { 
      id: '3', 
      title: 'Thermal Management System', 
      description: 'Heat sink design with CFD analysis',
      status: 'draft',
      createdAt: new Date()
    },
  ]);

  const [selectedProject, setSelectedProject] = useState<Project | null>(projects[0]);
  const [designInput, setDesignInput] = useState<DesignInput>({
    naturalLanguage: 'Create a rectangular wing with 2m span, 0.5m chord, and 5mm thickness',
    parameters: {}
  });
  const [isCompiling, setIsCompiling] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showOptimizations, setShowOptimizations] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Compile design from natural language
  const handleCompileDesign = async () => {
    if (!designInput.naturalLanguage.trim()) return;
    
    setIsCompiling(true);
    try {
      // Simulate compilation process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newProject: Project = {
        id: Date.now().toString(),
        title: designInput.naturalLanguage.substring(0, 50),
        description: 'Generated from natural language input',
        status: 'compiling',
        createdAt: new Date()
      };
      
      setProjects(prev => [newProject, ...prev]);
      setSelectedProject(newProject);
      setActiveTab('edit');
      setDesignInput({ naturalLanguage: '', parameters: {} });
    } catch (error) {
      console.error('Compilation failed:', error);
    } finally {
      setIsCompiling(false);
    }
  };

  // Analyze design
  const handleAnalyzeDesign = async () => {
    if (!selectedProject) return;
    
    setIsAnalyzing(true);
    try {
      const analysis = await aiMLService.analyzeDesign({ id: selectedProject.id });
      setSelectedProject(prev => prev ? { ...prev, analysis, status: 'analyzing' } : null);
      setProjects(prev => prev.map(p => 
        p.id === selectedProject.id ? { ...p, analysis, status: 'analyzing' } : p
      ));
      setActiveTab('analyze');
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Optimize design with AI
  const handleOptimizeDesign = async () => {
    if (!selectedProject?.analysis) return;
    
    setShowOptimizations(true);
    setActiveTab('optimize');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />

      <main className="w-full max-w-[120rem] mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className="mb-12">
            <h1 className="font-heading text-5xl md:text-6xl font-bold text-white mb-2">
              Mechanical CAD Suite
            </h1>
            <p className="font-paragraph text-lg text-slate-400 mb-6">
              Unified Design → Compile → Analyze → Optimize Workflow
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/50 rounded-full text-sm text-blue-300">
                AI-Powered Design
              </span>
              <span className="px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full text-sm text-green-300">
                Integrated Analysis
              </span>
              <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/50 rounded-full text-sm text-purple-300">
                Professional Grade
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Project Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 sticky top-24">
                <h2 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Box className="w-5 h-5" />
                  Projects
                </h2>
                
                <div className="space-y-3 mb-6 max-h-[400px] overflow-y-auto">
                  {projects.map(project => (
                    <button
                      key={project.id}
                      onClick={() => setSelectedProject(project)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedProject?.id === project.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-900 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <p className="font-semibold text-sm truncate">{project.title}</p>
                      <p className="text-xs opacity-75 truncate">{project.description}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          project.status === 'optimized' ? 'bg-green-400' :
                          project.status === 'analyzing' ? 'bg-yellow-400' :
                          'bg-slate-500'
                        }`} />
                        <span className="text-xs opacity-75">{project.status}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <Button
                  onClick={() => {
                    setActiveTab('design');
                    setDesignInput({ naturalLanguage: '', parameters: {} });
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  New Project
                </Button>
              </div>
            </div>

            {/* Main Workspace */}
            <div className="lg:col-span-3">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-slate-800 border border-slate-700 p-1 rounded-lg">
                  <TabsTrigger value="design" className="font-paragraph">Design</TabsTrigger>
                  <TabsTrigger value="edit" className="font-paragraph">Edit</TabsTrigger>
                  <TabsTrigger value="analyze" className="font-paragraph">Analyze</TabsTrigger>
                  <TabsTrigger value="optimize" className="font-paragraph">Optimize</TabsTrigger>
                </TabsList>

                {/* DESIGN TAB - Natural Language Input */}
                <TabsContent value="design" className="space-y-6">
                  <Card className="bg-slate-800 border-slate-700 p-6">
                    <h3 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Wand2 className="w-5 h-5" />
                      Natural Language Design Input
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="font-paragraph text-sm font-semibold text-slate-300 block mb-2">
                          Describe your design in natural language
                        </label>
                        <textarea
                          value={designInput.naturalLanguage}
                          onChange={(e) => setDesignInput({ ...designInput, naturalLanguage: e.target.value })}
                          placeholder="E.g., Create a rectangular wing with 2m span, 0.5m chord, and 5mm thickness with a NACA 2412 airfoil profile"
                          className="w-full h-32 px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white font-paragraph placeholder-slate-500 focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                        <h4 className="font-heading text-sm font-bold text-white mb-3">Design Parameters</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {['Length', 'Width', 'Height', 'Thickness'].map(param => (
                            <div key={param}>
                              <label className="font-paragraph text-xs text-slate-400 block mb-1">{param}</label>
                              <input
                                type="number"
                                placeholder="mm"
                                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white font-paragraph text-sm"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button
                        onClick={handleCompileDesign}
                        disabled={isCompiling || !designInput.naturalLanguage.trim()}
                        className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white py-3"
                      >
                        {isCompiling ? (
                          <>
                            <LoadingSpinner />
                            Compiling...
                          </>
                        ) : (
                          <>
                            <Code className="w-4 h-4 mr-2" />
                            Compile Design
                          </>
                        )}
                      </Button>
                    </div>
                  </Card>

                  {/* Design Tips */}
                  <Card className="bg-slate-800 border-slate-700 p-6">
                    <h4 className="font-heading text-sm font-bold text-white mb-3 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      Design Tips
                    </h4>
                    <ul className="space-y-2 font-paragraph text-sm text-slate-300">
                      <li className="flex gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        Be specific about dimensions and materials
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        Include manufacturing constraints
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        Specify performance requirements
                      </li>
                    </ul>
                  </Card>
                </TabsContent>

                {/* EDIT TAB - Parametric Editing */}
                <TabsContent value="edit" className="space-y-6">
                  <Card className="bg-slate-800 border-slate-700 p-6">
                    <h3 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Box className="w-5 h-5" />
                      Parametric Editor
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                        <canvas
                          ref={canvasRef}
                          className="w-full h-64 bg-slate-950 rounded border border-slate-600"
                        />
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="font-paragraph text-sm font-semibold text-slate-300 block mb-2">
                            Sketch Plane
                          </label>
                          <select className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white font-paragraph">
                            <option>XY Plane</option>
                            <option>YZ Plane</option>
                            <option>XZ Plane</option>
                          </select>
                        </div>

                        <div>
                          <label className="font-paragraph text-sm font-semibold text-slate-300 block mb-2">
                            Feature Type
                          </label>
                          <select className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white font-paragraph">
                            <option>Pad/Extrude</option>
                            <option>Pocket</option>
                            <option>Fillet</option>
                            <option>Chamfer</option>
                            <option>Revolution</option>
                          </select>
                        </div>

                        <div>
                          <label className="font-paragraph text-sm font-semibold text-slate-300 block mb-2">
                            Dimension (mm)
                          </label>
                          <input
                            type="number"
                            placeholder="0"
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white font-paragraph"
                          />
                        </div>

                        <Button className="w-full bg-green-600 hover:bg-green-500 text-white">
                          <Play className="w-4 h-4 mr-2" />
                          Apply Feature
                        </Button>
                      </div>
                    </div>

                    <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                      <h4 className="font-heading text-sm font-bold text-white mb-3">Feature History</h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        <div className="flex items-center gap-2 p-2 bg-slate-800 rounded text-sm text-slate-300">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          Sketch: Base Profile
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-slate-800 rounded text-sm text-slate-300">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          Pad: Extrude 50mm
                        </div>
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                {/* ANALYZE TAB - FEA & CFD */}
                <TabsContent value="analyze" className="space-y-6">
                  <Card className="bg-slate-800 border-slate-700 p-6">
                    <h3 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Analysis Tools
                    </h3>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {[
                        { title: 'Structural Analysis', icon: Shield, desc: 'Stress & strain' },
                        { title: 'Thermal Analysis', icon: Zap, desc: 'Heat transfer' },
                        { title: 'Modal Analysis', icon: Gauge, desc: 'Natural frequencies' },
                        { title: 'CFD Analysis', icon: Wind, desc: 'Fluid dynamics' },
                      ].map((analysis, i) => {
                        const Icon = analysis.icon;
                        return (
                          <button
                            key={i}
                            onClick={handleAnalyzeDesign}
                            disabled={isAnalyzing || !selectedProject}
                            className="p-4 bg-slate-900 border border-slate-700 rounded-lg hover:border-blue-500 transition-colors disabled:opacity-50"
                          >
                            <Icon className="w-6 h-6 text-blue-400 mb-2" />
                            <p className="font-heading text-sm font-bold text-white">{analysis.title}</p>
                            <p className="font-paragraph text-xs text-slate-400">{analysis.desc}</p>
                          </button>
                        );
                      })}
                    </div>

                    {selectedProject?.analysis && (
                      <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                        <h4 className="font-heading text-sm font-bold text-white mb-3">Analysis Results</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-slate-800 rounded">
                            <p className="font-paragraph text-xs text-slate-400">Max Stress</p>
                            <p className="font-heading text-lg text-blue-400">{selectedProject.analysis.maxStress?.toFixed(2) || 'N/A'} MPa</p>
                          </div>
                          <div className="p-3 bg-slate-800 rounded">
                            <p className="font-paragraph text-xs text-slate-400">Factor of Safety</p>
                            <p className="font-heading text-lg text-green-400">{selectedProject.analysis.factorOfSafety?.toFixed(2) || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={handleAnalyzeDesign}
                      disabled={isAnalyzing || !selectedProject}
                      className="w-full mt-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white"
                    >
                      {isAnalyzing ? (
                        <>
                          <LoadingSpinner />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Run Analysis
                        </>
                      )}
                    </Button>
                  </Card>
                </TabsContent>

                {/* OPTIMIZE TAB - AI Optimization */}
                <TabsContent value="optimize" className="space-y-6">
                  <Card className="bg-slate-800 border-slate-700 p-6">
                    <h3 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Brain className="w-5 h-5" />
                      AI-Powered Optimization
                    </h3>

                    {showOptimizations ? (
                      <div className="space-y-4">
                        {[
                          {
                            title: 'Geometry Optimization',
                            improvement: '+15% strength',
                            description: 'Redistribute material for better load paths'
                          },
                          {
                            title: 'Weight Reduction',
                            improvement: '-12% weight',
                            description: 'Remove non-critical material while maintaining safety'
                          },
                          {
                            title: 'Manufacturing Cost',
                            improvement: '-8% cost',
                            description: 'Simplify geometry for easier manufacturing'
                          },
                          {
                            title: 'Thermal Performance',
                            improvement: '+22% efficiency',
                            description: 'Optimize cooling channels and fin geometry'
                          },
                        ].map((opt, i) => (
                          <div key={i} className="p-4 bg-slate-900 rounded-lg border border-slate-700 hover:border-green-500/50 transition-colors cursor-pointer">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="font-heading text-sm font-bold text-white">{opt.title}</p>
                                <p className="font-paragraph text-xs text-slate-400 mt-1">{opt.description}</p>
                              </div>
                              <span className="px-2 py-1 bg-green-500/20 border border-green-500/50 rounded text-xs text-green-300 font-semibold">
                                {opt.improvement}
                              </span>
                            </div>
                            <Button className="w-full mt-3 bg-green-600 hover:bg-green-500 text-white text-sm py-2">
                              Apply Optimization
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Brain className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                        <p className="font-paragraph text-slate-400 mb-4">
                          Run analysis first to generate AI optimization suggestions
                        </p>
                        <Button
                          onClick={handleOptimizeDesign}
                          className="bg-blue-600 hover:bg-blue-500 text-white"
                        >
                          Generate Optimizations
                        </Button>
                      </div>
                    )}
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                title: 'Natural Language Design',
                description: 'Describe your design in plain English, AI compiles to parametric CAD',
                icon: Code,
              },
              {
                title: 'Parametric Editing',
                description: 'Full control over geometry with real-time 3D preview',
                icon: Box,
              },
              {
                title: 'Integrated Analysis',
                description: 'Structural, thermal, modal, and CFD analysis in one platform',
                icon: BarChart3,
              },
              {
                title: 'AI Optimization',
                description: 'Automatic design suggestions for strength, weight, and cost',
                icon: Brain,
              },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-blue-500/50 transition-colors">
                  <Icon className="w-8 h-8 text-blue-400 mb-3" />
                  <h3 className="font-heading text-lg font-bold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="font-paragraph text-slate-400 text-sm">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

