import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Eye, Filter, Search, Database, Zap } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { CFDDatasets } from '@/entities';

export default function CFDDatasetsPage() {
  const [datasets, setDatasets] = useState<CFDDatasets[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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
            CFD Datasets
          </h1>
          <p className="font-paragraph text-slate-400 mb-8">
            High-quality computational fluid dynamics datasets for aerospace and mechanical simulations
          </p>

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
                  className="bg-slate-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-slate-700 overflow-hidden"
                >
                  <div className="p-6">
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
                        <p className="font-paragraph text-xs text-slate-500 mb-1">Simulation Parameters:</p>
                        <p className="font-mono text-xs text-slate-300 line-clamp-2">
                          {dataset.simulationParameters}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-paragraph text-sm font-semibold">
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      {dataset.dataDownloadUrl && (
                        <button className="flex-1 flex items-center justify-center gap-2 bg-slate-700 text-slate-200 py-2 rounded-lg hover:bg-slate-600 transition-colors font-paragraph text-sm font-semibold">
                          <Download className="w-4 h-4" />
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
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
