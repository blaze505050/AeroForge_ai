import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Eye, Filter, Search, Database, ChevronDown, Grid3x3, Layers, Zap, Gauge, Upload } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { CFDDatasets } from '@/entities';
import Preview3DModal from '@/components/3DPreviewModal';

interface TutorialStep {
  title: string;
  description: string;
  details: string[];
  icon: React.ReactNode;
}

const tutorialSteps: TutorialStep[] = [
  {
    title: 'Mesh Generation',
    description: 'Create computational mesh for your domain',
    details: [
      'Define domain boundaries and geometry',
      'Set mesh density and refinement regions',
      'Use structured or unstructured mesh',
      'Validate mesh quality metrics',
      'Export mesh in standard formats (STL, STEP)',
    ],
    icon: <Grid3x3 className="w-6 h-6" />,
  },
  {
    title: 'Boundary Conditions',
    description: 'Configure inlet, outlet, and wall conditions',
    details: [
      'Set inlet velocity or pressure conditions',
      'Define outlet pressure or mass flow',
      'Configure wall boundary conditions',
      'Apply symmetry and periodic boundaries',
      'Specify turbulence parameters (k-ε, k-ω)',
    ],
    icon: <Layers className="w-6 h-6" />,
  },
  {
    title: 'Solver Configuration',
    description: 'Set up numerical solver parameters',
    details: [
      'Choose solver type (RANS, LES, DNS)',
      'Set convergence criteria and tolerances',
      'Configure time stepping (steady/unsteady)',
      'Select discretization schemes',
      'Define monitoring points and outputs',
    ],
    icon: <Zap className="w-6 h-6" />,
  },
  {
    title: 'Post-Processing',
    description: 'Analyze and visualize results',
    details: [
      'Extract pressure and velocity fields',
      'Calculate aerodynamic coefficients (Cl, Cd)',
      'Generate contour and vector plots',
      'Create streamline visualizations',
      'Export results for further analysis',
    ],
    icon: <Database className="w-6 h-6" />,
  },
];

export default function CFDDatasetsPage() {
  const [datasets, setDatasets] = useState<CFDDatasets[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedTutorial, setExpandedTutorial] = useState<number | null>(0);
  const [previewModal, setPreviewModal] = useState<{ isOpen: boolean; dataset: CFDDatasets | null }>({
    isOpen: false,
    dataset: null,
  });

  useEffect(() => {
    const loadDatasets = async () => {
      setIsLoading(true);
      try {
        const result = await BaseCrudService.getAll<CFDDatasets>('cfddatasets');
        setDatasets(result.items || []);
      } catch (error) {
        console.error('Error loading CFD datasets:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDatasets();
  }, []);

  const categories = [...new Set(datasets.map(d => d.category).filter(Boolean))];
  
  const filteredDatasets = datasets.filter(d => {
    const matchesSearch = !searchTerm || 
      d.datasetName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || d.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDownload = (url: string | undefined) => {
    if (url) {
      const a = document.createElement('a');
      a.href = url;
      a.download = url.split('/').pop() || 'dataset';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handlePreview = (dataset: CFDDatasets) => {
    setPreviewModal({ isOpen: true, dataset });
  };

  const handleDownloadSTL = () => {
    if (previewModal.dataset?.dataDownloadUrl) {
      const url = previewModal.dataset.dataDownloadUrl.replace(/\.[^.]+$/, '.stl');
      handleDownload(url);
    }
  };

  const handleDownloadSTEP = () => {
    if (previewModal.dataset?.dataDownloadUrl) {
      const url = previewModal.dataset.dataDownloadUrl.replace(/\.[^.]+$/, '.step');
      handleDownload(url);
    }
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
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-2">
            CFD Datasets & Tutorials
          </h1>
          <p className="font-paragraph text-slate-400 mb-12">
            High-quality computational fluid dynamics datasets with comprehensive tutorials for mesh generation, boundary conditions, and advanced analysis
          </p>

          {/* Tutorial Section */}
          <section className="mb-16">
            <h2 className="font-heading text-3xl font-bold text-white mb-8">
              CFD Simulation Tutorial
            </h2>
            <div className="space-y-4">
              {tutorialSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedTutorial(expandedTutorial === index ? null : index)}
                    className="w-full p-6 flex items-center justify-between hover:bg-slate-750 transition-colors"
                  >
                    <div className="flex items-center gap-4 text-left flex-1">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white flex-shrink-0">
                        {step.icon}
                      </div>
                      <div>
                        <h3 className="font-heading text-xl font-bold text-white">
                          {step.title}
                        </h3>
                        <p className="font-paragraph text-slate-400 text-sm">
                          {step.description}
                        </p>
                      </div>
                    </div>
                    <ChevronDown 
                      className={`w-5 h-5 text-slate-400 transition-transform ${expandedTutorial === index ? 'rotate-180' : ''}`}
                    />
                  </button>
                  
                  {expandedTutorial === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-slate-700 bg-slate-900/50 p-6"
                    >
                      <ul className="space-y-3">
                        {step.details.map((detail, i) => (
                          <li key={i} className="font-paragraph text-slate-300 flex items-start">
                            <span className="inline-block w-2 h-2 rounded-full bg-blue-400 mr-3 mt-2 flex-shrink-0" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </section>

          {/* Datasets Section */}
          <section>
            <h2 className="font-heading text-3xl font-bold text-white mb-8">
              Available Datasets
            </h2>

            {/* Search and Filter */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search datasets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-700 rounded-lg bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-lg font-paragraph text-sm transition-colors ${
                    selectedCategory === null
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  All Categories
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-lg font-paragraph text-sm transition-colors ${
                      selectedCategory === cat
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Datasets Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-slate-700 rounded-lg h-64 animate-pulse" />
                ))}
              </div>
            ) : filteredDatasets.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredDatasets.map((dataset, index) => (
                  <motion.div
                    key={dataset._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-slate-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-slate-700 overflow-hidden group"
                  >
                    {/* Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="p-6 relative z-10">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Database className="w-5 h-5 text-blue-400" />
                          <h3 className="font-heading text-lg font-bold text-white">
                            {dataset.datasetName}
                          </h3>
                        </div>
                        <span className="bg-blue-500/20 text-blue-300 text-xs font-semibold px-2 py-1 rounded">
                          {dataset.category}
                        </span>
                      </div>
                      
                      <p className="font-paragraph text-sm text-slate-400 mb-4 line-clamp-2">
                        {dataset.description}
                      </p>

                      {dataset.simulationParameters && (
                        <div className="mb-4 p-3 bg-slate-900 rounded border border-slate-700">
                          <p className="font-paragraph text-xs text-slate-500 mb-2">Simulation Parameters:</p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {dataset.simulationParameters.split(',').map((param, i) => (
                              <div key={i} className="flex items-center gap-1 text-slate-300">
                                <Gauge className="w-3 h-3 text-cyan-400" />
                                <span className="truncate">{param.trim()}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {dataset.modelFile && (
                        <div className="mb-4 p-3 bg-slate-900 rounded border border-slate-700">
                          <div className="flex items-center gap-2 text-slate-300">
                            <Upload className="w-4 h-4 text-blue-400" />
                            <span className="text-xs">3D Model Available</span>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <button 
                          onClick={() => handlePreview(dataset)}
                          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-paragraph text-sm font-semibold group/btn"
                        >
                          <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                          Preview 3D
                        </button>
                        {dataset.dataDownloadUrl && (
                          <button 
                            onClick={() => handleDownload(dataset.dataDownloadUrl)}
                            className="flex-1 flex items-center justify-center gap-2 bg-slate-700 text-slate-200 py-2 rounded-lg hover:bg-slate-600 transition-colors font-paragraph text-sm font-semibold group/btn"
                          >
                            <Download className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                            Download
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <Database className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="font-paragraph text-slate-400">No datasets found matching your criteria</p>
              </div>
            )}
          </section>

          {/* Best Practices Section */}
          <section className="mt-16 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-2xl p-8 border border-blue-500/30">
            <h2 className="font-heading text-2xl font-bold text-white mb-6">
              CFD Best Practices
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Mesh Quality',
                  tips: ['Maintain aspect ratios', 'Refine near walls', 'Check skewness metrics'],
                },
                {
                  title: 'Convergence',
                  tips: ['Monitor residuals', 'Use appropriate tolerances', 'Check solution stability'],
                },
                {
                  title: 'Validation',
                  tips: ['Compare with experimental data', 'Perform grid independence study', 'Check physical reasonableness'],
                },
                {
                  title: 'Performance',
                  tips: ['Use parallel computing', 'Optimize solver settings', 'Monitor computational time'],
                },
              ].map((practice, i) => (
                <div key={i} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                  <h3 className="font-heading text-lg font-bold text-white mb-3">
                    {practice.title}
                  </h3>
                  <ul className="space-y-2">
                    {practice.tips.map((tip, j) => (
                      <li key={j} className="font-paragraph text-sm text-slate-300 flex items-start">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400 mr-2 mt-1.5 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </motion.div>
      </main>

      {/* 3D Preview Modal */}
      <Preview3DModal
        isOpen={previewModal.isOpen}
        onClose={() => setPreviewModal({ isOpen: false, dataset: null })}
        title={previewModal.dataset?.datasetName || 'CFD Dataset Preview'}
        description={previewModal.dataset?.description}
        onDownloadSTL={handleDownloadSTL}
        onDownloadSTEP={handleDownloadSTEP}
        geometryType="complex"
        simulationData={{
          meshDensity: previewModal.dataset?.simulationParameters ? parseInt(previewModal.dataset.simulationParameters.split(',')[0]) : undefined,
          reynoldsNumber: 100000,
          machNumber: 0.5,
          temperature: 288,
        }}
      />

      <Footer />
    </div>
  );
}
