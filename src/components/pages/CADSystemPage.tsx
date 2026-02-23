import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { aiMLService, type DesignAnalysis, type MLPrediction } from '@/services/aiMLService';
import { 
  Zap, Brain, Cpu, BarChart3, Lightbulb, Rocket, 
  TrendingUp, Shield, Gauge, Layers, Code, Database,
  ArrowRight, CheckCircle, AlertCircle, Sparkles
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  status: 'draft' | 'analyzing' | 'optimized' | 'production';
  analysis?: DesignAnalysis;
}

export default function CADSystemPage() {
  const [projects, setProjects] = useState<Project[]>([
    { id: '1', title: 'Aerospace Wing Design', status: 'optimized' },
    { id: '2', title: 'Robotics Arm Assembly', status: 'analyzing' },
    { id: '3', title: 'Thermal Management System', status: 'draft' },
  ]);

  const [selectedProject, setSelectedProject] = useState<Project | null>(projects[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showVariations, setShowVariations] = useState(false);
  const [variations, setVariations] = useState<any[]>([]);

  useEffect(() => {
    if (selectedProject && !selectedProject.analysis) {
      analyzeProject(selectedProject);
    }
  }, [selectedProject]);

  const analyzeProject = async (project: Project) => {
    setIsAnalyzing(true);
    try {
      const analysis = await aiMLService.analyzeDesign({ id: project.id });
      setSelectedProject(prev => prev ? { ...prev, analysis } : null);
      setProjects(prev => prev.map(p => 
        p.id === project.id ? { ...p, analysis, status: 'optimized' } : p
      ));
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateVariations = async () => {
    if (!selectedProject) return;
    setShowVariations(true);
    const vars = await aiMLService.generateDesignVariations({ id: selectedProject.id });
    setVariations(vars);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-aerospace-dark via-aerospace-dark to-black">
        {/* Hero Section */}
        <section className="relative w-full max-w-[120rem] mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Sparkles className="w-8 h-8 text-aerospace-accent" />
              <span className="text-aerospace-accent font-heading text-lg font-semibold">Phase 2: Beast CAD System</span>
            </div>
            <h1 className="font-heading text-6xl md:text-7xl font-bold text-white mb-6">
              Integrated AI/ML CAD System
            </h1>
            <p className="text-xl text-secondary-foreground max-w-3xl mx-auto mb-8">
              Industry-leading CAD platform with advanced machine learning, real-time optimization, and intelligent design suggestions. The reference system that reshapes engineering.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button className="bg-aerospace-accent hover:bg-aerospace-accent/90 text-black font-semibold px-8 py-6 text-lg">
                Start Designing <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="outline" className="border-aerospace-blue text-aerospace-blue hover:bg-aerospace-blue/10 px-8 py-6 text-lg">
                View Documentation
              </Button>
            </div>
          </motion.div>

          {/* Key Features Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
          >
            {[
              { icon: Brain, label: 'AI-Powered', desc: 'ML-driven optimization' },
              { icon: Zap, label: 'Real-Time', desc: 'Instant analysis' },
              { icon: Rocket, label: 'High Performance', desc: '10x faster' },
              { icon: Shield, label: 'Industry Grade', desc: 'Production ready' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="bg-primary/50 border border-aerospace-blue/30 rounded-xl p-6 backdrop-blur"
              >
                <feature.icon className="w-8 h-8 text-aerospace-accent mb-3" />
                <h3 className="font-heading font-semibold text-white mb-2">{feature.label}</h3>
                <p className="text-secondary-foreground text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Main CAD Interface */}
        <section className="relative w-full max-w-[120rem] mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Project List */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-1"
            >
              <Card className="bg-primary/50 border-aerospace-blue/30 p-6">
                <h3 className="font-heading font-semibold text-white mb-4 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-aerospace-accent" />
                  Projects
                </h3>
                <div className="space-y-3">
                  {projects.map(project => (
                    <motion.button
                      key={project.id}
                      onClick={() => setSelectedProject(project)}
                      whileHover={{ x: 5 }}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        selectedProject?.id === project.id
                          ? 'bg-aerospace-accent/20 border border-aerospace-accent'
                          : 'bg-primary/30 border border-transparent hover:border-aerospace-blue/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium text-sm">{project.title}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          project.status === 'optimized' ? 'bg-aerospace-success/20 text-aerospace-success' :
                          project.status === 'analyzing' ? 'bg-aerospace-warning/20 text-aerospace-warning' :
                          'bg-secondary/20 text-secondary-foreground'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Analysis Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-3"
            >
              {selectedProject && (
                <Tabs defaultValue="analysis" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-primary/50 border border-aerospace-blue/30">
                    <TabsTrigger value="analysis" className="text-xs md:text-sm">Analysis</TabsTrigger>
                    <TabsTrigger value="predictions" className="text-xs md:text-sm">Predictions</TabsTrigger>
                    <TabsTrigger value="variations" className="text-xs md:text-sm">Variations</TabsTrigger>
                    <TabsTrigger value="performance" className="text-xs md:text-sm">Performance</TabsTrigger>
                  </TabsList>

                  {/* Analysis Tab */}
                  <TabsContent value="analysis" className="space-y-6 mt-6">
                    {isAnalyzing ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <LoadingSpinner />
                        <p className="text-secondary-foreground mt-4">Analyzing design with ML models...</p>
                      </div>
                    ) : selectedProject.analysis ? (
                      <>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {[
                            { label: 'Structural', value: selectedProject.analysis.metrics.structuralIntegrity, icon: Shield },
                            { label: 'Aerodynamic', value: selectedProject.analysis.metrics.aerodynamicEfficiency, icon: Zap },
                            { label: 'Manufacturability', value: selectedProject.analysis.metrics.manufacturability, icon: Cpu },
                            { label: 'Cost', value: selectedProject.analysis.metrics.costEffectiveness, icon: TrendingUp },
                          ].map((metric, i) => (
                            <motion.div
                              key={i}
                              whileHover={{ scale: 1.05 }}
                              className="bg-primary/50 border border-aerospace-blue/30 rounded-lg p-4"
                            >
                              <metric.icon className="w-5 h-5 text-aerospace-accent mb-2" />
                              <p className="text-secondary-foreground text-xs mb-2">{metric.label}</p>
                              <p className="text-2xl font-bold text-white">{metric.value.toFixed(1)}%</p>
                              <div className="w-full bg-primary/50 rounded-full h-1 mt-2">
                                <div
                                  className="bg-aerospace-accent h-1 rounded-full transition-all"
                                  style={{ width: `${metric.value}%` }}
                                />
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        {/* Recommendations */}
                        <Card className="bg-primary/50 border-aerospace-blue/30 p-6">
                          <h4 className="font-heading font-semibold text-white mb-4 flex items-center gap-2">
                            <Lightbulb className="w-5 h-5 text-aerospace-accent" />
                            AI Recommendations
                          </h4>
                          <div className="space-y-3">
                            {selectedProject.analysis.recommendations.map((rec, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-start gap-3 p-3 bg-primary/30 rounded-lg border border-aerospace-blue/20"
                              >
                                <CheckCircle className="w-5 h-5 text-aerospace-success flex-shrink-0 mt-0.5" />
                                <p className="text-secondary-foreground text-sm">{rec}</p>
                              </motion.div>
                            ))}
                          </div>
                        </Card>
                      </>
                    ) : (
                      <div className="text-center py-12">
                        <Button onClick={() => analyzeProject(selectedProject)}>
                          Start Analysis
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  {/* Predictions Tab */}
                  <TabsContent value="predictions" className="space-y-6 mt-6">
                    {selectedProject.analysis?.predictions.map((pred: MLPrediction, i: number) => (
                      <motion.div
                        key={pred.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-primary/50 border border-aerospace-blue/30 rounded-lg p-6"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="font-heading font-semibold text-white capitalize">
                              {pred.type.replace('-', ' ')}
                            </h4>
                            <p className="text-secondary-foreground text-sm mt-1">{pred.suggestion}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-aerospace-accent font-bold">{(pred.confidenceScore * 100).toFixed(0)}%</p>
                            <p className="text-secondary-foreground text-xs">Confidence</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                          {Object.entries(pred.estimatedImpact).map(([key, value]: [string, any]) => (
                            <div key={key} className="bg-primary/30 rounded p-2">
                              <p className="text-secondary-foreground text-xs capitalize">{key}</p>
                              <p className={`font-bold ${value > 0 ? 'text-aerospace-success' : 'text-aerospace-danger'}`}>
                                {value > 0 ? '+' : ''}{value}%
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {pred.riskFactors.map((risk, j) => (
                            <span key={j} className="text-xs bg-aerospace-danger/20 text-aerospace-danger px-2 py-1 rounded flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {risk}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </TabsContent>

                  {/* Variations Tab */}
                  <TabsContent value="variations" className="space-y-6 mt-6">
                    {!showVariations ? (
                      <div className="text-center py-12">
                        <Button onClick={generateVariations} className="bg-aerospace-accent hover:bg-aerospace-accent/90 text-black">
                          Generate Design Variations
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {variations.map((variation, i) => (
                          <motion.div
                            key={variation.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-primary/50 border border-aerospace-blue/30 rounded-lg p-4 hover:border-aerospace-accent/50 transition-all cursor-pointer"
                          >
                            <h5 className="font-heading font-semibold text-white mb-3">{variation.name}</h5>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-secondary-foreground">Material:</span>
                                <span className="text-aerospace-accent font-semibold capitalize">{variation.parameters.material}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-secondary-foreground">Weight:</span>
                                <span className="text-white">{variation.predictedPerformance.weight.toFixed(2)} kg</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-secondary-foreground">Strength:</span>
                                <span className="text-white">{variation.predictedPerformance.strength.toFixed(0)} MPa</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-secondary-foreground">Cost:</span>
                                <span className="text-aerospace-success">${variation.predictedPerformance.cost.toFixed(0)}</span>
                              </div>
                            </div>
                            <Button className="w-full mt-4 bg-aerospace-blue/20 hover:bg-aerospace-blue/30 text-aerospace-blue">
                              Compare
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  {/* Performance Tab */}
                  <TabsContent value="performance" className="space-y-6 mt-6">
                    <Card className="bg-primary/50 border-aerospace-blue/30 p-6">
                      <h4 className="font-heading font-semibold text-white mb-6 flex items-center gap-2">
                        <Gauge className="w-5 h-5 text-aerospace-accent" />
                        Predicted Performance Metrics
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                          { label: 'Weight', value: '7.3 kg', unit: 'kg', icon: Gauge },
                          { label: 'Strength', value: '1250', unit: 'MPa', icon: Shield },
                          { label: 'Thermal Resistance', value: '0.85', unit: 'K/W', icon: Zap },
                          { label: 'Vibration Damping', value: '0.92', unit: 'ratio', icon: TrendingUp },
                        ].map((perf, i) => (
                          <motion.div
                            key={i}
                            whileHover={{ scale: 1.02 }}
                            className="bg-primary/30 border border-aerospace-blue/20 rounded-lg p-4"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <p className="text-secondary-foreground font-medium">{perf.label}</p>
                              <perf.icon className="w-5 h-5 text-aerospace-accent" />
                            </div>
                            <p className="text-3xl font-bold text-white">{perf.value}</p>
                            <p className="text-secondary-foreground text-xs mt-1">{perf.unit}</p>
                          </motion.div>
                        ))}
                      </div>
                    </Card>
                  </TabsContent>
                </Tabs>
              )}
            </motion.div>
          </div>
        </section>

        {/* Advanced Features Section */}
        <section className="relative w-full max-w-[120rem] mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-12 text-center">
              Advanced Features
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Brain,
                  title: 'Neural Design Engine',
                  desc: 'Deep learning models trained on millions of designs for intelligent optimization',
                  features: ['Pattern Recognition', 'Predictive Analytics', 'Auto-Optimization'],
                },
                {
                  icon: Cpu,
                  title: 'Real-Time Simulation',
                  desc: 'GPU-accelerated FEA and CFD for instant feedback during design',
                  features: ['Stress Analysis', 'Fluid Dynamics', 'Thermal Analysis'],
                },
                {
                  icon: Database,
                  title: 'Design Database',
                  desc: 'Access to millions of validated designs and components',
                  features: ['Component Library', 'Design Patterns', 'Best Practices'],
                },
                {
                  icon: Code,
                  title: 'API Integration',
                  desc: 'Connect with industry tools and external services',
                  features: ['REST API', 'Webhooks', 'Custom Plugins'],
                },
                {
                  icon: Rocket,
                  title: 'Collaborative Workspace',
                  desc: 'Real-time collaboration with team members globally',
                  features: ['Live Editing', 'Version Control', 'Comments'],
                },
                {
                  icon: TrendingUp,
                  title: 'Analytics Dashboard',
                  desc: 'Comprehensive insights into design performance and trends',
                  features: ['Performance Tracking', 'Trend Analysis', 'Reports'],
                },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                  className="bg-primary/50 border border-aerospace-blue/30 rounded-xl p-6 backdrop-blur hover:border-aerospace-accent/50 transition-all"
                >
                  <feature.icon className="w-8 h-8 text-aerospace-accent mb-4" />
                  <h3 className="font-heading font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-secondary-foreground text-sm mb-4">{feature.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {feature.features.map((f, j) => (
                      <span key={j} className="text-xs bg-aerospace-blue/20 text-aerospace-blue px-2 py-1 rounded">
                        {f}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="relative w-full max-w-[120rem] mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-aerospace-blue/20 to-aerospace-accent/20 border border-aerospace-accent/50 rounded-2xl p-12 text-center"
          >
            <h2 className="font-heading text-4xl font-bold text-white mb-4">
              Ready to Transform Your Design Process?
            </h2>
            <p className="text-secondary-foreground text-lg mb-8 max-w-2xl mx-auto">
              Join industry leaders using our AI-powered CAD system to create better designs faster.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button className="bg-aerospace-accent hover:bg-aerospace-accent/90 text-black font-semibold px-8 py-6 text-lg">
                Start Free Trial
              </Button>
              <Button variant="outline" className="border-aerospace-blue text-aerospace-blue hover:bg-aerospace-blue/10 px-8 py-6 text-lg">
                Schedule Demo
              </Button>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
