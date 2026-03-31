import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Wind, Brain, ArrowRight, Download, X, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Image } from '@/components/ui/image';
import { BaseCrudService } from '@/integrations';
import { MechanicalTemplates, AerospaceTemplates, RoboticsTemplates } from '@/entities';

interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: any;
  image?: string;
  fileUrl?: string;
  type: 'mechanical' | 'aerospace' | 'robotics';
  version?: string;
}

function TemplateModal({ template, onClose }: { template: Template | null; onClose: () => void }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'downloading' | 'success' | 'error'>('idle');

  if (!template) return null;

  const handleDownload = async () => {
    if (!template.fileUrl) return;
    
    setIsDownloading(true);
    setDownloadStatus('downloading');
    
    try {
      // Try direct download first
      const response = await fetch(template.fileUrl, {
        method: 'GET',
        headers: {
          'Accept': '*/*',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${template.name.replace(/\\s+/g, '-').toLowerCase()}.zip`;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
      
      setDownloadStatus('success');
      setTimeout(() => setDownloadStatus('idle'), 2000);
    } catch (error) {
      console.error('Download error:', error);
      
      // Fallback: try opening in new tab if direct download fails
      try {
        window.open(template.fileUrl, '_blank');
        setDownloadStatus('success');
        setTimeout(() => setDownloadStatus('idle'), 2000);
      } catch (fallbackError) {
        console.error('Fallback download error:', fallbackError);
        setDownloadStatus('error');
        setTimeout(() => setDownloadStatus('idle'), 3000);
      }
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <AnimatePresence>
      {template && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-primary border border-aerospace-blue/30 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-aerospace-blue/20 bg-primary/95 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-aerospace-blue/15 rounded-lg">
                  <template.icon className="w-5 h-5 text-aerospace-blue" />
                </div>
                <div>
                  <h2 className="font-heading text-xl font-bold text-foreground">{template.name}</h2>
                  <p className="font-mono text-xs text-aerospace-blue uppercase tracking-widest">{template.category}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-aerospace-blue/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-foreground/60" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {template.image && (
                <div className="relative h-64 rounded-lg overflow-hidden border border-aerospace-blue/20">
                  <Image
                    src={template.image}
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div>
                <h3 className="font-heading text-sm font-bold text-aerospace-blue uppercase tracking-widest mb-2">
                  Description
                </h3>
                <p className="font-paragraph text-foreground/80 leading-relaxed">
                  {template.description || 'No description available'}
                </p>
              </div>

              {template.version && (
                <div className="p-3 bg-aerospace-blue/10 border border-aerospace-blue/20 rounded-lg">
                  <p className="font-mono text-xs text-aerospace-blue">Version: {template.version}</p>
                </div>
              )}

              <div className="pt-4 border-t border-aerospace-blue/20 flex gap-3">
                {template.fileUrl ? (
                  <>
                    <button
                      onClick={handleDownload}
                      disabled={isDownloading}
                      className={`flex-1 px-4 py-3 font-mono text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${
                        downloadStatus === 'success'
                          ? 'bg-aerospace-success text-white'
                          : downloadStatus === 'error'
                          ? 'bg-aerospace-danger text-white'
                          : 'bg-aerospace-blue text-white hover:bg-aerospace-accent'
                      } ${isDownloading ? 'opacity-75 cursor-not-allowed' : ''}`}
                    >
                      {downloadStatus === 'downloading' && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                      {downloadStatus === 'success' && <CheckCircle2 className="w-4 h-4" />}
                      {downloadStatus === 'error' && <AlertCircle className="w-4 h-4" />}
                      {downloadStatus === 'idle' && <Download className="w-4 h-4" />}
                      {downloadStatus === 'downloading' ? 'Downloading...' : downloadStatus === 'success' ? 'Downloaded!' : downloadStatus === 'error' ? 'Failed' : 'Download'}
                    </button>
                    <a
                      href={template.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-3 bg-aerospace-blue/10 border border-aerospace-blue/30 text-aerospace-blue font-mono text-sm font-semibold rounded-lg hover:bg-aerospace-blue/20 transition-colors flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open
                    </a>
                  </>
                ) : (
                  <div className="w-full px-4 py-3 bg-secondary/20 border border-secondary/30 text-foreground/60 font-mono text-sm rounded-lg text-center">
                    No download available
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function ToolsPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTab, setSelectedTab] = useState<'mechanical' | 'aerospace' | 'robotics'>('mechanical');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const [mechanical, aerospace, robotics] = await Promise.all([
          BaseCrudService.getAll<MechanicalTemplates>('mechanicaltemplates', [], { limit: 50 }),
          BaseCrudService.getAll<AerospaceTemplates>('aerospacetemplates', [], { limit: 50 }),
          BaseCrudService.getAll<RoboticsTemplates>('roboticstemplates', [], { limit: 50 }),
        ]);

        const combinedTemplates: Template[] = [
          ...mechanical.items.map((t) => ({
            id: t._id,
            name: t.title || 'Mechanical Template',
            category: 'Mechanical',
            description: t.description || '',
            icon: Code2,
            image: t.previewImage,
            fileUrl: t.templateFileUrl,
            type: 'mechanical' as const,
            version: t.version,
          })),
          ...aerospace.items.map((t) => ({
            id: t._id,
            name: t.title || 'Aerospace Template',
            category: 'Aerospace',
            description: t.description || '',
            icon: Wind,
            image: t.previewImage,
            fileUrl: t.templateFileUrl,
            type: 'aerospace' as const,
          })),
          ...robotics.items.map((t) => ({
            id: t._id,
            name: t.title || 'Robotics Template',
            category: 'Robotics',
            description: t.description || '',
            icon: Brain,
            image: t.previewImage,
            fileUrl: t.templateFileUrl,
            type: 'robotics' as const,
          })),
        ];

        setTemplates(combinedTemplates);
      } catch (error) {
        console.error('Error loading templates:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplates();
  }, []);

  const filteredTemplates = templates.filter(t => t.type === selectedTab);

  const handleExplore = (template: Template) => {
    setSelectedTemplate(template);
  };

  const tabs = [
    { id: 'mechanical', label: 'Mechanical', icon: Code2, count: templates.filter(t => t.type === 'mechanical').length },
    { id: 'aerospace', label: 'Aerospace', icon: Wind, count: templates.filter(t => t.type === 'aerospace').length },
    { id: 'robotics', label: 'Robotics', icon: Brain, count: templates.filter(t => t.type === 'robotics').length },
  ];

  return (
    <div className="min-h-screen bg-aerospace-dark text-foreground font-paragraph flex flex-col">
      <Header />

      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="w-full py-16 bg-primary border-b border-secondary/20">
          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-3">
                Templates & Tools
              </h1>
              <p className="font-paragraph text-base text-secondary-foreground max-w-2xl mx-auto">
                Explore templates across mechanical, aerospace, and robotics disciplines.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Tabs Section */}
        <section className="w-full py-8 bg-aerospace-dark border-b border-secondary/20">
          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16">
            <div className="flex flex-wrap gap-3 justify-center">
              {tabs.map((tab) => {
                const TabIcon = tab.icon;
                const isActive = selectedTab === tab.id;
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id as any)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-mono text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? 'bg-aerospace-blue text-white shadow-lg'
                        : 'bg-primary border border-aerospace-blue/30 text-aerospace-blue hover:border-aerospace-blue/60'
                    }`}
                  >
                    <TabIcon className="w-4 h-4" />
                    {tab.label}
                    <span className={`ml-1 px-2 py-0.5 rounded text-xs font-bold ${
                      isActive ? 'bg-white/20' : 'bg-aerospace-blue/20'
                    }`}>
                      {tab.count}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Templates Grid */}
        <section className="w-full py-16 bg-aerospace-dark">
          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-foreground/60">Loading templates...</p>
              </div>
            ) : filteredTemplates.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-foreground/60 text-base">No templates available in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template, idx) => {
                  const IconComponent = template.icon;
                  return (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      viewport={{ once: true }}
                      className="group relative bg-gradient-to-br from-primary/60 to-primary/40 border border-aerospace-blue/20 rounded-lg overflow-hidden hover:border-aerospace-blue/60 transition-all duration-300 shadow-lg hover:shadow-xl flex flex-col"
                    >
                      {/* Image */}
                      {template.image && (
                        <div className="relative h-32 overflow-hidden bg-secondary/10">
                          <Image
                            src={template.image}
                            alt={template.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-aerospace-dark/80 to-transparent" />
                        </div>
                      )}

                      {/* Content */}
                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="p-1.5 bg-aerospace-blue/15 rounded group-hover:bg-aerospace-blue/30 transition-colors">
                            <IconComponent className="w-4 h-4 text-aerospace-blue" />
                          </div>
                          <span className="font-mono text-xs text-aerospace-accent uppercase tracking-widest">
                            {template.category}
                          </span>
                        </div>

                        <h3 className="font-heading text-base font-bold text-foreground mb-1 group-hover:text-aerospace-blue transition-colors line-clamp-2">
                          {template.name}
                        </h3>

                        <p className="font-paragraph text-xs text-foreground/70 mb-4 flex-1 line-clamp-2">
                          {template.description}
                        </p>

                        {/* CTA */}
                        <button
                          onClick={() => handleExplore(template)}
                          className="w-full px-3 py-2 bg-aerospace-blue/10 border border-aerospace-blue/30 text-aerospace-blue hover:bg-aerospace-blue/20 hover:border-aerospace-blue/60 transition-all rounded font-mono text-xs font-semibold flex items-center justify-center gap-2 group/btn"
                        >
                          <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                          Explore
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      {/* Modal */}
      <TemplateModal template={selectedTemplate} onClose={() => setSelectedTemplate(null)} />
    </div>
  );
}
