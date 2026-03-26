import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Zap, Code2, Database, Lightbulb, Award, TrendingUp, Brain, Wind, Users, Microscope, Cloud, Gauge, Workflow, Lock, Globe, BarChart3, GitBranch, Target, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchAndFilter from '@/components/SearchAndFilter';
import ToolComparison from '@/components/ToolComparison';
import { Image } from '@/components/ui/image';
import { BaseCrudService } from '@/integrations';
import { MechanicalTemplates, AerospaceTemplates, RoboticsTemplates } from '@/entities';

interface EnhancedTool {
  id: string;
  name: string;
  category: string;
  description: string;
  difficulty: string;
  features: Record<string, boolean | string>;
  icon: any;
  image?: string;
  learningPath?: string[];
  useCases?: string[];
}

const TOOL_ICONS: Record<string, any> = {
  'CAD': Code2,
  'Simulation': Wind,
  'Analysis': BarChart3,
  'Optimization': Target,
  'Collaboration': Users,
  'Documentation': BookOpen,
};

export default function ToolsPage() {
  const [tools, setTools] = useState<EnhancedTool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, string[]>>({
    category: [],
    difficulty: [],
  });

  useEffect(() => {
    const loadTools = async () => {
      try {
        const [mechanical, aerospace, robotics] = await Promise.all([
          BaseCrudService.getAll<MechanicalTemplates>('mechanicaltemplates', [], { limit: 50 }),
          BaseCrudService.getAll<AerospaceTemplates>('aerospacetemplates', [], { limit: 50 }),
          BaseCrudService.getAll<RoboticsTemplates>('roboticstemplates', [], { limit: 50 }),
        ]);

        const combinedTools: EnhancedTool[] = [
          ...mechanical.items.map((t) => ({
            id: t._id,
            name: t.title || 'Mechanical Template',
            category: t.category || 'Mechanical',
            description: t.description || '',
            difficulty: 'Intermediate',
            features: {
              'Real-time Compilation': true,
              'Aerospace Grade': false,
              'Deterministic Output': true,
              'Audit Trail': true,
              'Version Control': true,
            },
            icon: Code2,
            image: t.previewImage,
            learningPath: ['Basics', 'Advanced', 'Expert'],
            useCases: ['Mechanical Design', 'Part Optimization', 'Assembly'],
          })),
          ...aerospace.items.map((t) => ({
            id: t._id,
            name: t.title || 'Aerospace Template',
            category: t.category || 'Aerospace',
            description: t.description || '',
            difficulty: 'Advanced',
            features: {
              'Real-time Compilation': true,
              'Aerospace Grade': true,
              'Deterministic Output': true,
              'Audit Trail': true,
              'Version Control': true,
            },
            icon: Wind,
            image: t.previewImage,
            learningPath: ['Fundamentals', 'Aerospace Standards', 'Certification'],
            useCases: ['Aircraft Design', 'Aerodynamic Analysis', 'Compliance'],
          })),
          ...robotics.items.map((t) => ({
            id: t._id,
            name: t.title || 'Robotics Template',
            category: t.category || 'Robotics',
            description: t.description || '',
            difficulty: 'Intermediate',
            features: {
              'Real-time Compilation': true,
              'Aerospace Grade': false,
              'Deterministic Output': true,
              'Audit Trail': true,
              'Version Control': true,
            },
            icon: Brain,
            image: t.previewImage,
            learningPath: ['Basics', 'Kinematics', 'Control'],
            useCases: ['Robot Design', 'Motion Planning', 'Simulation'],
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

  const categories = useMemo(
    () => [...new Set(tools.map((t) => t.category))],
    [tools]
  );

  const difficulties = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesSearch =
        searchQuery === '' ||
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        filters.category.length === 0 ||
        filters.category.includes(tool.category);

      const matchesDifficulty =
        filters.difficulty.length === 0 ||
        filters.difficulty.includes(tool.difficulty);

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [tools, searchQuery, filters]);

  const comparisonFeatures = [
    'Real-time Compilation',
    'Aerospace Grade',
    'Deterministic Output',
    'Audit Trail',
    'Version Control',
  ];

  return (
    <div className="min-h-screen bg-aerospace-dark text-foreground font-paragraph flex flex-col">
      <Header />

      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="w-full py-24 bg-primary border-b border-secondary/20">
          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <Award className="w-6 h-6 text-aerospace-blue" />
                <span className="font-mono text-sm uppercase tracking-widest text-aerospace-blue">
                  Tool Library
                </span>
              </div>
              <h1 className="font-heading text-5xl md:text-6xl font-bold text-foreground mb-6">
                Design Tools & Templates
              </h1>
              <p className="font-paragraph text-xl text-secondary-foreground max-w-3xl mx-auto">
                Browse templates for mechanical, aerospace, and robotics design. Find the right starting point for your project.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Search & Filter Section */}
        <section className="w-full py-12 bg-aerospace-dark border-b border-secondary/20">
          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16">
            <SearchAndFilter
              onSearch={setSearchQuery}
              onFilterChange={setFilters}
              categories={categories}
              difficulties={difficulties}
            />
          </div>
        </section>

        {/* Comparison Section */}
        <section className="w-full py-12 bg-primary border-b border-secondary/20">
          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16">
            <ToolComparison
              tools={filteredTools.slice(0, 6)}
              featureKeys={comparisonFeatures}
            />
          </div>
        </section>

        {/* Tools Grid */}
        <section className="w-full py-24 bg-aerospace-dark">
          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-foreground/60">Loading tools...</p>
              </div>
            ) : filteredTools.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-foreground/60 text-lg">No tools found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredTools.map((tool, idx) => {
                  const IconComponent = tool.icon;
                  return (
                    <motion.div
                      key={tool.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: idx * 0.1 }}
                      viewport={{ once: true }}
                      className="group relative bg-gradient-to-br from-primary/60 to-primary/40 border border-aerospace-blue/20 rounded-lg overflow-hidden hover:border-aerospace-blue/60 transition-all duration-300 shadow-lg hover:shadow-xl flex flex-col"
                    >
                      {/* Image */}
                      {tool.image && (
                        <div className="relative h-48 overflow-hidden bg-secondary/10">
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
                        <div className="flex items-start justify-between mb-4">
                          <div className="p-3 bg-aerospace-blue/15 rounded-lg group-hover:bg-aerospace-blue/30 transition-colors">
                            <IconComponent className="w-6 h-6 text-aerospace-blue" />
                          </div>
                          <span className="font-mono text-xs px-2 py-1 bg-aerospace-blue/20 text-aerospace-blue rounded">
                            {tool.difficulty}
                          </span>
                        </div>

                        <h3 className="font-heading text-lg font-bold text-foreground mb-2 group-hover:text-aerospace-blue transition-colors">
                          {tool.name}
                        </h3>

                        <p className="font-mono text-xs text-aerospace-accent uppercase tracking-widest mb-3">
                          {tool.category}
                        </p>

                        <p className="font-paragraph text-sm text-foreground/70 mb-4 flex-1 line-clamp-3">
                          {tool.description}
                        </p>

                        {/* Features */}
                        <div className="mb-4 pt-4 border-t border-secondary/20">
                          <p className="font-mono text-xs text-foreground/60 uppercase tracking-wider mb-2">
                            Key Features
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(tool.features)
                              .filter(([, value]) => value === true)
                              .slice(0, 3)
                              .map(([feature]) => (
                                <span
                                  key={feature}
                                  className="font-mono text-xs px-2 py-1 bg-aerospace-success/10 text-aerospace-success rounded"
                                >
                                  {feature}
                                </span>
                              ))}
                          </div>
                        </div>

                        {/* Learning Path */}
                        {tool.learningPath && (
                          <div className="mb-4 pt-4 border-t border-secondary/20">
                            <p className="font-mono text-xs text-foreground/60 uppercase tracking-wider mb-2">
                              Learning Path
                            </p>
                            <div className="flex items-center gap-1 text-xs">
                              {tool.learningPath.map((step, i) => (
                                <React.Fragment key={step}>
                                  <span className="text-foreground/70">{step}</span>
                                  {i < tool.learningPath!.length - 1 && (
                                    <span className="text-foreground/40">→</span>
                                  )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* CTA */}
                        <button className="w-full mt-auto px-4 py-2 bg-aerospace-blue/10 border border-aerospace-blue/30 text-aerospace-blue hover:bg-aerospace-blue/20 hover:border-aerospace-blue/60 transition-all rounded-lg font-mono text-sm font-semibold flex items-center justify-center gap-2 group/btn">
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

        {/* Learning Paths Section */}
        <section className="w-full py-24 bg-primary border-t border-secondary/20">
          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <BookOpen className="w-6 h-6 text-aerospace-blue" />
                <span className="font-mono text-sm uppercase tracking-widest text-aerospace-blue">
                  Learning
                </span>
              </div>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
                Structured Learning Paths
              </h2>
              <p className="font-paragraph text-lg text-secondary-foreground max-w-3xl mx-auto">
                Master our tools with guided learning paths designed for different skill levels.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Beginner Path',
                  description: 'Start with fundamentals and basic workflows',
                  steps: ['Introduction', 'Basic Operations', 'First Project'],
                  icon: Lightbulb,
                },
                {
                  title: 'Intermediate Path',
                  description: 'Advance your skills with complex designs',
                  steps: ['Advanced Features', 'Optimization', 'Best Practices'],
                  icon: Zap,
                },
                {
                  title: 'Expert Path',
                  description: 'Master advanced techniques and customization',
                  steps: ['Custom Workflows', 'API Integration', 'Certification'],
                  icon: Award,
                },
              ].map((path, idx) => {
                const PathIcon = path.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="p-8 bg-aerospace-dark border border-aerospace-blue/20 rounded-lg hover:border-aerospace-blue/60 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-aerospace-blue/15 rounded-lg">
                        <PathIcon className="w-6 h-6 text-aerospace-blue" />
                      </div>
                      <h3 className="font-heading text-lg font-bold text-foreground">
                        {path.title}
                      </h3>
                    </div>
                    <p className="font-paragraph text-sm text-foreground/70 mb-6">
                      {path.description}
                    </p>
                    <div className="space-y-3">
                      {path.steps.map((step, stepIdx) => (
                        <div key={step} className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-aerospace-blue/20 flex items-center justify-center">
                            <span className="font-mono text-xs font-bold text-aerospace-blue">
                              {stepIdx + 1}
                            </span>
                          </div>
                          <span className="font-paragraph text-sm text-foreground/80">
                            {step}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="w-full py-24 bg-aerospace-dark border-t border-secondary/20">
          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <Target className="w-6 h-6 text-aerospace-blue" />
                <span className="font-mono text-sm uppercase tracking-widest text-aerospace-blue">
                  Applications
                </span>
              </div>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
                Real-World Use Cases
              </h2>
              <p className="font-paragraph text-lg text-secondary-foreground max-w-3xl mx-auto">
                See how our tools solve real engineering challenges across industries.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: 'Aircraft Wing Design',
                  description: 'Optimize aerodynamic performance with deterministic CAD compilation',
                  icon: Wind,
                },
                {
                  title: 'Mechanical Assembly',
                  description: 'Create complex assemblies with precision tolerances and audit trails',
                  icon: Workflow,
                },
                {
                  title: 'Robotics Kinematics',
                  description: 'Design and simulate robot motion with real-time feedback',
                  icon: Brain,
                },
                {
                  title: 'Manufacturing Compliance',
                  description: 'Ensure aerospace-grade standards with automated validation',
                  icon: Lock,
                },
              ].map((useCase, idx) => {
                const UseCaseIcon = useCase.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="p-8 bg-primary border border-aerospace-blue/20 rounded-lg hover:border-aerospace-blue/60 transition-all duration-300 group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-4 bg-aerospace-blue/15 rounded-lg group-hover:bg-aerospace-blue/30 transition-colors shrink-0">
                        <UseCaseIcon className="w-6 h-6 text-aerospace-blue" />
                      </div>
                      <div>
                        <h3 className="font-heading text-lg font-bold text-foreground mb-2 group-hover:text-aerospace-blue transition-colors">
                          {useCase.title}
                        </h3>
                        <p className="font-paragraph text-sm text-foreground/70">
                          {useCase.description}
                        </p>
                      </div>
                    </div>
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
