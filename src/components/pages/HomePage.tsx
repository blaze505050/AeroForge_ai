import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll } from 'framer-motion';
import { CheckCircle2, Layers, ShieldCheck, Cpu, Terminal, XCircle, ChevronRight, BookOpen, Zap, Code2, Database, Lightbulb, ArrowRight, Rocket, Sparkles, Award, TrendingUp, Brain, Wind, Users, Microscope, Cloud, Gauge, Workflow, Lock, Globe, BarChart3, GitBranch, Target } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HelpTooltip from '@/components/HelpTooltip';
import PremiumToolsSection from '@/components/PremiumToolsSection';
import { Image } from '@/components/ui/image';
import { BaseCrudService } from '@/integrations';
import { CaseStudies, KnowledgeBaseArticles, ResearchPapers } from '@/entities';

const HERO_DATA = {
  headline: "The Engineering Operating System",
  subtext: "Command-center precision for aerospace design. Real-time CFD, FEM, and flight dynamics. Physics-accurate. Production-ready. Enterprise-grade.",
  cta: "Enter Command Center"
};

const FEATURES = [
  { 
    title: "Physics-Accurate Simulations", 
    desc: "Navier-Stokes CFD & FEM solvers",
    help: "High-fidelity physics engines with real-world constants ensure aerospace-grade accuracy in every simulation.",
    icon: Wind
  },
  { 
    title: "Real-Time Optimization", 
    desc: "Multi-objective design optimization",
    help: "Instant feedback on design changes with Pareto frontier analysis for optimal aerospace solutions.",
    icon: Zap
  },
  { 
    title: "Digital Thread Integration", 
    desc: "Complete design traceability",
    help: "Full audit trail from concept to manufacturing with version control and compliance tracking.",
    icon: Layers
  },
  { 
    title: "Enterprise Deployment", 
    desc: "Production-ready infrastructure",
    help: "ISO 27001 certified, scalable cloud architecture with 99.99% uptime SLA.",
    icon: Cpu
  },
];

const ANTI_GOALS = [
  "No unpredictable mesh generation",
  "No automatic topology changes",
  "No hidden geometry repairs",
  "No black-box outputs",
  "No probabilistic approximations",
  "No machine learning guessing"
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

  return (
    <div ref={containerRef} className="min-h-screen bg-aerospace-dark text-foreground font-paragraph selection:bg-aerospace-blue selection:text-white flex flex-col overflow-clip">
      <Header />

      <main className="flex-1 w-full flex flex-col">
        
        {/* HERO SECTION - Command Center Entry Point */}
        <section className="relative w-full min-h-screen flex flex-col justify-center border-b border-secondary/20 bg-aerospace-dark overflow-hidden">
          <GridBackground />
          
          {/* Animated background elements */}
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
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="pt-8 flex flex-col sm:flex-row gap-4"
                >
                  <Link 
                    to="/virtual-lab"
                    className="group relative inline-flex items-center justify-center px-10 py-5 bg-aerospace-blue text-white font-mono text-sm uppercase tracking-wider hover:bg-aerospace-accent transition-all duration-300 rounded-lg shadow-xl hover:shadow-2xl hover:-translate-y-1"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {HERO_DATA.cta}
                      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                  <Link 
                    to="/labs/aerodynamics"
                    className="group relative inline-flex items-center justify-center px-10 py-5 bg-transparent border-2 border-aerospace-blue text-aerospace-blue font-mono text-sm uppercase tracking-wider hover:bg-aerospace-blue hover:text-white transition-all duration-300 rounded-lg"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Aerodynamics Lab
                      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </motion.div>
              </div>

              {/* Right: Telemetry Dashboard */}
              <div className="lg:col-span-5 hidden lg:flex flex-col justify-center items-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 40 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="w-full aspect-square border-2 border-aerospace-blue/40 relative p-8 flex flex-col justify-between bg-gradient-to-br from-aerospace-blue/15 to-aerospace-accent/15 backdrop-blur-sm rounded-xl hover:border-aerospace-blue/70 transition-all duration-300 shadow-2xl"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-aerospace-success rounded-full animate-pulse" />
                      <span className="font-mono text-xs text-aerospace-blue/90 font-semibold">ACTIVE</span>
                    </div>
                    <Terminal className="w-6 h-6 text-aerospace-blue/70" />
                  </div>
                  
                  <div className="space-y-5 font-mono text-xs text-aerospace-blue/80">
                    <div className="flex justify-between border-b border-aerospace-blue/30 pb-3">
                      <span className="font-semibold">PHYSICS ENGINE</span>
                      <span className="text-aerospace-success font-bold">NAVIER-STOKES</span>
                    </div>
                    <div className="flex justify-between border-b border-aerospace-blue/30 pb-3">
                      <span className="font-semibold">SOLVER TYPE</span>
                      <span className="text-aerospace-accent font-bold">IMPLICIT FEM</span>
                    </div>
                    <div className="flex justify-between border-b border-aerospace-blue/30 pb-3">
                      <span className="font-semibold">CONVERGENCE</span>
                      <span className="text-aerospace-blue font-bold">99.7%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">ACCURACY</span>
                      <span className="text-aerospace-success font-bold">VALIDATED</span>
                    </div>
                  </div>

                  <div className="text-center space-y-2 pt-6 border-t border-aerospace-blue/30">
                    <p className="font-mono text-xs text-foreground/50 font-semibold">v2.0 • Production Ready</p>
                    <p className="font-mono text-xs text-aerospace-blue/70 font-semibold">Physics-Accurate</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* PHYSICS CAPABILITIES SECTION */}
        <section className="w-full py-32 bg-primary border-t border-secondary/20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <GridBackground />
          </div>
          
          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <Microscope className="w-6 h-6 text-aerospace-blue" />
                <span className="font-mono text-sm uppercase tracking-widest text-aerospace-blue">Physics Engine</span>
              </div>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
                World-Class Simulation
              </h2>
              <p className="font-paragraph text-xl text-secondary-foreground max-w-3xl mx-auto">
                High-fidelity solvers with real-world physics constants. Validated against experimental data.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {FEATURES.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="group relative bg-gradient-to-br from-aerospace-dark/60 to-aerospace-dark/40 border border-aerospace-blue/20 rounded-lg p-6 hover:border-aerospace-blue/60 hover:from-aerospace-dark/80 hover:to-aerospace-dark/60 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-aerospace-blue/15 rounded-lg group-hover:bg-aerospace-blue/30 transition-colors">
                        <Icon className="w-6 h-6 text-aerospace-blue group-hover:text-aerospace-accent transition-colors" />
                      </div>
                      <HelpTooltip text={item.help} />
                    </div>
                    <h3 className="font-heading text-lg font-bold text-foreground mb-2 group-hover:text-aerospace-blue transition-colors">
                      {item.title}
                    </h3>
                    <p className="font-paragraph text-sm text-foreground/70 group-hover:text-foreground/80 transition-colors">
                      {item.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* PREMIUM TOOLS SECTION */}
        <PremiumToolsSection />

        {/* VIRTUAL LAB SHOWCASE */}
        <section className="w-full py-32 bg-primary border-t border-secondary/20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-aerospace-blue rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-aerospace-accent rounded-full blur-3xl" />
          </div>

          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-aerospace-blue animate-pulse" />
                <span className="font-mono text-sm uppercase tracking-widest text-aerospace-blue">
                  Research Laboratory
                </span>
                <Sparkles className="w-6 h-6 text-aerospace-blue animate-pulse" />
              </div>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
                Specialized Virtual Labs
              </h2>
              <p className="font-paragraph text-xl text-secondary-foreground max-w-3xl mx-auto mb-8">
                Dedicated environments for aerodynamics, propulsion, structures, and thermal analysis. Each lab is physics-validated and production-ready.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                {
                  title: 'Aerodynamics Lab',
                  description: 'CFD with turbulence modeling (k-ε, k-ω, SST)',
                  icon: Wind,
                  color: 'from-blue-500 to-cyan-500'
                },
                {
                  title: 'Structures Lab',
                  description: 'FEM with nonlinear dynamics and fatigue analysis',
                  icon: Layers,
                  color: 'from-purple-500 to-pink-500'
                },
                {
                  title: 'Propulsion Lab',
                  description: 'Turbomachinery design with thermodynamic analysis',
                  icon: Rocket,
                  color: 'from-orange-500 to-red-500'
                }
              ].map((tool, idx) => {
                const ToolIcon = tool.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="group relative bg-aerospace-dark/50 border border-aerospace-blue/20 rounded-lg p-6 hover:border-aerospace-blue/60 transition-all duration-300 cursor-pointer"
                  >
                    <div className={`p-3 bg-gradient-to-br ${tool.color} rounded-lg w-fit mb-4`}>
                      <ToolIcon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-heading text-lg font-bold text-foreground mb-2 group-hover:text-aerospace-blue transition-colors">
                      {tool.title}
                    </h3>
                    <p className="font-paragraph text-sm text-foreground/70">
                      {tool.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            <div className="text-center">
              <Link
                to="/virtual-lab"
                className="group relative inline-flex items-center justify-center px-12 py-6 bg-gradient-to-r from-aerospace-blue to-aerospace-accent text-white font-mono text-sm uppercase tracking-wider hover:shadow-2xl transition-all duration-300 rounded-lg shadow-xl hover:-translate-y-1"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Explore Virtual Labs
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* PREMIUM CONVERSION SECTION */}
        <section className="w-full py-32 bg-gradient-to-br from-aerospace-dark via-primary to-aerospace-dark border-t border-secondary/20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-96 h-96 bg-aerospace-blue rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-aerospace-accent rounded-full blur-3xl" />
          </div>

          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left: Value Proposition */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Award className="w-6 h-6 text-aerospace-blue" />
                    <span className="font-mono text-xs uppercase tracking-widest text-aerospace-blue font-semibold">
                      Enterprise Features
                    </span>
                  </div>
                  <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
                    Production-Ready Platform
                  </h2>
                  <p className="font-paragraph text-lg text-foreground/70">
                    Deploy aerospace-grade simulations with enterprise security, team collaboration, and real-time optimization.
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    { icon: Zap, label: 'Real-Time Optimization', desc: 'Multi-objective Pareto frontier analysis' },
                    { icon: Brain, label: 'AI-Enhanced Workflows', desc: 'Physics-informed machine learning suggestions' },
                    { icon: Gauge, label: 'Advanced Simulations', desc: 'CFD, FEM, and thermal in one platform' },
                    { icon: Lock, label: 'Enterprise Security', desc: 'ISO 27001 certified infrastructure' },
                    { icon: TrendingUp, label: 'Performance Tracking', desc: 'Real-time metrics and convergence monitoring' },
                    { icon: Users, label: 'Team Collaboration', desc: 'Multi-user projects with version control' }
                  ].map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: idx * 0.05 }}
                        viewport={{ once: true }}
                        className="flex items-start gap-4 p-4 bg-primary/40 border border-aerospace-blue/20 rounded-lg hover:border-aerospace-blue/50 transition-all duration-300 group cursor-pointer"
                      >
                        <div className="p-2 bg-aerospace-blue/20 rounded-lg group-hover:bg-aerospace-blue/30 transition-colors">
                          <Icon className="w-5 h-5 text-aerospace-blue" />
                        </div>
                        <div>
                          <p className="font-mono text-sm font-semibold text-aerospace-blue">{item.label}</p>
                          <p className="font-paragraph text-xs text-foreground/60">{item.desc}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Right: Pricing & CTA */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div className="relative bg-gradient-to-br from-aerospace-blue/20 to-aerospace-accent/20 border-2 border-aerospace-blue/50 rounded-xl p-8 md:p-12 shadow-2xl hover:border-aerospace-blue/80 transition-all duration-300">
                  <div className="absolute -top-4 -right-4 bg-gradient-to-r from-aerospace-blue to-aerospace-accent text-white px-4 py-2 rounded-full font-mono text-xs font-bold uppercase tracking-wider">
                    Most Popular
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-heading text-3xl font-bold text-foreground mb-2">
                        Professional Plan
                      </h3>
                      <p className="font-paragraph text-sm text-foreground/70">
                        Everything for professional aerospace engineering
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-baseline gap-2">
                        <span className="font-heading text-5xl font-bold text-aerospace-blue">$199</span>
                        <span className="font-mono text-sm text-foreground/60">/month</span>
                      </div>
                      <p className="font-paragraph text-xs text-foreground/50">
                        Billed annually: $1,990/year (Save 17%)
                      </p>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-aerospace-blue/30">
                      {[
                        'Unlimited design projects',
                        'Advanced CFD & FEM solvers',
                        'Real-time optimization engine',
                        'Physics-validated simulations',
                        'Priority support (24/7)',
                        'Team collaboration (up to 20 users)',
                        'Custom integrations',
                        'Advanced analytics & reporting'
                      ].map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <CheckCircle2 className="w-4 h-4 text-aerospace-success flex-shrink-0" />
                          <span className="font-paragraph text-sm text-foreground/80">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-6 space-y-3">
                      <Link
                        to="/virtual-lab"
                        className="w-full group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-aerospace-blue to-aerospace-accent text-white font-mono text-sm uppercase tracking-wider hover:shadow-2xl transition-all duration-300 rounded-lg shadow-xl hover:-translate-y-1"
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          Start Free Trial
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      </Link>
                      <p className="font-mono text-xs text-center text-foreground/50">
                        14-day free trial • No credit card required
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-center">
                  <p className="font-paragraph text-sm text-foreground/70">
                    Join 500+ aerospace engineers using AeroForge
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-full bg-gradient-to-br from-aerospace-blue to-aerospace-accent border-2 border-primary flex items-center justify-center text-white text-xs font-bold"
                        >
                          {i}
                        </div>
                      ))}
                    </div>
                    <span className="font-mono text-xs text-aerospace-blue font-semibold">
                      +500 Active Users
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ANTI-GOALS SECTION */}
        <section className="w-full py-32 bg-aerospace-dark border-t border-secondary/20">
          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32">
              
              <div className="space-y-12">
                <div className="flex items-start gap-3">
                  <h3 className="font-heading text-3xl font-bold text-aerospace-blue">What We Don't Do</h3>
                  <HelpTooltip text="We reject probabilistic methods and black-box approximations to ensure aerospace-grade reliability." />
                </div>
                <p className="font-paragraph text-lg text-foreground/70">
                  No heuristics. No approximations. No black boxes.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ANTI_GOALS.map((goal, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-4 border border-aerospace-danger/20 bg-aerospace-danger/5 rounded-lg">
                      <XCircle className="w-5 h-5 text-aerospace-danger shrink-0" />
                      <span className="font-mono text-sm text-foreground/80">{goal}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative h-full min-h-[400px] w-full overflow-hidden bg-secondary/10 rounded-lg">
                 <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
                    <div className="font-mono text-xs text-foreground/40 border-b border-foreground/10 pb-2">
                      PHYSICS VALIDATION
                    </div>
                    <div className="font-mono text-xs text-foreground/40 text-right border-t border-foreground/10 pt-2">
                      NAVIER-STOKES VERIFIED
                    </div>
                 </div>
                 <Image 
                   src="https://static.wixstatic.com/media/18a222_de3f5098f22341a8913a5e9d8acc81c9~mv2.png?originWidth=576&originHeight=384"
                   alt="Aerospace simulation visualization"
                   className="w-full h-full object-cover opacity-80 grayscale contrast-125 mix-blend-multiply"
                 />
              </div>
            </div>
          </div>
        </section>

        {/* RESEARCH PAPERS SECTION */}
        {!isLoading && papers.length > 0 && (
          <section className="w-full py-32 bg-primary border-t border-secondary/20">
            <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="mb-16"
              >
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="w-6 h-6 text-aerospace-blue" />
                  <span className="font-mono text-sm uppercase tracking-widest text-aerospace-blue">Research</span>
                </div>
                <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
                  Latest Papers
                </h2>
                <p className="font-paragraph text-lg text-secondary-foreground max-w-2xl">
                  Peer-reviewed research on physics-accurate aerospace simulation.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {papers.map((paper, idx) => (
                  <motion.div
                    key={paper._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="group relative bg-aerospace-dark/50 border border-secondary/20 rounded-lg p-6 hover:border-aerospace-blue/50 transition-all duration-300 flex flex-col"
                  >
                    <div className="mb-4">
                      <p className="font-mono text-xs text-aerospace-blue uppercase tracking-widest mb-2">
                        {paper.researchTopic}
                      </p>
                      <h3 className="font-heading text-lg font-bold text-foreground group-hover:text-aerospace-blue transition-colors line-clamp-2">
                        {paper.title}
                      </h3>
                    </div>
                    <p className="font-paragraph text-sm text-foreground/70 mb-4 flex-1 line-clamp-3">
                      {paper.abstract}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-secondary/20">
                      <span className="font-mono text-xs text-secondary-foreground line-clamp-1">
                        {paper.authors}
                      </span>
                      {paper.pdfUrl && (
                        <a href={paper.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-aerospace-blue hover:text-aerospace-accent transition-colors">
                          <ArrowRight className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CASE STUDIES SECTION */}
        {!isLoading && caseStudies.length > 0 && (
          <section className="w-full py-32 bg-aerospace-dark border-t border-secondary/20">
            <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="mb-16"
              >
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-6 h-6 text-aerospace-blue" />
                  <span className="font-mono text-sm uppercase tracking-widest text-aerospace-blue">Success Stories</span>
                </div>
                <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
                  Real Results
                </h2>
                <p className="font-paragraph text-lg text-secondary-foreground max-w-2xl">
                  How companies transformed their design workflows with physics-accurate simulation.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {caseStudies.map((study, idx) => (
                  <motion.div
                    key={study._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="group relative bg-gradient-to-br from-aerospace-dark/60 to-aerospace-dark/40 border border-aerospace-blue/20 rounded-lg overflow-hidden hover:border-aerospace-blue/60 transition-all duration-300 shadow-lg hover:shadow-xl flex flex-col"
                  >
                    {study.mainProjectImage && (
                      <div className="relative h-48 overflow-hidden">
                        <Image 
                          src={study.mainProjectImage}
                          alt={study.projectName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="font-heading text-lg font-bold text-foreground mb-2 group-hover:text-aerospace-blue transition-colors">
                        {study.projectName}
                      </h3>
                      <p className="font-mono text-xs text-aerospace-blue uppercase tracking-widest mb-3">
                        {study.industrySector}
                      </p>
                      <p className="font-paragraph text-sm text-foreground/70 mb-4 flex-1 line-clamp-2">
                        {study.projectOverview}
                      </p>
                      {study.performanceImprovement && (
                        <div className="pt-4 border-t border-secondary/20">
                          <p className="font-mono text-xs text-aerospace-success font-bold">
                            +{study.performanceImprovement}% Performance
                          </p>
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
        <section className="w-full py-24 bg-primary border-t border-secondary/20">
          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
                Ready to Experience Physics-Accurate Engineering?
              </h2>
              <p className="font-paragraph text-xl text-secondary-foreground max-w-2xl mx-auto mb-8">
                Join the world's leading aerospace companies using AeroForge for production-grade simulations.
              </p>
              <Link 
                to="/virtual-lab"
                className="group relative inline-flex items-center justify-center px-12 py-6 bg-aerospace-blue text-white font-mono text-sm uppercase tracking-wider hover:bg-aerospace-accent transition-all duration-300 rounded-lg shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Enter Command Center
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
