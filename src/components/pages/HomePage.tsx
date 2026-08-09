import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll } from 'framer-motion';
import { Wind, Zap, Layers, Cpu, Rocket, Sparkles, ShieldCheck, ArrowRight, BookOpen, Microscope, Database, Target, Users, Globe, Satellite, Telescope, Eye, Orbit, Compass, Waves, TrendingUp } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Image } from '@/components/ui/image';
import { BaseCrudService } from '@/integrations';
import { CaseStudies, KnowledgeBaseArticles, ResearchPapers } from '@/entities';

const HERO_DATA = {
  headline: "The Engineering Operating System",
  subtext: "Command-center precision for aerospace design. Real-time CFD, FEM, and flight dynamics. Physics-accurate. Production-ready. Enterprise-grade.",
  cta: "Enter Command Center"
};

const CORE_FEATURES = [
  { 
    title: "Physics-Accurate Simulations", 
    desc: "Navier-Stokes CFD & FEM solvers",
    icon: Wind
  },
  { 
    title: "Real-Time Optimization", 
    desc: "Multi-objective design optimization",
    icon: Zap
  },
  { 
    title: "Digital Thread Integration", 
    desc: "Complete design traceability",
    icon: Layers
  },
  { 
    title: "Enterprise Deployment", 
    desc: "Production-ready infrastructure",
    icon: Cpu
  },
];

interface CoreTool {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  path?: string;
}

const CORE_TOOLS: CoreTool[] = [
  // Aerodynamics
  { id: 'aerodynamics', title: 'Aerodynamics Lab', description: 'CFD analysis with flow visualization', icon: Wind, category: 'Aerodynamics', path: '/labs/aerodynamics' },
  { id: 'airfoil-designer', title: 'Airfoil Design Studio', description: 'NACA profile generation & optimization', icon: Rocket, category: 'Aerodynamics' },
  
  // Structural Analysis
  { id: 'structural-analysis', title: 'Structural Analysis', description: 'FEA solver with stress analysis', icon: Layers, category: 'Structures' },
  { id: 'materials-lab', title: 'Materials Lab', description: 'Material properties & testing', icon: Cpu, category: 'Structures' },
  
  // Propulsion
  { id: 'propulsion-systems', title: 'Propulsion Systems', description: 'Engine analysis & thermodynamics', icon: Rocket, category: 'Propulsion' },
  { id: 'thrust-calculator', title: 'Thrust Calculator', description: 'Engine performance analysis', icon: Zap, category: 'Propulsion' },
  
  // Research & Data
  { id: 'research-hub', title: 'Research Hub', description: 'Aerospace research papers', icon: Microscope, category: 'Research' },
  { id: 'knowledge-base', title: 'Knowledge Base', description: 'Technical documentation', icon: BookOpen, category: 'Research' },
  { id: 'cfd-datasets', title: 'CFD Datasets', description: 'Validated simulation data', icon: Database, category: 'Research' },
  
  // Optimization
  { id: 'multi-objective', title: 'Multi-Objective Optimizer', description: 'Pareto frontier analysis', icon: Target, category: 'Optimization' },
  { id: 'batch-processing', title: 'Batch Processing', description: 'Parallel simulation engine', icon: Cpu, category: 'Optimization' },
  
  // Astronomy
  { id: 'astrolab-spatial', title: 'Spatial Intelligence', description: '3D geospatial visualization', icon: Globe, category: 'AstroLab', path: '/astrolab/spatial-globe' },
  { id: 'satellite-mapper', title: 'Satellite Constellation', description: 'LEO/MEO/GEO tracking', icon: Satellite, category: 'AstroLab', path: '/astrolab/satellite-constellation' },
  { id: 'orbital-mechanics', title: 'Orbital Mechanics', description: 'Kepler element calculations', icon: Orbit, category: 'AstroLab', path: '/astrolab/orbital-mechanics' },
];

const GridBackground = () => (
  <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]" 
       style={{ 
         backgroundImage: 'linear-gradient(#0EA5E9 1px, transparent 1px), linear-gradient(90deg, #0EA5E9 1px, transparent 1px)', 
         backgroundSize: '40px 40px' 
       }} 
  />
);

export default function HomePage() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  const [caseStudies, setCaseStudies] = useState<CaseStudies[]>([]);
  const [articles, setArticles] = useState<KnowledgeBaseArticles[]>([]);
  const [papers, setPapers] = useState<ResearchPapers[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const [studiesResult, articlesResult, papersResult] = await Promise.all([
          BaseCrudService.getAll<CaseStudies>('casestudies', [], { limit: 3 }),
          BaseCrudService.getAll<KnowledgeBaseArticles>('knowledgebasearticles', [], { limit: 3 }),
          BaseCrudService.getAll<ResearchPapers>('researchpapers', [], { limit: 3 })
        ]);
        setCaseStudies(studiesResult.items);
        setArticles(articlesResult.items);
        setPapers(papersResult.items);
      } catch (error) {
        console.error('Error loading content:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadContent();
  }, []);

  const handleToolClick = (tool: CoreTool) => {
    if (tool.path) {
      navigate(tool.path);
    }
  };

  const categories = Array.from(new Set(CORE_TOOLS.map(t => t.category)));

  return (
    <div ref={containerRef} className="min-h-screen bg-aerospace-dark text-foreground font-paragraph selection:bg-aerospace-blue selection:text-white flex flex-col overflow-clip">
      <Header />

      <main className="flex-1 w-full flex flex-col">
        
        {/* HERO SECTION */}
        <section className="relative w-full min-h-screen flex flex-col justify-center border-b border-secondary/20 bg-aerospace-dark overflow-hidden">
          <GridBackground />
          
          <div className="absolute top-20 right-10 w-96 h-96 bg-aerospace-blue/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-aerospace-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          
          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16 relative z-10 pt-32 pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
              
              <div className="lg:col-span-7 flex flex-col gap-8">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="flex items-center gap-3"
                >
                  <Rocket className="w-5 h-5 text-aerospace-blue" />
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-aerospace-blue">
                    Enterprise AI • Next Generation
                  </span>
                </motion.div>

                <motion.h1 
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight"
                >
                  <span className="text-aerospace-blue">Physics</span> <br />
                  <span className="text-aerospace-accent">Meets</span> <br />
                  <span className="text-foreground">Precision</span>
                </motion.h1>

                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="font-paragraph text-xl md:text-2xl text-foreground/80 max-w-3xl leading-relaxed border-l-4 border-aerospace-blue pl-8"
                >
                  {HERO_DATA.subtext}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4"
                >
                  {[
                    { icon: Sparkles, label: "Navier-Stokes Solver", desc: "High-fidelity CFD" },
                    { icon: ShieldCheck, label: "FEM Analysis", desc: "Nonlinear dynamics" },
                    { icon: Zap, label: "Real-Time Optimization", desc: "Instant feedback" }
                  ].map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div key={idx} className="flex items-start gap-3 p-4 bg-primary/40 border border-aerospace-blue/20 rounded-lg hover:border-aerospace-blue/50 transition-colors">
                        <Icon className="w-5 h-5 text-aerospace-blue shrink-0 mt-1" />
                        <div>
                          <p className="font-mono text-xs text-aerospace-blue uppercase tracking-wider">{item.label}</p>
                          <p className="font-paragraph text-sm text-foreground/70">{item.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="flex flex-col sm:flex-row gap-4 pt-8"
                >
                  <Link to="/virtual-lab" className="px-8 py-4 bg-aerospace-blue text-white font-mono font-bold uppercase tracking-wider rounded-lg hover:bg-aerospace-accent transition-colors flex items-center justify-center gap-2">
                    Launch Labs <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link to="/documentation" className="px-8 py-4 border border-aerospace-blue/50 text-aerospace-blue font-mono font-bold uppercase tracking-wider rounded-lg hover:bg-aerospace-blue/10 transition-colors flex items-center justify-center gap-2">
                    Documentation <BookOpen className="w-4 h-4" />
                  </Link>
                </motion.div>
              </div>

              <div className="lg:col-span-5 relative h-96 lg:h-full">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="absolute inset-0 bg-gradient-to-br from-aerospace-blue/20 to-aerospace-accent/20 rounded-2xl border border-aerospace-blue/30 flex items-center justify-center"
                >
                  <div className="text-center">
                    <Cpu className="w-24 h-24 text-aerospace-blue/40 mx-auto mb-4" />
                    <p className="text-foreground/60 font-mono text-sm">Advanced Simulation Engine</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* CORE FEATURES */}
        <section className="w-full py-24 bg-primary/50 border-b border-secondary/20">
          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">Enterprise Capabilities</h2>
              <p className="text-foreground/70 text-lg max-w-2xl">Production-grade tools for aerospace engineering at scale</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {CORE_FEATURES.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="p-6 bg-primary border border-aerospace-blue/20 rounded-xl hover:border-aerospace-blue/50 transition-colors group"
                  >
                    <Icon className="w-8 h-8 text-aerospace-blue mb-4 group-hover:text-aerospace-accent transition-colors" />
                    <h3 className="font-heading text-lg font-bold mb-2">{feature.title}</h3>
                    <p className="text-foreground/70 text-sm">{feature.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CORE TOOLS GRID */}
        <section className="w-full py-24 bg-aerospace-dark border-b border-secondary/20">
          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">Essential Tools</h2>
              <p className="text-foreground/70 text-lg max-w-2xl">{CORE_TOOLS.length} integrated tools across all disciplines</p>
            </motion.div>

            {categories.map((category, catIdx) => {
              const categoryTools = CORE_TOOLS.filter(t => t.category === category);
              return (
                <div key={category} className="mb-12">
                  <h3 className="font-heading text-2xl font-bold mb-6 text-aerospace-blue">{category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryTools.map((tool, idx) => {
                      const Icon = tool.icon;
                      return (
                        <motion.button
                          key={tool.id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: idx * 0.05 }}
                          viewport={{ once: true }}
                          onClick={() => handleToolClick(tool)}
                          className="p-4 bg-primary border border-aerospace-blue/20 rounded-lg hover:border-aerospace-blue/50 hover:bg-primary/80 transition-all text-left group"
                        >
                          <div className="flex items-start gap-3">
                            <Icon className="w-6 h-6 text-aerospace-blue shrink-0 mt-1 group-hover:text-aerospace-accent transition-colors" />
                            <div className="flex-1">
                              <h4 className="font-heading font-bold text-sm mb-1">{tool.title}</h4>
                              <p className="text-foreground/70 text-xs">{tool.description}</p>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* CASE STUDIES */}
        {caseStudies.length > 0 && (
          <section className="w-full py-24 bg-primary/50 border-b border-secondary/20">
            <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="mb-16"
              >
                <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">Case Studies</h2>
                <p className="text-foreground/70 text-lg">Real-world aerospace projects</p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {caseStudies.map((study, idx) => (
                  <motion.div
                    key={study._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="p-6 bg-primary border border-aerospace-blue/20 rounded-xl hover:border-aerospace-blue/50 transition-colors"
                  >
                    {study.mainProjectImage && (
                      <Image src={study.mainProjectImage} alt={study.projectName || 'Project'} width={400} height={250} className="w-full h-40 object-cover rounded-lg mb-4" />
                    )}
                    <h3 className="font-heading text-lg font-bold mb-2">{study.projectName}</h3>
                    <p className="text-foreground/70 text-sm mb-4">{study.projectOverview}</p>
                    <div className="flex gap-4 text-xs">
                      {study.performanceImprovement && (
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-aerospace-success" />
                          <span>{study.performanceImprovement}% improvement</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA SECTION */}
        <section className="w-full py-24 bg-aerospace-dark border-b border-secondary/20">
          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Workflow?</h2>
              <p className="text-foreground/70 text-lg mb-8 max-w-2xl mx-auto">Join industry leaders using our platform for aerospace innovation</p>
              <Link to="/virtual-lab" className="inline-block px-8 py-4 bg-aerospace-blue text-white font-mono font-bold uppercase tracking-wider rounded-lg hover:bg-aerospace-accent transition-colors">
                Get Started Now
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
