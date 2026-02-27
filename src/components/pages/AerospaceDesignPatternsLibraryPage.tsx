import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Download,
  Eye,
  Filter,
  Zap,
  Grid3x3,
  List,
  Star,
  Share2,
  Copy,
  ArrowRight,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { AerospaceTemplates, MechanicalTemplates, RoboticsTemplates } from '@/entities';
import { Image } from '@/components/ui/image';
import Preview3DModal from '@/components/3DPreviewModal';

interface DesignPattern {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  description: string;
  image: string;
  complexity: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  downloads: number;
  rating: number;
  tags: string[];
  fileUrl: string;
  specifications?: Record<string, string>;
}

export default function AerospaceDesignPatternsLibraryPage() {
  const [patterns, setPatterns] = useState<DesignPattern[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedComplexity, setSelectedComplexity] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [previewModal, setPreviewModal] = useState<{ isOpen: boolean; pattern: DesignPattern | null }>({
    isOpen: false,
    pattern: null,
  });
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadPatterns = async () => {
      setIsLoading(true);
      try {
        const [aeroResult, mechResult, roboticsResult] = await Promise.all([
          BaseCrudService.getAll<AerospaceTemplates>('aerospacetemplates'),
          BaseCrudService.getAll<MechanicalTemplates>('mechanicaltemplates'),
          BaseCrudService.getAll<RoboticsTemplates>('roboticstemplates'),
        ]);

        const allPatterns: DesignPattern[] = [
          ...(aeroResult.items || []).map((t, idx) => ({
            id: t._id,
            name: t.title || 'Untitled',
            category: 'Aerospace',
            subcategory: t.category || 'General',
            description: t.description || '',
            image: t.previewImage || 'https://static.wixstatic.com/media/18a222_e26a4be80779401582df7421e65c0856~mv2.png?originWidth=256&originHeight=192',
            complexity: (['beginner', 'intermediate', 'advanced', 'expert'][idx % 4] as any),
            downloads: Math.floor(Math.random() * 500),
            rating: 3.5 + Math.random() * 1.5,
            tags: (t.category || '').split(',').map(s => s.trim()),
            fileUrl: t.templateFileUrl || '#',
            specifications: {
              'Design Type': t.category || 'N/A',
              'Format': 'CAD',
              'Version': '1.0',
            },
          })),
          ...(mechResult.items || []).map((t, idx) => ({
            id: t._id,
            name: t.title || 'Untitled',
            category: 'Mechanical',
            subcategory: t.category || 'General',
            description: t.description || '',
            image: t.previewImage || 'https://static.wixstatic.com/media/18a222_e0298c120dcc453088f9a7756ef32a30~mv2.png?originWidth=256&originHeight=192',
            complexity: (['beginner', 'intermediate', 'advanced', 'expert'][(idx + 1) % 4] as any),
            downloads: Math.floor(Math.random() * 500),
            rating: 3.5 + Math.random() * 1.5,
            tags: (t.category || '').split(',').map(s => s.trim()),
            fileUrl: t.templateFileUrl || '#',
            specifications: {
              'Component Type': t.category || 'N/A',
              'Format': 'CAD',
              'Version': t.version || '1.0',
            },
          })),
          ...(roboticsResult.items || []).map((t, idx) => ({
            id: t._id,
            name: t.title || 'Untitled',
            category: 'Robotics',
            subcategory: t.category || 'General',
            description: t.description || '',
            image: t.previewImage || 'https://static.wixstatic.com/media/18a222_a8461a4d523a438baeac8a35bbeee2a7~mv2.png?originWidth=256&originHeight=192',
            complexity: (['beginner', 'intermediate', 'advanced', 'expert'][(idx + 2) % 4] as any),
            downloads: Math.floor(Math.random() * 500),
            rating: 3.5 + Math.random() * 1.5,
            tags: (t.category || '').split(',').map(s => s.trim()),
            fileUrl: t.templateFileUrl || '#',
            specifications: {
              'Robot Type': t.category || 'N/A',
              'Format': 'CAD',
              'Version': '1.0',
            },
          })),
        ];

        setPatterns(allPatterns);
      } catch (error) {
        console.error('Error loading patterns:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPatterns();
  }, []);

  const categories = [...new Set(patterns.map(p => p.category))];
  const complexityLevels = ['beginner', 'intermediate', 'advanced', 'expert'];

  const filteredPatterns = patterns.filter(p => {
    const matchesSearch =
      !searchTerm ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = !selectedCategory || p.category === selectedCategory;
    const matchesComplexity = !selectedComplexity || p.complexity === selectedComplexity;

    return matchesSearch && matchesCategory && matchesComplexity;
  });

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const complexityColors: Record<string, string> = {
    beginner: 'bg-aerospace-success',
    intermediate: 'bg-aerospace-blue',
    advanced: 'bg-aerospace-warning',
    expert: 'bg-aerospace-danger',
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-aerospace-dark">
        {/* Hero Section */}
        <section className="w-full max-w-[120rem] mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-heading font-bold text-white mb-4">
              Aerospace Design Patterns Library
            </h1>
            <p className="text-xl text-secondary-foreground max-w-2xl mx-auto">
              Professional wing, fuselage, and landing gear templates for rapid aerospace design
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4 mb-8"
          >
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-foreground" size={20} />
              <input
                type="text"
                placeholder="Search patterns, tags, or descriptions..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-aerospace-blue/30 rounded-lg text-white placeholder-secondary-foreground focus:outline-none focus:border-aerospace-blue"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-aerospace-blue" />
                <span className="text-sm font-medium text-secondary-foreground">Filter:</span>
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 flex-wrap">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(null)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    !selectedCategory
                      ? 'bg-aerospace-blue text-white'
                      : 'bg-aerospace-blue/10 text-aerospace-blue hover:bg-aerospace-blue/20'
                  }`}
                >
                  All Categories
                </motion.button>
                {categories.map(cat => (
                  <motion.button
                    key={cat}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === cat
                        ? 'bg-aerospace-accent text-white'
                        : 'bg-aerospace-accent/10 text-aerospace-accent hover:bg-aerospace-accent/20'
                    }`}
                  >
                    {cat}
                  </motion.button>
                ))}
              </div>

              {/* Complexity Filter */}
              <div className="flex gap-2 flex-wrap ml-auto">
                {complexityLevels.map(level => (
                  <motion.button
                    key={level}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedComplexity(selectedComplexity === level ? null : level)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors capitalize ${
                      selectedComplexity === level
                        ? `${complexityColors[level]} text-white`
                        : `${complexityColors[level]}/10 text-white hover:${complexityColors[level]}/20`
                    }`}
                  >
                    {level}
                  </motion.button>
                ))}
              </div>

              {/* View Mode Toggle */}
              <div className="flex gap-2 ml-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-aerospace-blue text-white'
                      : 'bg-aerospace-blue/10 text-aerospace-blue hover:bg-aerospace-blue/20'
                  }`}
                >
                  <Grid3x3 size={18} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list'
                      ? 'bg-aerospace-blue text-white'
                      : 'bg-aerospace-blue/10 text-aerospace-blue hover:bg-aerospace-blue/20'
                  }`}
                >
                  <List size={18} />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Results Count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 text-sm text-secondary-foreground"
          >
            Showing {filteredPatterns.length} of {patterns.length} patterns
          </motion.div>

          {/* Patterns Grid/List */}
          {isLoading ? (
            <div className="text-center py-16">
              <Zap className="mx-auto mb-4 text-aerospace-blue/50 animate-spin" size={48} />
              <p className="text-secondary-foreground">Loading design patterns...</p>
            </div>
          ) : filteredPatterns.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              }
            >
              {filteredPatterns.map((pattern, idx) => (
                <motion.div
                  key={pattern.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className={`group rounded-lg border border-aerospace-blue/30 bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden hover:border-aerospace-blue/60 transition-all ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                >
                  {/* Image */}
                  <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-32 h-32' : 'w-full h-48'}`}>
                    <Image
                      src={pattern.image}
                      alt={pattern.name}
                      width={viewMode === 'list' ? 128 : 300}
                      height={viewMode === 'list' ? 128 : 200}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <div className="flex gap-2 w-full">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setPreviewModal({ isOpen: true, pattern })}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-aerospace-blue hover:bg-aerospace-blue/90 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          <Eye size={16} /> Preview
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleFavorite(pattern.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            favorites.has(pattern.id)
                              ? 'bg-aerospace-warning text-white'
                              : 'bg-white/20 text-white hover:bg-white/30'
                          }`}
                        >
                          <Star size={16} fill={favorites.has(pattern.id) ? 'currentColor' : 'none'} />
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`p-4 flex-1 flex flex-col ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1">
                        <h3 className="font-bold text-white group-hover:text-aerospace-blue transition-colors">
                          {pattern.name}
                        </h3>
                        <p className="text-xs text-secondary-foreground mt-1">{pattern.subcategory}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-bold text-white ${complexityColors[pattern.complexity]}`}>
                        {pattern.complexity}
                      </span>
                    </div>

                    {viewMode === 'grid' && (
                      <p className="text-sm text-secondary-foreground mb-3 line-clamp-2">
                        {pattern.description}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="flex gap-4 text-xs text-secondary-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Download size={14} />
                        {pattern.downloads}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-aerospace-warning" />
                        {pattern.rating.toFixed(1)}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {pattern.tags.slice(0, 2).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-aerospace-blue/10 text-aerospace-blue rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Action Button */}
                    <motion.a
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      href={pattern.fileUrl}
                      download
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-aerospace-accent/20 hover:bg-aerospace-accent/30 text-aerospace-accent rounded-lg font-medium transition-colors text-sm"
                    >
                      <Download size={16} /> Download
                    </motion.a>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Search className="mx-auto mb-4 text-aerospace-blue/50" size={48} />
              <p className="text-lg text-secondary-foreground">No patterns found matching your criteria</p>
            </motion.div>
          )}
        </section>
      </main>

      {/* Preview Modal */}
      {previewModal.isOpen && previewModal.pattern && (
        <Preview3DModal
          isOpen={previewModal.isOpen}
          onClose={() => setPreviewModal({ isOpen: false, pattern: null })}
          modelUrl={previewModal.pattern.fileUrl}
          title={previewModal.pattern.name}
        />
      )}

      <Footer />
    </>
  );
}
