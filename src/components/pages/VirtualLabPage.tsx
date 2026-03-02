import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Wind, Database, Wrench, Zap, Download, Cpu, Calculator, 
  Microscope, Beaker, Gauge, Layers, Rocket, Brain, Workflow,
  BarChart3, GitBranch, Target, Lightbulb, Settings, Play, Users
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface LabTool {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  features: string[];
  color: string;
  path?: string;
  isActive: boolean;
}

const labTools: LabTool[] = [
  {
    id: 'airfoil-designer',
    title: 'Airfoil Design Studio',
    description: 'Real-time aerodynamic airfoil design with NACA profile generation and optimization',
    icon: <Wind className="w-8 h-8" />,
    category: 'Aerodynamics',
    features: ['NACA Generation', 'Real-time Visualization', 'Geometry Optimization', 'CAD Export'],
    color: 'from-blue-500 to-cyan-500',
    path: '/airfoil-designer',
    isActive: true,
  },
  {
    id: 'cfd-simulator',
    title: 'CFD Solver Lab',
    description: 'Production-grade computational fluid dynamics with mesh generation and advanced monitoring',
    icon: <Cpu className="w-8 h-8" />,
    category: 'Simulation',
    features: ['Mesh Generation', 'Solver Configuration', 'Results Visualization', 'Data Export'],
    color: 'from-purple-500 to-pink-500',
    path: '/cfd-simulator',
    isActive: true,
  },
  {
    id: 'wing-calculator',
    title: 'Wing Performance Lab',
    description: 'Advanced wing aerodynamic analysis and performance characteristic computation',
    icon: <Calculator className="w-8 h-8" />,
    category: 'Analysis',
    features: ['Wing Span Calc', 'Performance Metrics', 'Speed Analysis', 'CSV Export'],
    color: 'from-amber-500 to-yellow-500',
    path: '/wing-calculator',
    isActive: true,
  },
  {
    id: 'thrust-calculator',
    title: 'Engine Thrust Lab',
    description: 'Comprehensive engine thrust and performance analysis for jet and piston engines',
    icon: <Zap className="w-8 h-8" />,
    category: 'Analysis',
    features: ['Jet Engine', 'Piston Engine', 'Power Output', 'Fuel Analysis'],
    color: 'from-red-500 to-pink-500',
    path: '/thrust-calculator',
    isActive: true,
  },
  {
    id: 'drag-calculator',
    title: 'Drag Analysis Lab',
    description: 'Production-grade aerodynamic drag analysis with component breakdown',
    icon: <Wind className="w-8 h-8" />,
    category: 'Analysis',
    features: ['Drag Components', 'Compressibility', 'Performance', 'CSV Export'],
    color: 'from-teal-500 to-cyan-500',
    path: '/drag-calculator',
    isActive: true,
  },
  {
    id: 'airfoil-downloader',
    title: 'Airfoil Repository',
    description: 'Comprehensive airfoil database with performance data and natural language search',
    icon: <Download className="w-8 h-8" />,
    category: 'Data',
    features: ['Natural Search', 'CSV Export', 'Batch Download', 'Performance Curves'],
    color: 'from-green-500 to-emerald-500',
    path: '/airfoil-downloader',
    isActive: true,
  },
  {
    id: 'cfd-datasets',
    title: 'CFD Datasets Hub',
    description: 'Validated CFD simulation datasets with tutorials and boundary conditions',
    icon: <Database className="w-8 h-8" />,
    category: 'Data',
    features: ['Validated Data', 'Mesh Tutorials', 'Boundary Conditions', 'Advanced Analysis'],
    color: 'from-indigo-500 to-blue-600',
    path: '/cfd-datasets',
    isActive: true,
  },
  {
    id: 'advanced-cfd',
    title: 'Advanced CFD Suite',
    description: 'Elite computational fluid dynamics with convergence monitoring and advanced analysis',
    icon: <Beaker className="w-8 h-8" />,
    category: 'Advanced',
    features: ['Convergence Monitor', 'Advanced Solvers', 'Real-time Monitoring', 'Multi-physics'],
    color: 'from-violet-500 to-purple-600',
    path: '/advanced-cfd',
    isActive: true,
  },
  {
    id: 'turbulence-modeling',
    title: 'Turbulence Modeling Lab',
    description: 'Advanced turbulence modeling with research-grade analysis tools',
    icon: <Microscope className="w-8 h-8" />,
    category: 'Advanced',
    features: ['RANS Models', 'LES Capabilities', 'Hybrid Methods', 'Research Tools'],
    color: 'from-orange-500 to-red-500',
    path: '/advanced-turbulence-modeling',
    isActive: true,
  },
  {
    id: 'multi-objective',
    title: 'Multi-Objective Optimizer',
    description: 'Elite Pareto frontier optimization for aerospace design problems',
    icon: <Target className="w-8 h-8" />,
    category: 'Optimization',
    features: ['Pareto Analysis', 'Multi-objective', 'Design Space', 'Visualization'],
    color: 'from-pink-500 to-rose-500',
    path: '/elite-multi-objective-optimization',
    isActive: true,
  },
  {
    id: 'batch-processing',
    title: 'Batch Processing Engine',
    description: 'High-performance batch simulation and analysis processing',
    icon: <Workflow className="w-8 h-8" />,
    category: 'Processing',
    features: ['Parallel Processing', 'Queue Management', 'Result Aggregation', 'Monitoring'],
    color: 'from-cyan-500 to-blue-500',
    path: '/batch-processing',
    isActive: true,
  },
  {
    id: 'aerospace-suite',
    title: 'Enterprise Aerospace Suite',
    description: 'Integrated aerospace design platform with multi-physics simulation',
    icon: <Rocket className="w-8 h-8" />,
    category: 'Integration',
    features: ['Multi-physics', 'Structural Analysis', 'Optimization', 'Collaboration'],
    color: 'from-purple-500 to-pink-500',
    path: '/advanced-aerospace-suite',
    isActive: true,
  },
  {
    id: 'mechanical-suite',
    title: 'Mechanical CAD Suite',
    description: 'Production-grade mechanical design with parametric modeling',
    icon: <Wrench className="w-8 h-8" />,
    category: 'Integration',
    features: ['Parametric Modeling', 'Assembly Sim', 'Manufacturing', 'Material DB'],
    color: 'from-slate-600 to-gray-700',
    path: '/mechanical-cad-suite',
    isActive: true,
  },
  {
    id: 'collaborative-workspace',
    title: 'Collaborative Workspace',
    description: 'Real-time team collaboration for aerospace design projects',
    icon: <Users className="w-8 h-8" />,
    category: 'Collaboration',
    features: ['Real-time Sync', 'Version Control', 'Comments', 'Permissions'],
    color: 'from-emerald-500 to-teal-500',
    path: '/collaborative-workspace',
    isActive: true,
  },
  {
    id: 'ai-research-assistant',
    title: 'AI Research Assistant',
    description: 'Intelligent assistant for aerospace research and design optimization',
    icon: <Brain className="w-8 h-8" />,
    category: 'AI',
    features: ['Natural Language', 'Design Suggestions', 'Literature Search', 'Analysis'],
    color: 'from-fuchsia-500 to-purple-500',
    path: '/ai-research-assistant',
    isActive: true,
  },
  {
    id: 'digital-research-lab',
    title: 'Digital Aerospace Lab',
    description: 'Comprehensive digital research environment for aerospace innovation',
    icon: <Lightbulb className="w-8 h-8" />,
    category: 'Research',
    features: ['Research Tools', 'Data Analysis', 'Visualization', 'Publishing'],
    color: 'from-yellow-500 to-amber-500',
    path: '/digital-aerospace-research-lab',
    isActive: true,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function VirtualLabPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    setActiveCount(labTools.filter(t => t.isActive).length);
  }, []);

  const categories = Array.from(new Set(labTools.map(t => t.category)));
  const filteredTools = selectedCategory 
    ? labTools.filter(t => t.category === selectedCategory)
    : labTools;

  const handleToolClick = (tool: LabTool) => {
    if (tool.path) {
      navigate(tool.path);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      
      <main className="w-full">
        {/* Hero Section */}
        <section className="w-full max-w-[120rem] mx-auto px-4 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Microscope className="w-8 h-8 text-blue-400" />
              <span className="font-mono text-sm uppercase tracking-widest text-blue-400">
                Advanced Research Environment
              </span>
            </div>
            
            <h1 className="font-heading text-5xl md:text-7xl font-bold text-white mb-6">
              Virtual Aerospace Lab
            </h1>
            
            <p className="font-paragraph text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-8">
              Complete aerospace research and development environment. {activeCount} fully integrated tools for design, simulation, analysis, and optimization.
            </p>
            
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-6 py-2 rounded-lg font-paragraph font-medium transition-all ${
                  selectedCategory === null
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                All Tools ({labTools.length})
              </button>
              {categories.map(cat => {
                const count = labTools.filter(t => t.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-6 py-2 rounded-lg font-paragraph font-medium transition-all ${
                      selectedCategory === cat
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {[
                { label: 'Active Tools', value: activeCount },
                { label: 'Categories', value: categories.length },
                { label: 'Features', value: '50+' },
                { label: 'Uptime', value: '99.9%' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-slate-800 rounded-lg p-4 border border-slate-700"
                >
                  <div className="text-2xl md:text-3xl font-bold text-blue-400 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Tools Grid */}
        <section className="w-full max-w-[120rem] mx-auto px-4 py-16">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredTools.map((tool) => (
              <motion.div
                key={tool.id}
                variants={itemVariants}
                onMouseEnter={() => setHoveredTool(tool.id)}
                onMouseLeave={() => setHoveredTool(null)}
                className="group cursor-pointer"
              >
                <div className="relative h-full bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-slate-600 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20">
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-sm px-3 py-1 rounded-full border border-green-500/50">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-xs font-mono text-green-400">Active</span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="relative p-8 h-full flex flex-col">
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${tool.color} p-3 mb-6 flex items-center justify-center text-white`}>
                      {tool.icon}
                    </div>

                    {/* Title and description */}
                    <h3 className="font-heading text-2xl font-bold text-white mb-3">
                      {tool.title}
                    </h3>
                    <p className="font-paragraph text-slate-400 mb-6 flex-grow">
                      {tool.description}
                    </p>

                    {/* Features */}
                    <div className="mb-6">
                      <p className="font-paragraph text-sm font-semibold text-slate-300 mb-3">
                        Capabilities:
                      </p>
                      <ul className="space-y-2">
                        {tool.features.map((feature, i) => (
                          <li key={i} className="font-paragraph text-sm text-slate-400 flex items-start">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400 mr-2 mt-1.5 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleToolClick(tool)}
                      className={`w-full py-3 rounded-lg font-paragraph font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                        hoveredTool === tool.id
                          ? `bg-gradient-to-r ${tool.color} text-white`
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      <Play className="w-4 h-4" />
                      Launch Tool
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="w-full max-w-[120rem] mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-12 md:p-16"
          >
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-8">
              Why Virtual Lab?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  icon: Layers,
                  title: 'Integrated Ecosystem',
                  description: 'All tools work seamlessly together for complete aerospace design workflows',
                },
                {
                  icon: Gauge,
                  title: 'Production-Grade',
                  description: 'Enterprise-validated algorithms with aerospace-certified accuracy',
                },
                {
                  icon: Brain,
                  title: 'AI-Powered',
                  description: 'Intelligent suggestions and automated optimization across all tools',
                },
                {
                  icon: BarChart3,
                  title: 'Real-Time Analytics',
                  description: 'Live monitoring, convergence tracking, and performance visualization',
                },
              ].map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                    <Icon className="w-8 h-8 text-white mb-4" />
                    <h3 className="font-heading text-xl font-bold text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="font-paragraph text-slate-100">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </section>

        {/* Quick Start Section */}
        <section className="w-full max-w-[120rem] mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
              Get Started in Seconds
            </h2>
            <p className="font-paragraph text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
              Choose a tool above and start your aerospace research journey. All tools are fully functional and ready to use.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: '1',
                  title: 'Select Tool',
                  desc: 'Choose from 16+ integrated aerospace tools',
                },
                {
                  step: '2',
                  title: 'Configure',
                  desc: 'Set parameters and input your design specifications',
                },
                {
                  step: '3',
                  title: 'Analyze',
                  desc: 'Get instant results with real-time visualization',
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-slate-800 rounded-xl p-8 border border-slate-700 hover:border-blue-500/50 transition-all"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold text-xl mb-4 mx-auto">
                    {item.step}
                  </div>
                  <h3 className="font-heading text-xl font-bold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="font-paragraph text-slate-400">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="w-full max-w-[120rem] mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Launch Your Research?
            </h2>
            <p className="font-paragraph text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Access all aerospace research tools in one unified environment. Start designing, simulating, and optimizing today.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(null)}
              className="px-10 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-heading font-bold text-lg rounded-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300"
            >
              Explore All Tools
            </motion.button>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
