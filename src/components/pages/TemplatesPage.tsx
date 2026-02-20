import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Eye, Filter, Search, Zap } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { AerospaceTemplates, MechanicalTemplates } from '@/entities';
import { Image } from '@/components/ui/image';

export default function TemplatesPage() {
  const [activeTab, setActiveTab] = useState<'aerospace' | 'mechanical'>('aerospace');
  const [aerospaceTemplates, setAerospaceTemplates] = useState<AerospaceTemplates[]>([]);
  const [mechanicalTemplates, setMechanicalTemplates] = useState<MechanicalTemplates[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const loadTemplates = async () => {
      setIsLoading(true);
      try {
        const [aeroResult, mechResult] = await Promise.all([
          BaseCrudService.getAll<AerospaceTemplates>('aerospacetemplates'),
          BaseCrudService.getAll<MechanicalTemplates>('mechanicaltemplates'),
        ]);
        
        setAerospaceTemplates(aeroResult.items || []);
        setMechanicalTemplates(mechResult.items || []);
      } catch (error) {
        console.error('Error loading templates:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplates();
  }, []);

  const templates = activeTab === 'aerospace' ? aerospaceTemplates : mechanicalTemplates;
  const categories = [...new Set(templates.map(t => t.category).filter(Boolean))];
  
  const filteredTemplates = templates.filter(t => {
    const matchesSearch = !searchTerm || 
      t.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />

      <main className="w-full max-w-[120rem] mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 mb-2">
            Design Templates
          </h1>
          <p className="font-paragraph text-slate-600 mb-8">
            Access pre-built templates for aerospace and mechanical engineering projects
          </p>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-slate-200">
            <button
              onClick={() => {
                setActiveTab('aerospace');
                setSelectedCategory(null);
              }}
              className={`pb-4 px-4 font-paragraph font-semibold transition-colors ${
                activeTab === 'aerospace'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Aerospace Templates
            </button>
            <button
              onClick={() => {
                setActiveTab('mechanical');
                setSelectedCategory(null);
              }}
              className={`pb-4 px-4 font-paragraph font-semibold transition-colors ${
                activeTab === 'mechanical'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mechanical Templates
            </button>
          </div>

          {/* Search and Filter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-lg font-paragraph text-sm transition-colors ${
                  selectedCategory === null
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
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
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Templates Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-slate-200 rounded-lg h-80 animate-pulse" />
              ))}
            </div>
          ) : filteredTemplates.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredTemplates.map((template, index) => (
                <motion.div
                  key={template._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                >
                  {template.previewImage && (
                    <div className="relative h-48 bg-slate-100 overflow-hidden">
                      <Image
                        src={template.previewImage}
                        alt={template.title || 'Template'}
                        width={400}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-heading text-lg font-bold text-slate-900 flex-1">
                        {template.title}
                      </h3>
                      <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded">
                        {template.category}
                      </span>
                    </div>
                    <p className="font-paragraph text-sm text-slate-600 mb-4 line-clamp-2">
                      {template.description}
                    </p>
                    <div className="flex gap-2">
                      <button className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-paragraph text-sm font-semibold">
                        <Eye className="w-4 h-4" />
                        Preview
                      </button>
                      {template.templateFileUrl && (
                        <button className="flex-1 flex items-center justify-center gap-2 bg-slate-200 text-slate-700 py-2 rounded-lg hover:bg-slate-300 transition-colors font-paragraph text-sm font-semibold">
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
              <p className="font-paragraph text-slate-600">No templates found matching your criteria</p>
            </div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
