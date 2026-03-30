import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code2, Wind, Brain, ArrowRight, Download } from 'lucide-react';
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
}

const CATEGORY_ICONS: Record<string, any> = {
  'Mechanical': Code2,
  'Aerospace': Wind,
  'Robotics': Brain,
};

export default function ToolsPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTab, setSelectedTab] = useState<'mechanical' | 'aerospace' | 'robotics'>('mechanical');
  const [isLoading, setIsLoading] = useState(true);

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
    if (template.fileUrl) {
      window.open(template.fileUrl, '_blank');
    }
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
                Design Templates & Tools
              </h1>
              <p className="font-paragraph text-base text-secondary-foreground max-w-2xl mx-auto">
                Explore templates and tools across mechanical, aerospace, and robotics disciplines.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Tabs Section */}
        <section className="w-full py-12 bg-aerospace-dark border-b border-secondary/20">
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
                          {template.fileUrl ? (
                            <>
                              <Download className="w-3 h-3" />
                              Download
                            </>
                          ) : (
                            <>
                              <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                              Explore
                            </>
                          )}
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
    </div>
  );
}
