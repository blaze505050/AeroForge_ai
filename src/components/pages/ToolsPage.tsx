import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code2, Wind, Brain, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Image } from '@/components/ui/image';
import { BaseCrudService } from '@/integrations';
import { MechanicalTemplates, AerospaceTemplates, RoboticsTemplates } from '@/entities';

interface Tool {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: any;
  image?: string;
}

const CATEGORY_ICONS: Record<string, any> = {
  'Mechanical': Code2,
  'Aerospace': Wind,
  'Robotics': Brain,
};

export default function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTools = async () => {
      try {
        const [mechanical, aerospace, robotics] = await Promise.all([
          BaseCrudService.getAll<MechanicalTemplates>('mechanicaltemplates', [], { limit: 50 }),
          BaseCrudService.getAll<AerospaceTemplates>('aerospacetemplates', [], { limit: 50 }),
          BaseCrudService.getAll<RoboticsTemplates>('roboticstemplates', [], { limit: 50 }),
        ]);

        const combinedTools: Tool[] = [
          ...mechanical.items.map((t) => ({
            id: t._id,
            name: t.title || 'Mechanical Template',
            category: 'Mechanical',
            description: t.description || '',
            icon: Code2,
            image: t.previewImage,
          })),
          ...aerospace.items.map((t) => ({
            id: t._id,
            name: t.title || 'Aerospace Template',
            category: 'Aerospace',
            description: t.description || '',
            icon: Wind,
            image: t.previewImage,
          })),
          ...robotics.items.map((t) => ({
            id: t._id,
            name: t.title || 'Robotics Template',
            category: 'Robotics',
            description: t.description || '',
            icon: Brain,
            image: t.previewImage,
          })),
        ];

        setTools(combinedTools);
      } catch (error) {
        console.error('Error loading tools:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTools();
  }, []);

  return (
    <div className="min-h-screen bg-aerospace-dark text-foreground font-paragraph flex flex-col">
      <Header />

      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="w-full py-20 bg-primary border-b border-secondary/20">
          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="font-heading text-5xl md:text-6xl font-bold text-foreground mb-4">
                Design Tools & Templates
              </h1>
              <p className="font-paragraph text-lg text-secondary-foreground max-w-2xl mx-auto">
                Choose from mechanical, aerospace, and robotics templates to kickstart your projects.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="w-full py-24 bg-aerospace-dark">
          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-foreground/60">Loading tools...</p>
              </div>
            ) : tools.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-foreground/60 text-lg">No tools available at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {tools.map((tool, idx) => {
                  const IconComponent = tool.icon;
                  return (
                    <motion.div
                      key={tool.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      viewport={{ once: true }}
                      className="group relative bg-gradient-to-br from-primary/60 to-primary/40 border border-aerospace-blue/20 rounded-lg overflow-hidden hover:border-aerospace-blue/60 transition-all duration-300 shadow-lg hover:shadow-xl flex flex-col"
                    >
                      {/* Image */}
                      {tool.image && (
                        <div className="relative h-40 overflow-hidden bg-secondary/10">
                          <Image
                            src={tool.image}
                            alt={tool.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-aerospace-dark/80 to-transparent" />
                        </div>
                      )}

                      {/* Content */}
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-aerospace-blue/15 rounded-lg group-hover:bg-aerospace-blue/30 transition-colors">
                            <IconComponent className="w-5 h-5 text-aerospace-blue" />
                          </div>
                          <span className="font-mono text-xs text-aerospace-accent uppercase tracking-widest">
                            {tool.category}
                          </span>
                        </div>

                        <h3 className="font-heading text-lg font-bold text-foreground mb-2 group-hover:text-aerospace-blue transition-colors line-clamp-2">
                          {tool.name}
                        </h3>

                        <p className="font-paragraph text-sm text-foreground/70 mb-6 flex-1 line-clamp-2">
                          {tool.description}
                        </p>

                        {/* CTA */}
                        <button className="w-full px-4 py-2 bg-aerospace-blue/10 border border-aerospace-blue/30 text-aerospace-blue hover:bg-aerospace-blue/20 hover:border-aerospace-blue/60 transition-all rounded-lg font-mono text-sm font-semibold flex items-center justify-center gap-2 group/btn">
                          Explore
                          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Categories Overview */}
        <section className="w-full py-20 bg-primary border-t border-secondary/20">
          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
                Tool Categories
              </h2>
              <p className="font-paragraph text-lg text-secondary-foreground max-w-2xl mx-auto">
                Explore our specialized tools for different engineering disciplines.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Mechanical Design',
                  description: 'Create precise mechanical assemblies and parts with advanced CAD tools.',
                  icon: Code2,
                },
                {
                  title: 'Aerospace Engineering',
                  description: 'Design and analyze aircraft components with aerospace-grade standards.',
                  icon: Wind,
                },
                {
                  title: 'Robotics',
                  description: 'Build and simulate robotic systems with kinematics and control tools.',
                  icon: Brain,
                },
              ].map((category, idx) => {
                const CategoryIcon = category.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="p-8 bg-aerospace-dark border border-aerospace-blue/20 rounded-lg hover:border-aerospace-blue/60 transition-all duration-300 group"
                  >
                    <div className="p-3 bg-aerospace-blue/15 rounded-lg group-hover:bg-aerospace-blue/30 transition-colors w-fit mb-4">
                      <CategoryIcon className="w-6 h-6 text-aerospace-blue" />
                    </div>
                    <h3 className="font-heading text-lg font-bold text-foreground mb-2 group-hover:text-aerospace-blue transition-colors">
                      {category.title}
                    </h3>
                    <p className="font-paragraph text-sm text-foreground/70">
                      {category.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
