import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Eye, Filter, Search, Zap, ChevronDown, Cpu, Cog, Zap as ZapIcon, Layers, Gauge } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { RoboticsTemplates } from '@/entities';
import Preview3DModal from '@/components/3DPreviewModal';
import { Image } from '@/components/ui/image';

interface RoboticsCategory {
  name: string;
  description: string;
  icon: React.ReactNode;
}

const roboticsCategories: RoboticsCategory[] = [
  {
    name: 'Robotic Arms',
    description: 'Industrial and collaborative robotic arms',
    icon: <Cpu className="w-6 h-6" />,
  },
  {
    name: 'Drones',
    description: 'Aerial robotics and UAV systems',
    icon: <ZapIcon className="w-6 h-6" />,
  },
  {
    name: 'Rovers',
    description: 'Mobile ground robots and rovers',
    icon: <Gauge className="w-6 h-6" />,
  },
  {
    name: 'Humanoids',
    description: 'Humanoid robot designs',
    icon: <Cog className="w-6 h-6" />,
  },
];

export default function RoboticsTemplatesPage() {
  const [templates, setTemplates] = useState<RoboticsTemplates[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [previewModal, setPreviewModal] = useState<{ isOpen: boolean; template: RoboticsTemplates | null }>({
    isOpen: false,
    template: null,
  });

  useEffect(() => {
    const loadTemplates = async () => {
      setIsLoading(true);
      try {
        const result = await BaseCrudService.getAll<RoboticsTemplates>('roboticstemplates');
        setTemplates(result.items || []);
      } catch (error) {
        console.error('Error loading robotics templates:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplates();
  }, []);

  const categories = [...new Set(templates.map(t => t.category).filter(Boolean))];

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = !searchTerm ||
      t.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDownload = (url: string | undefined) => {
    if (url) {
      const a = document.createElement('a');
      a.href = url;
      a.download = url.split('/').pop() || 'template';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handlePreview = (template: RoboticsTemplates) => {
    setPreviewModal({ isOpen: true, template });
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
            Robotics Templates Library
          </h1>
          <p className="font-paragraph text-slate-400 mb-12">
            Professional robotics templates and designs for arms, drones, rovers, and humanoid systems. Download ready-to-use CAD files and design resources.
          </p>

          {/* Categories Overview */}
          <section className="mb-16">
            <h2 className="font-heading text-3xl font-bold text-white mb-8">
              Robotics Categories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {roboticsCategories.map((cat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-slate-700 hover:border-blue-500/50 transition-all cursor-pointer group"
                  onClick={() => setSelectedCategory(cat.name)}
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </div>
                  <h3 className="font-heading text-lg font-bold text-white mb-2">
                    {cat.name}
                  </h3>
                  <p className="font-paragraph text-sm text-slate-400">
                    {cat.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Search and Filter */}
          <section className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search templates..."
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
          </section>

          {/* Templates Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-slate-700 rounded-lg h-80 animate-pulse" />
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
                  className="bg-slate-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-slate-700 overflow-hidden group"
                >
                  {/* Image */}
                  {template.previewImage && (
                    <div className="relative h-48 overflow-hidden bg-slate-900">
                      <Image
                        src={template.previewImage}
                        alt={template.title || 'Template preview'}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        width={400}
                        height={300}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-heading text-lg font-bold text-white">
                          {template.title}
                        </h3>
                      </div>
                      {template.category && (
                        <span className="bg-blue-500/20 text-blue-300 text-xs font-semibold px-2 py-1 rounded whitespace-nowrap ml-2">
                          {template.category}
                        </span>
                      )}
                    </div>

                    <p className="font-paragraph text-sm text-slate-400 mb-4 line-clamp-2">
                      {template.description}
                    </p>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePreview(template)}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-paragraph text-sm font-semibold group/btn"
                      >
                        <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                        Preview
                      </button>
                      {template.templateFileUrl && (
                        <button
                          onClick={() => handleDownload(template.templateFileUrl)}
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
              <Cpu className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="font-paragraph text-slate-400">No templates found matching your criteria</p>
            </div>
          )}

          {/* Features Section */}
          <section className="mt-16 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-2xl p-8 border border-blue-500/30">
            <h2 className="font-heading text-2xl font-bold text-white mb-6">
              Why Use Our Robotics Templates?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Professional Design',
                  description: 'Industry-standard CAD files optimized for manufacturing',
                },
                {
                  title: 'Time Saving',
                  description: 'Start your project with proven designs and specifications',
                },
                {
                  title: 'Customizable',
                  description: 'Easily modify templates to match your specific requirements',
                },
                {
                  title: 'Technical Support',
                  description: 'Access documentation and design guidelines for each template',
                },
              ].map((feature, i) => (
                <div key={i} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                  <h3 className="font-heading text-lg font-bold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="font-paragraph text-sm text-slate-300">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </motion.div>
      </main>

      {/* 3D Preview Modal */}
      <Preview3DModal
        isOpen={previewModal.isOpen}
        onClose={() => setPreviewModal({ isOpen: false, template: null })}
        title={previewModal.template?.title || 'Robotics Template Preview'}
        description={previewModal.template?.description}
        geometryType="complex"
      />

      <Footer />
    </div>
  );
}
