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
    id: 'aerospace-templates',
    title: 'Aerospace Templates',
    description: 'Access pre-built design templates for aircraft, drones, and spacecraft projects',
    icon: <Zap className="w-8 h-8" />,
    category: 'Design',
    features: ['Aircraft designs', 'Drone templates', 'Spacecraft layouts', 'Customizable'],
    color: 'from-orange-500 to-red-500',
  },
  {
    id: 'mechanical-templates',
    title: 'Mechanical Templates',
    description: 'Comprehensive mechanical engineering templates for structural and component design',
    icon: <Wrench className="w-8 h-8" />,
    category: 'Mechanical',
    features: ['Fastener libraries', 'Gear designs', 'Assembly templates', 'Material specs'],
    color: 'from-slate-500 to-gray-600',
  },
  {
    id: 'cfd-datasets',
    title: 'CFD Datasets',
    description: 'Access validated CFD simulation datasets for benchmarking and analysis',
    icon: <Database className="w-8 h-8" />,
    category: 'Data',
    features: ['Validated data', 'Multiple scenarios', 'Performance metrics', 'Downloadable'],
    color: 'from-indigo-500 to-blue-600',
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
              Comprehensive suite of tools for aerospace design, simulation, and analysis. From airfoil design to CFD data management.
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
              Why Choose Our Aerospace Toolbox?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: 'Industry-Standard Tools',
                  description: 'Built with aerospace engineering best practices and validated methodologies',
                },
                {
                  title: 'Real-Time Visualization',
                  description: 'See your designs come to life with interactive 3D visualization and analysis',
                },
                {
                  title: 'Data-Driven Design',
                  description: 'Access comprehensive CFD datasets and airfoil databases for informed decisions',
                },
                {
                  title: 'Seamless Integration',
                  description: 'Export to CAD, import from standard formats, and collaborate with your team',
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
              Start using our comprehensive aerospace tools today. No setup required, just pure engineering power.
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
