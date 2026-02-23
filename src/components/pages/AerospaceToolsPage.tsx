import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wind, Database, Wrench, Zap, Download, Cpu, Calculator } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Tool {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  features: string[];
  color: string;
  path?: string;
}

const tools: Tool[] = [
  {
    id: 'airfoil-designer',
    title: 'Airfoil Designer',
    description: 'Design and visualize custom airfoil profiles with real-time aerodynamic analysis',
    icon: <Wind className="w-8 h-8" />,
    category: 'Aerodynamics',
    features: ['Real-time visualization', 'NACA profile generation', 'Geometry optimization', 'Export to CAD'],
    color: 'from-blue-500 to-cyan-500',
    path: '/airfoil-designer',
  },
  {
    id: 'airfoil-downloader',
    title: 'Airfoil Data Downloader',
    description: 'Download airfoil coordinates and performance data in CSV format using natural language prompts',
    icon: <Download className="w-8 h-8" />,
    category: 'Data Management',
    features: ['Natural language search', 'CSV export', 'Batch download', 'Performance curves'],
    color: 'from-green-500 to-emerald-500',
    path: '/airfoil-downloader',
  },
  {
    id: 'cfd-simulator',
    title: 'CFD Simulator',
    description: 'Run computational fluid dynamics simulations with pre-configured aerospace scenarios',
    icon: <Cpu className="w-8 h-8" />,
    category: 'Simulation',
    features: ['Mesh generation', 'Solver configuration', 'Results visualization', 'Data export'],
    color: 'from-purple-500 to-pink-500',
    path: '/cfd-simulator',
  },
  {
    id: 'wing-calculator',
    title: 'Wing Calculator',
    description: 'Calculate wing performance metrics and aerodynamic characteristics instantly',
    icon: <Calculator className="w-8 h-8" />,
    category: 'Calculations',
    features: ['Wing span calculation', 'Performance metrics', 'Speed analysis', 'CSV export'],
    color: 'from-amber-500 to-yellow-500',
    path: '/wing-calculator',
  },
  {
    id: 'thrust-calculator',
    title: 'Thrust Calculator',
    description: 'Calculate engine thrust and performance metrics for jet and piston engines',
    icon: <Zap className="w-8 h-8" />,
    category: 'Calculations',
    features: ['Jet engine analysis', 'Piston engine analysis', 'Power output', 'Fuel consumption'],
    color: 'from-red-500 to-pink-500',
    path: '/thrust-calculator',
  },
  {
    id: 'drag-calculator',
    title: 'Drag Calculator',
    description: 'Analyze aerodynamic drag forces and components for aircraft design',
    icon: <Wind className="w-8 h-8" />,
    category: 'Calculations',
    features: ['Drag components', 'Compressibility effects', 'Performance analysis', 'CSV export'],
    color: 'from-teal-500 to-cyan-500',
    path: '/drag-calculator',
  },
  {
    id: 'templates',
    title: 'Design Templates',
    description: 'Access pre-built design templates for aerospace and mechanical engineering projects',
    icon: <Zap className="w-8 h-8" />,
    category: 'Design',
    features: ['Aircraft designs', 'Mechanical templates', 'Customizable layouts', 'Export ready'],
    color: 'from-orange-500 to-red-500',
    path: '/templates',
  },
  {
    id: 'cfd-datasets',
    title: 'CFD Datasets & Tutorials',
    description: 'Access validated CFD simulation datasets with comprehensive tutorials and analysis tools',
    icon: <Database className="w-8 h-8" />,
    category: 'Data',
    features: ['Validated datasets', 'Mesh tutorials', 'Boundary conditions', 'Advanced analysis'],
    color: 'from-indigo-500 to-blue-600',
    path: '/cfd-datasets',
  },
  {
    id: 'aerospace-suite',
    title: 'Advanced Aerospace Suite',
    description: 'Professional aerospace design and analysis platform with multi-physics simulation and AI optimization',
    icon: <Wrench className="w-8 h-8" />,
    category: 'Design',
    features: ['Multi-physics simulation', 'Structural analysis', 'Optimization tools', 'Team collaboration'],
    color: 'from-purple-500 to-pink-500',
    path: '/advanced-aerospace-suite',
  },
  {
    id: 'mechanical-suite',
    title: 'Mechanical CAD Suite',
    description: 'Coming Soon - Comprehensive mechanical design and manufacturing tools',
    icon: <Wrench className="w-8 h-8" />,
    category: 'Mechanical',
    features: ['Parametric modeling', 'Assembly simulation', 'Manufacturing specs', 'Material database'],
    color: 'from-slate-600 to-gray-700',
  },
];

export default function AerospaceToolsPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);

  const categories = Array.from(new Set(tools.map(t => t.category)));
  const filteredTools = selectedCategory 
    ? tools.filter(t => t.category === selectedCategory)
    : tools;

  const handleToolClick = (tool: Tool) => {
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
            <h1 className="font-heading text-5xl md:text-7xl font-bold text-white mb-6">
              Aerospace Master Toolbox
            </h1>
            <p className="font-paragraph text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-8">
              Advanced analysis, simulation, and CAD toolkit for aerospace and mechanical engineering. Industry-grade precision with intuitive design.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-6 py-2 rounded-lg font-paragraph font-medium transition-all ${
                  selectedCategory === null
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                All Tools
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-2 rounded-lg font-paragraph font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Tools Grid */}
        <section className="w-full max-w-[120rem] mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTools.map((tool, index) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredTool(tool.id)}
                onMouseLeave={() => setHoveredTool(null)}
                className="group cursor-pointer"
              >
                <div className="relative h-full bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-slate-600 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20">
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  
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
                        Key Features:
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
                      className={`w-full py-3 rounded-lg font-paragraph font-semibold transition-all duration-300 ${
                        hoveredTool === tool.id
                          ? `bg-gradient-to-r ${tool.color} text-white`
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {tool.path ? 'Launch Tool' : 'Coming Soon'}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
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
              Why Choose Our Advanced Toolkit?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: 'Physics-Accurate Simulations',
                  description: 'Industry-validated algorithms with high-fidelity aerodynamic and structural analysis',
                },
                {
                  title: 'Real-Time Visualization',
                  description: 'Interactive 3D visualization with advanced rendering for instant design feedback',
                },
                {
                  title: 'Comprehensive Tutorials',
                  description: 'Step-by-step guides for mesh generation, boundary conditions, and advanced analysis',
                },
                {
                  title: 'Professional Export',
                  description: 'Export to CAD formats, import from standard files, and collaborate seamlessly',
                },
              ].map((feature, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                  <h3 className="font-heading text-xl font-bold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="font-paragraph text-slate-100">
                    {feature.description}
                  </p>
                </div>
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
              Ready to Transform Your Aerospace Projects?
            </h2>
            <p className="font-paragraph text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Start using our advanced aerospace toolkit today. Professional-grade tools with intuitive interfaces.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-heading font-bold text-lg rounded-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300"
            >
              Get Started Now
            </motion.button>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
