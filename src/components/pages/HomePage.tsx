// Revolutionary Enterprise Homepage
import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useInView } from 'framer-motion';
import { CheckCircle2, Layers, ShieldCheck, Cpu, Terminal, XCircle, ChevronRight, BookOpen, Zap, Code2, Database, Lightbulb, ArrowRight, Rocket, Sparkles, Award, TrendingUp, Brain, Wind, Users, Microscope, Cloud, Gauge, Workflow, Lock, Zap as Lightning, Globe, BarChart3, GitBranch, Target } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Image } from '@/components/ui/image';
import { BaseCrudService } from '@/integrations';
import { CaseStudies, KnowledgeBaseArticles, ResearchPapers } from '@/entities';

const HERO_DATA = {
  headline: "Revolutionary Parametric Design",
  subtext: "The world's first deterministic AI-powered CAD compiler. Transform natural language design intent into aerospace-certified, manufacturing-ready geometry with zero ambiguity.",
  cta: "Launch Compiler"
};

const PHILOSOPHY_DATA = [
  { 
    title: "Deterministic Execution", 
    desc: "Every design produces identical geometry when executed, ensuring repeatability and manufacturing safety. No probabilistic methods.",
    icon: CheckCircle2
  },
  { 
    title: "Validation-First Design", 
    desc: "All outputs validated against aerospace standards, DFM rules, and manufacturing constraints before delivery.",
    icon: ShieldCheck
  },
  { 
    title: "Transparent Architecture", 
    desc: "No black-box geometry. Explicit, traceable design sequences with full audit trails for compliance and verification.",
    icon: Layers
  },
  { 
    title: "Manufacturing-Ready Output", 
    desc: "Designs emerge production-ready with tolerance specifications, material properties, and assembly instructions.",
    icon: Cpu
  },
  { 
    title: "Enterprise Integration", 
    desc: "Seamless integration with CAD systems, PLM platforms, and manufacturing workflows. API-first architecture.",
    icon: Terminal
  }
];

const ARCHITECTURE_STEPS = [
  { label: "Natural Language Input", details: null },
  { 
    label: "Cloud Reasoning Layer", 
    details: ["FastAPI Backend", "AI Intent Analysis", "JSON DSL Generation", "Pydantic Validation", "DFM Rule Checks"]
  },
  { label: "Validated JSON Feature DSL", details: null },
  { 
    label: "Local Deterministic Interpreter", 
    details: ["CadQuery / Fusion 360 API", "Sequential Execution", "No Heuristics"]
  },
  { label: "Parametric CAD Geometry", details: null }
];

const ANTI_GOALS = [
  "No mesh diffusion",
  "No topology optimization",
  "No auto-repair heuristics",
  "No simulation",
  "No black-box geometry",
  "No reinforcement learning"
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
        
        {/* REVOLUTIONARY HERO SECTION */}
        <section className="relative w-full min-h-screen flex flex-col justify-center border-b border-secondary/20 bg-aerospace-dark overflow-hidden">
          <GridBackground />
          
          {/* Animated background elements */}
          <div className="absolute top-20 right-10 w-96 h-96 bg-aerospace-blue/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-aerospace-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          
          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16 relative z-10 pt-32 pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
              
              {/* Left Column: Revolutionary Messaging */}
              <div className="lg:col-span-7 flex flex-col gap-8">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="flex items-center gap-3"
                >
                  <Rocket className="w-5 h-5 text-aerospace-blue" />
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-aerospace-blue">
                    Next Generation • Enterprise AI
                  </span>
                </motion.div>

                <motion.h1 
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight"
                >
                  <span className="text-aerospace-blue">Deterministic</span> <br />
                  <span className="text-foreground">AI-Powered CAD</span> <br />
                  <span className="text-aerospace-accent">Compiler</span>
                </motion.h1>

                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="font-paragraph text-xl md:text-2xl text-foreground/80 max-w-3xl leading-relaxed border-l-4 border-aerospace-blue pl-8"
                >
                  {HERO_DATA.subtext}
                </motion.p>

                {/* Key differentiators */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4"
                >
                  {[
                    { icon: Sparkles, label: "100% Deterministic", desc: "Identical results, every time" },
                    { icon: ShieldCheck, label: "Aerospace Certified", desc: "Manufacturing-ready" },
                    { icon: Zap, label: "Instant Compilation", desc: "Real-time geometry" }
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
                    to="/compiler"
                    className="group relative inline-flex items-center justify-center px-10 py-5 bg-aerospace-blue text-white font-mono text-sm uppercase tracking-wider hover:bg-aerospace-accent transition-all duration-300 rounded-lg shadow-xl hover:shadow-2xl hover:-translate-y-1"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {HERO_DATA.cta}
                      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                  <Link 
                    to="/about-tools"
                    className="group relative inline-flex items-center justify-center px-10 py-5 bg-transparent border-2 border-aerospace-blue text-aerospace-blue font-mono text-sm uppercase tracking-wider hover:bg-aerospace-blue hover:text-white transition-all duration-300 rounded-lg"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Explore Tools
                      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </motion.div>
              </div>

              {/* Right Column: Visual Showcase */}
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
                      <span className="font-mono text-xs text-aerospace-blue/90 font-semibold">SYSTEM ACTIVE</span>
                    </div>
                    <Terminal className="w-6 h-6 text-aerospace-blue/70" />
                  </div>
                  
                  <div className="space-y-5 font-mono text-xs text-aerospace-blue/80">
                    <div className="flex justify-between border-b border-aerospace-blue/30 pb-3">
                      <span className="font-semibold">COMPILATION MODE</span>
                      <span className="text-aerospace-success font-bold">DETERMINISTIC</span>
                    </div>
                    <div className="flex justify-between border-b border-aerospace-blue/30 pb-3">
                      <span className="font-semibold">VALIDATION LEVEL</span>
                      <span className="text-aerospace-accent font-bold">AEROSPACE</span>
                    </div>
                    <div className="flex justify-between border-b border-aerospace-blue/30 pb-3">
                      <span className="font-semibold">LATENCY</span>
                      <span className="text-aerospace-blue font-bold">12ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">AUDIT TRAIL</span>
                      <span className="text-aerospace-success font-bold">ENABLED</span>
                    </div>
                  </div>

                  <div className="text-center space-y-2 pt-6 border-t border-aerospace-blue/30">
                    <p className="font-mono text-xs text-foreground/50 font-semibold">v1.0.4 • Production Ready</p>
                    <p className="font-mono text-xs text-aerospace-blue/70 font-semibold">Zero Ambiguity • Full Traceability</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* WHY WE'RE SPECIAL SECTION */}
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
                <Award className="w-6 h-6 text-aerospace-blue" />
                <span className="font-mono text-sm uppercase tracking-widest text-aerospace-blue">Industry Leadership</span>
              </div>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
                Why We're Revolutionary
              </h2>
              <p className="font-paragraph text-xl text-secondary-foreground max-w-3xl mx-auto">
                We've fundamentally reimagined how engineers design. No approximations. No black boxes. Pure deterministic precision.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Brain,
                  title: "AI That Understands Intent",
                  desc: "Our cloud reasoning layer interprets natural language design specifications with aerospace-grade precision, not guesses."
                },
                {
                  icon: Sparkles,
                  title: "Zero Ambiguity Guarantee",
                  desc: "Every compilation produces identical results. No probabilistic methods. No randomness. Pure deterministic execution."
                },
                {
                  icon: ShieldCheck,
                  title: "Manufacturing Certified",
                  desc: "Outputs validated against aerospace standards, DFM rules, and manufacturing constraints before delivery."
                },
                {
                  icon: Database,
                  title: "Complete Traceability",
                  desc: "Full audit trails for every design decision. Compliance-ready. Verification-ready. Enterprise-ready."
                },
                {
                  icon: TrendingUp,
                  title: "Performance Proven",
                  desc: "Real-world case studies show 40%+ performance improvements and significant cost reductions across industries."
                },
                {
                  icon: Terminal,
                  title: "Enterprise Integration",
                  desc: "Seamless API-first architecture integrates with your existing CAD systems, PLM platforms, and workflows."
                }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="group relative bg-gradient-to-br from-aerospace-dark/60 to-aerospace-dark/40 border border-aerospace-blue/20 rounded-lg p-8 hover:border-aerospace-blue/60 hover:from-aerospace-dark/80 hover:to-aerospace-dark/60 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 bg-aerospace-blue/15 rounded-lg group-hover:bg-aerospace-blue/30 transition-colors">
                        <Icon className="w-6 h-6 text-aerospace-blue group-hover:text-aerospace-accent transition-colors" />
                      </div>
                    </div>
                    <h3 className="font-heading text-xl font-bold text-foreground mb-3 group-hover:text-aerospace-blue transition-colors">
                      {item.title}
                    </h3>
                    <p className="font-paragraph text-foreground/70 group-hover:text-foreground/80 transition-colors">
                      {item.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* PHILOSOPHY SECTION */}
        <section className="w-full bg-aerospace-dark relative">
          <div className="w-full max-w-[120rem] mx-auto">
            <div className="flex flex-col lg:flex-row">
              
              {/* Sticky Sidebar */}
              <div className="lg:w-1/3 lg:sticky lg:top-0 lg:h-screen flex flex-col justify-center p-8 md:p-16 lg:p-20 border-b lg:border-b-0 lg:border-r border-secondary/20 bg-aerospace-dark z-10">
                <div className="space-y-6">
                  <div className="w-12 h-1 bg-aerospace-blue mb-8" />
                  <h2 className="font-heading text-4xl md:text-5xl font-bold text-aerospace-blue leading-tight">
                    Core <br /> Philosophy
                  </h2>
                  <p className="font-paragraph text-lg text-foreground/70 max-w-md">
                    AeroForge AI is built on unshakeable engineering principles. We prioritize determinism over creativity, and validation over heuristics.
                  </p>
                </div>
              </div>

              {/* Scrolling Content */}
              <div className="lg:w-2/3 bg-primary/50">
                {PHILOSOPHY_DATA.map((item, index) => (
                  <PhilosophyCard key={index} item={item} index={index} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SYSTEM ARCHITECTURE */}
        <section className="w-full py-32 bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
             <GridBackground />
          </div>
          
          <div className="w-full max-w-5xl mx-auto px-6 relative z-10">
            <div className="text-center mb-24">
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">System Architecture</h2>
              <p className="font-mono text-sm text-primary-foreground/60 uppercase tracking-widest">Data Flow Pipeline</p>
            </div>

            <div className="relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-aerospace-blue/20 -translate-x-1/2 hidden md:block" />

              <div className="space-y-16 md:space-y-24">
                {ARCHITECTURE_STEPS.map((step, index) => (
                  <ArchitectureNode key={index} step={step} index={index} total={ARCHITECTURE_STEPS.length} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ANTI-GOALS SECTION */}
        <section className="w-full py-32 bg-aerospace-dark border-t border-secondary/20">
          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32">
              
              <div className="space-y-12">
                <div>
                  <h3 className="font-heading text-3xl font-bold text-aerospace-blue mb-6">Explicit Anti-Goals</h3>
                  <p className="font-paragraph text-lg text-foreground/70 mb-8">
                    To ensure aerospace-grade reliability, we explicitly reject probabilistic methods.
                  </p>
                </div>
                
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
                      REF: INDUSTRIAL_STANDARD_01
                    </div>
                    <div className="font-mono text-xs text-foreground/40 text-right border-t border-foreground/10 pt-2">
                      TOLERANCE: ±0.001mm
                    </div>
                 </div>
                 <Image 
                   src="https://static.wixstatic.com/media/18a222_de3f5098f22341a8913a5e9d8acc81c9~mv2.png?originWidth=576&originHeight=384"
                   alt="Abstract industrial precision component"
                   className="w-full h-full object-cover opacity-80 grayscale contrast-125 mix-blend-multiply"
                 />
              </div>
            </div>
          </div>
        </section>

        {/* RESEARCH PAPERS SECTION */}
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
                <span className="font-mono text-sm uppercase tracking-widest text-aerospace-blue">Research & Innovation</span>
              </div>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
                Research Papers
              </h2>
              <p className="font-paragraph text-lg text-secondary-foreground max-w-2xl">
                Peer-reviewed research and technical papers advancing the field of deterministic CAD compilation.
              </p>
            </motion.div>

            {!isLoading && papers.length > 0 ? (
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
                      <h3 className="font-heading text-lg font-bold text-foreground group-hover:text-aerospace-blue transition-colors">
                        {paper.title}
                      </h3>
                    </div>
                    <p className="font-paragraph text-sm text-foreground/70 mb-4 flex-1">
                      {paper.abstract}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-secondary/20">
                      <span className="font-mono text-xs text-secondary-foreground">
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
            ) : null}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="mt-12 text-center"
            >
              <Link
                to="/research-hub"
                className="inline-flex items-center justify-center px-8 py-3 bg-aerospace-blue text-white font-semibold rounded-lg hover:bg-aerospace-accent transition-colors duration-300 gap-2"
              >
                View All Research <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* REVOLUTIONARY DIGITAL AEROSPACE LAB SECTION */}
        <section className="w-full py-32 bg-aerospace-dark border-t border-secondary/20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <GridBackground />
          </div>
          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-20 text-center"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <Microscope className="w-6 h-6 text-aerospace-accent" />
                <span className="font-mono text-sm uppercase tracking-widest text-aerospace-accent">MVP Platform</span>
              </div>
              <h2 className="font-heading text-5xl md:text-6xl font-bold text-foreground mb-6">
                Cloud-Native Aerospace <br />
                <span className="text-aerospace-accent">Simulation + AI Co-Pilot</span> <br />
                Collaboration Platform
              </h2>
              <p className="font-paragraph text-xl text-secondary-foreground max-w-3xl mx-auto">
                The MVP solves ONE high-value problem extremely well: enabling aerospace engineers to upload CAD, generate mesh, run CFD, optimize designs with AI, and collaborate in real-time—all in the cloud.
              </p>
            </motion.div>

            {/* 12 Core Laboratory Modules */}
            <div className="space-y-12 mb-20">
              {[
                {
                  num: "1.1",
                  title: "Aerodynamics Labs (Virtual Wind Tunnels)",
                  icon: Wind,
                  subsystems: ["Test-case manager", "Virtual wind-tunnel types", "Model geometry manager", "Instrumentation emulator", "Unsteady data capture"],
                  tools: ["Parametric CAD import/export", "Pre/postprocessing GUI & CLI", "Virtual sensors", "Time-series database"],
                  capabilities: ["Subsonic/transonic/supersonic/hypersonic", "Coupled aeroelastic FSI", "Time-accurate unsteady simulations", "Aeroacoustics"],
                  ai: ["ML-based inflow generation", "Surrogate models for lift/drag", "Active experiment suggestion"],
                  cloud: ["GPU-backed auto-scaling", "Data lake for transient datasets", "Streaming telemetry bus"]
                },
                {
                  num: "1.2",
                  title: "Wind Tunnels (Subsonic/Supersonic/Hypersonic)",
                  icon: Wind,
                  subsystems: ["Mach-number control", "Nozzle configuration library", "Cryogenic/thermal control"],
                  tools: ["Virtual calibration suites", "Plume & combustion couplers"],
                  capabilities: ["Real-gas models", "High-temperature air chemistry", "Shock-boundary layer interaction"],
                  ai: ["ML-based shock position prediction"],
                  cloud: ["High memory instances", "Hybrid on-prem GPU bursting"]
                },
                {
                  num: "1.3",
                  title: "CFD Simulation Clusters (Enterprise CFD-as-a-Service)",
                  icon: Gauge,
                  subsystems: ["Multi-tenant job scheduler", "Solver catalog", "Mesh bank with AMR", "Checkpointing & time-travel debugging"],
                  tools: ["Web IDE + Jupyter Lab", "REST & gRPC APIs", "Monitoring dashboards"],
                  capabilities: ["Massive parallel GPU & CPU scaling", "In-situ visualization", "Streaming slices"],
                  ai: ["ML-accelerated linear algebra", "Learned turbulence closure models"],
                  cloud: ["Kubernetes + Slurm hybrid", "NVMe scratch, Lustre/GPFS, cold store"]
                },
                {
                  num: "1.4",
                  title: "Structural Testing Labs (Virtual Testbeds)",
                  icon: Rocket,
                  subsystems: ["Virtual load frames & actuators", "Material nonlinearities", "Vibration & modal test rig"],
                  tools: ["FEA solver integrations", "Digital strain gauge emulation"],
                  capabilities: ["Multi-scale structural models", "Fatigue life prediction", "Mission spectrum analysis"],
                  ai: ["Bayesian experimental planning", "Anomaly detection on modal response"],
                  cloud: ["High-memory nodes for sparse solve"]
                },
                {
                  num: "1.5",
                  title: "Material Science Labs (Virtual Materials Foundry)",
                  icon: Microscope,
                  subsystems: ["Materials database", "Microscale/mesoscale simulation chains", "Manufacturing process simulation"],
                  tools: ["DFT/MD toolchain connectors", "Microstructure image analysis"],
                  capabilities: ["Additive manufacturing residual stress", "Creep & oxidation simulation", "Radiation damage"],
                  ai: ["Generative materials discovery", "Predictive upscaling"],
                  cloud: ["HPC instances for MD/DFT", "Data cataloging for provenance"]
                },
                {
                  num: "1.6",
                  title: "Combustion & Propulsion Labs (Virtual Engine Testbeds)",
                  icon: Rocket,
                  subsystems: ["Injector & chamber libraries", "Thermochemical kinetics engine", "Emissions & soot models", "Thrust stand emulation"],
                  tools: ["0D/1D rocket cycle calculators", "Reaction network management"],
                  capabilities: ["Detailed reacting flow LES/DNS", "Injector-atomization multi-phase", "Spray models"],
                  ai: ["Neural surrogates for instability", "Active control policy search"],
                  cloud: ["GPU clusters with low-latency interconnects", "Checkpoint & restart at scale"]
                },
                {
                  num: "1.7",
                  title: "Rocket Engine Test Simulation Environments",
                  icon: Rocket,
                  subsystems: ["Full-system engine cycle simulators", "Thermal/structural/propellant coupling", "Nozzle plume interactions"],
                  tools: ["Propellant material libraries", "Turbomachinery blade element models", "Stage ignition scripts"],
                  capabilities: ["Multi-physics transient", "Cavitation & LOX/GH2 plumbing", "Failure insertion testing"],
                  ai: ["Rapid sensitivity analysis", "Autotuning of operating points"],
                  cloud: ["Safety-isolated compute enclaves"]
                },
                {
                  num: "1.8",
                  title: "Satellite Integration Labs (Virtual Cleanrooms + AIT)",
                  icon: Sparkles,
                  subsystems: ["Payload mounting & compatibility", "EMI/EMC simulation rigs", "Vibration & shock test emulators", "RF/antenna pattern testbeds"],
                  tools: ["Spacecraft bus & subsystem libraries", "Thermal modeling & scenario builders"],
                  capabilities: ["End-to-end mission simulations", "Power & thermal management", "On-orbit operations"],
                  ai: ["Automated trade-off engine", "Failure mode prediction"],
                  cloud: ["Secure mission environments", "Deterministic simulation runtimes"]
                },
                {
                  num: "1.9",
                  title: "Thermal Vacuum Chambers (Virtual)",
                  icon: Gauge,
                  subsystems: ["Vacuum envelope models", "Radiative thermal network solver"],
                  tools: ["Sun-angle & deep-space thermal builders"],
                  capabilities: ["Thermal vacuum soak", "Bakeout & thermal balance test simulations"],
                  ai: ["Intelligent test sequencing"],
                  cloud: ["Time-series thermal logs", "Virtual instrumentation dashboards"]
                },
                {
                  num: "1.10",
                  title: "Avionics Labs (Virtual HW-in-the-loop & SW-in-the-loop)",
                  icon: Code2,
                  subsystems: ["Real-time RTOS emulators", "Hardware abstraction layers", "Sensor/actuator virtualization"],
                  tools: ["MIL-STD connectors", "DO-178C compliance toolchains", "FPGA/SoC co-simulation"],
                  capabilities: ["HW-in-the-loop over low-latency links", "Avionics bus emulation (ARINC, CAN)"],
                  ai: ["ML summarizer for code coverage", "Safety-critical anomaly detection"],
                  cloud: ["Deterministic low-latency streaming", "Edge compute for HIL"]
                },
                {
                  num: "1.11",
                  title: "Flight Control System Labs",
                  icon: Brain,
                  subsystems: ["GNC algorithm repository", "Monte-Carlo uncertainty injector", "Sensor fusion pipelines"],
                  tools: ["Full aircraft dynamics solvers", "Hardware autopilot connectors"],
                  capabilities: ["High-fidelity aero + structural + control closed-loop", "Failure injection & recovery validation"],
                  ai: ["AI co-pilot for controller tuning", "Automated stability margin search"],
                  cloud: ["GPU compute for RL training", "Rollout databases"]
                },
                {
                  num: "1.12",
                  title: "Orbital Mechanics & Re-entry Simulation Environments",
                  icon: Globe,
                  subsystems: ["Ephemeris & force models", "Atmospheric re-entry/ablation modules", "Guidance & intercept simulation"],
                  tools: ["Mission planning UI", "Patched conics & full n-body solvers", "Monte-Carlo collision simulators"],
                  capabilities: ["High-fidelity atmospheric entry physics", "Plasma sheath modeling", "Reusable vehicle entry & aero-thermal loads"],
                  ai: ["Autonomous reentry trajectory optimizer"],
                  cloud: ["Deterministic simulation pipelines", "Large ephemeris data stores"]
                }
              ].map((lab, idx) => {
                const Icon = lab.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.05 }}
                    viewport={{ once: true }}
                    className="group relative bg-primary/40 border border-aerospace-blue/20 rounded-lg p-8 hover:border-aerospace-accent/50 transition-all duration-300"
                  >
                    <div className="flex items-start gap-4 mb-6">
                      <div className="p-3 bg-aerospace-accent/15 rounded-lg group-hover:bg-aerospace-accent/25 transition-colors">
                        <Icon className="w-6 h-6 text-aerospace-accent" />
                      </div>
                      <div className="flex-1">
                        <p className="font-mono text-xs text-aerospace-accent uppercase tracking-widest mb-1">Module {lab.num}</p>
                        <h3 className="font-heading text-2xl font-bold text-foreground group-hover:text-aerospace-accent transition-colors">
                          {lab.title}
                        </h3>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-heading text-sm font-bold text-aerospace-blue mb-3 uppercase tracking-wider">Subsystems</h4>
                        <ul className="space-y-2">
                          {lab.subsystems.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-foreground/70">
                              <CheckCircle2 className="w-3 h-3 text-aerospace-accent shrink-0 mt-1" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-heading text-sm font-bold text-aerospace-blue mb-3 uppercase tracking-wider">Tools</h4>
                        <ul className="space-y-2">
                          {lab.tools.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-foreground/70">
                              <CheckCircle2 className="w-3 h-3 text-aerospace-accent shrink-0 mt-1" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-heading text-sm font-bold text-aerospace-blue mb-3 uppercase tracking-wider">Capabilities</h4>
                        <ul className="space-y-2">
                          {lab.capabilities.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-foreground/70">
                              <CheckCircle2 className="w-3 h-3 text-aerospace-accent shrink-0 mt-1" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-aerospace-blue/20 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-heading text-sm font-bold text-aerospace-blue mb-3 uppercase tracking-wider">AI Enhancements</h4>
                        <ul className="space-y-2">
                          {lab.ai.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-foreground/70">
                              <Brain className="w-3 h-3 text-aerospace-accent shrink-0 mt-1" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-heading text-sm font-bold text-aerospace-blue mb-3 uppercase tracking-wider">Cloud Architecture</h4>
                        <ul className="space-y-2">
                          {lab.cloud.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-foreground/70">
                              <Cloud className="w-3 h-3 text-aerospace-accent shrink-0 mt-1" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Research Lab Differentiation */}
            <div className="mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <h3 className="font-heading text-3xl font-bold text-aerospace-blue mb-2">Why This Research Lab Ecosystem Wins</h3>
                <div className="w-12 h-1 bg-aerospace-accent" />
              </motion.div>

              <div className="bg-gradient-to-r from-aerospace-accent/10 to-aerospace-blue/10 border border-aerospace-accent/30 rounded-lg p-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    {
                      title: "Complete Virtual Lab Ecosystem",
                      desc: "12 integrated modules covering aerodynamics, propulsion, structures, materials, avionics, and orbital mechanics—replacing entire physical lab infrastructure."
                    },
                    {
                      title: "Enterprise-Grade Cloud Architecture",
                      desc: "GPU-accelerated computing, auto-scaling, deterministic simulation pipelines, and secure isolated enclaves for ITAR-compliant work."
                    },
                    {
                      title: "AI-Native from Day One",
                      desc: "ML-based surrogate models, active learning for experiment design, autonomous optimization, and intelligent test sequencing across all modules."
                    },
                    {
                      title: "Seamless Integration",
                      desc: "All 12 labs interconnected with shared data pipelines, unified version control, collaborative workspaces, and end-to-end mission simulation."
                    }
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Sparkles className="w-5 h-5 text-aerospace-accent shrink-0 mt-1" />
                        <div>
                          <h4 className="font-heading text-lg font-bold text-foreground mb-2">
                            {item.title}
                          </h4>
                          <p className="font-paragraph text-foreground/70">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* MVP Philosophy */}
            <div className="mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <h3 className="font-heading text-3xl font-bold text-aerospace-blue mb-2">MVP Philosophy</h3>
                <div className="w-12 h-1 bg-aerospace-accent" />
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    icon: Sparkles,
                    title: "Solve ONE Problem Extremely Well",
                    desc: "Cloud-native aerospace simulation with AI differentiation. Not everything. Just the core that creates lock-in."
                  },
                  {
                    icon: Target,
                    title: "Target Early Adopters",
                    desc: "CFD researchers, rocket engineers, academic labs, and aerospace startups who need collaborative, cloud-based simulation."
                  },
                  {
                    icon: Cloud,
                    title: "Cloud-Native Architecture",
                    desc: "Fully distributed, auto-scaling infrastructure. No installation pain. Simulation version control built-in from day one."
                  },
                  {
                    icon: Lock,
                    title: "Secure & Enterprise-Ready",
                    desc: "End-to-end encryption, role-based access, isolated project containers. Architecture allows ITAR compliance later."
                  },
                  {
                    icon: Brain,
                    title: "AI Differentiation Immediate",
                    desc: "AI mesh quality predictor, drag/lift surrogate models, auto-convergence monitoring, and smart boundary condition recommender."
                  },
                  {
                    icon: Zap,
                    title: "Fast Time-to-Value",
                    desc: "CAD upload to results in under 30 minutes. First simulation success rate > 85%. User retention > 60% after 30 days."
                  }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: idx * 0.1 }}
                      viewport={{ once: true }}
                      className="group relative bg-primary/40 border border-aerospace-blue/20 rounded-lg p-6 hover:border-aerospace-accent/50 transition-all duration-300"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 bg-aerospace-accent/15 rounded-lg group-hover:bg-aerospace-accent/25 transition-colors">
                          <Icon className="w-6 h-6 text-aerospace-accent" />
                        </div>
                      </div>
                      <h4 className="font-heading text-lg font-bold text-foreground mb-3 group-hover:text-aerospace-accent transition-colors">
                        {item.title}
                      </h4>
                      <p className="font-paragraph text-sm text-foreground/70">
                        {item.desc}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Core MVP Modules */}
            <div className="mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <h3 className="font-heading text-3xl font-bold text-aerospace-blue mb-2">Core MVP Modules</h3>
                <div className="w-12 h-1 bg-aerospace-accent" />
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    icon: Wind,
                    title: "CFD Simulation Engine",
                    items: [
                      "RANS Solvers: k-ω SST, k-ε, Spalart–Allmaras",
                      "Basic LES: Smagorinsky model",
                      "Compressible & Incompressible flow",
                      "Conjugate Heat Transfer (basic)",
                      "External Aerodynamics: Airfoils, Wings, UAV bodies, Rocket bodies",
                      "Unstructured mesh + prism layers + adaptive refinement"
                    ]
                  },
                  {
                    icon: Rocket,
                    title: "Rocket & Propulsion Module",
                    items: [
                      "0D/1D rocket cycle simulator",
                      "Thrust + Isp calculator",
                      "Nozzle expansion ratio optimizer",
                      "Mass budget tool",
                      "ΔV calculator",
                      "Multi-stage rocket builder (simplified)"
                    ]
                  },
                  {
                    icon: Gauge,
                    title: "Structural Simulation (Light)",
                    items: [
                      "Linear static FEA",
                      "Modal analysis",
                      "Basic thermal stress",
                      "Fatigue life estimator (S-N curve)",
                      "No nonlinear crash or fracture mechanics"
                    ]
                  },
                  {
                    icon: Brain,
                    title: "AI Research Copilot",
                    items: [
                      "Aerospace equation derivation helper",
                      "Unit/dimensional consistency checker",
                      "Paper summarizer",
                      "Simulation result explanation",
                      "Multi-objective optimization (NSGA-II)",
                      "Design pattern recognition"
                    ]
                  },
                  {
                    icon: GitBranch,
                    title: "Collaboration & Version Control",
                    items: [
                      "Project workspace management",
                      "Simulation history tracking",
                      "Git-like branching for simulations",
                      "Commenting & design review system",
                      "Role-based access control",
                      "Full audit trails"
                    ]
                  },
                  {
                    icon: Database,
                    title: "Cloud Infrastructure",
                    items: [
                      "Kubernetes cluster with auto-scaling",
                      "GPU node pool (A100/RTX tier)",
                      "CPU HPC pool with Slurm scheduling",
                      "Object storage for simulation data",
                      "High-speed NVMe scratch space",
                      "PostgreSQL metadata + time-series monitoring"
                    ]
                  }
                ].map((module, idx) => {
                  const Icon = module.icon;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: idx * 0.1 }}
                      viewport={{ once: true }}
                      className="group relative bg-primary/40 border border-aerospace-blue/20 rounded-lg p-6 hover:border-aerospace-accent/50 transition-all duration-300"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 bg-aerospace-accent/15 rounded-lg group-hover:bg-aerospace-accent/25 transition-colors">
                          <Icon className="w-6 h-6 text-aerospace-accent" />
                        </div>
                      </div>
                      <h4 className="font-heading text-lg font-bold text-foreground mb-4 group-hover:text-aerospace-accent transition-colors">
                        {module.title}
                      </h4>
                      <ul className="space-y-2">
                        {module.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-foreground/70">
                            <CheckCircle2 className="w-4 h-4 text-aerospace-accent shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* MVP User Workflow */}
            <div className="mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <h3 className="font-heading text-3xl font-bold text-aerospace-blue mb-2">MVP User Workflow</h3>
                <div className="w-12 h-1 bg-aerospace-accent" />
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { step: "1", label: "Create Workspace", desc: "Set up project with team members" },
                  { step: "2", label: "Upload CAD", desc: "Import geometry files" },
                  { step: "3", label: "Define Physics", desc: "Configure simulation parameters" },
                  { step: "4", label: "Generate Mesh", desc: "Automatic or manual refinement" },
                  { step: "5", label: "Run Simulation", desc: "Execute on cloud infrastructure" },
                  { step: "6", label: "AI Analysis", desc: "Automatic result interpretation" },
                  { step: "7", label: "Optimize", desc: "Multi-objective design optimization" },
                  { step: "8", label: "Share & Export", desc: "Collaborate and download results" }
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.05 }}
                    viewport={{ once: true }}
                    className="relative bg-gradient-to-br from-aerospace-accent/20 to-aerospace-blue/10 border border-aerospace-accent/30 rounded-lg p-6 text-center"
                  >
                    <div className="text-4xl font-bold text-aerospace-accent mb-2">{item.step}</div>
                    <h4 className="font-heading text-lg font-bold text-foreground mb-2">{item.label}</h4>
                    <p className="font-paragraph text-sm text-foreground/70">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Target Users & Monetization */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h3 className="font-heading text-3xl font-bold text-aerospace-blue mb-6">Target Users (MVP)</h3>
                <div className="space-y-4">
                  {[
                    { icon: Rocket, label: "Aerospace Startups", desc: "Building next-gen aircraft and spacecraft" },
                    { icon: Microscope, label: "University Labs", desc: "Research and academic projects" },
                    { icon: Wind, label: "UAV Companies", desc: "Drone design and optimization" },
                    { icon: Sparkles, label: "Satellite Teams", desc: "Small satellite design and analysis" },
                    { icon: Brain, label: "Independent Researchers", desc: "CFD and aerospace researchers" }
                  ].map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div key={idx} className="flex items-start gap-4 p-4 bg-primary/40 border border-aerospace-blue/20 rounded-lg hover:border-aerospace-accent/50 transition-colors">
                        <Icon className="w-5 h-5 text-aerospace-accent shrink-0 mt-1" />
                        <div>
                          <p className="font-heading font-bold text-foreground">{item.label}</p>
                          <p className="font-paragraph text-sm text-foreground/70">{item.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h3 className="font-heading text-3xl font-bold text-aerospace-blue mb-6">MVP Monetization Tiers</h3>
                <div className="space-y-4">
                  {[
                    { tier: "Tier 1", name: "Academic", features: ["Low cost", "Limited GPU hours", "Community support"] },
                    { tier: "Tier 2", name: "Startup", features: ["Pay-per-hour GPU", "Workspace teams", "Priority support"] },
                    { tier: "Tier 3", name: "Pro Engineer", features: ["Monthly subscription", "Compute credits", "Dedicated support"] }
                  ].map((item, idx) => (
                    <div key={idx} className="p-6 bg-gradient-to-r from-aerospace-accent/15 to-aerospace-blue/10 border border-aerospace-accent/30 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-mono text-xs text-aerospace-accent uppercase tracking-widest">{item.tier}</p>
                          <h4 className="font-heading text-xl font-bold text-foreground">{item.name}</h4>
                        </div>
                      </div>
                      <ul className="space-y-2">
                        {item.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-foreground/70">
                            <div className="w-1.5 h-1.5 bg-aerospace-accent rounded-full" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* MVP Differentiation */}
            <div className="mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <h3 className="font-heading text-3xl font-bold text-aerospace-blue mb-2">Why This MVP Wins</h3>
                <div className="w-12 h-1 bg-aerospace-accent" />
              </motion.div>

              <div className="bg-gradient-to-r from-aerospace-accent/10 to-aerospace-blue/10 border border-aerospace-accent/30 rounded-lg p-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    {
                      title: "AI Built-In From Day One",
                      desc: "Not an afterthought. Mesh quality prediction, surrogate models, and convergence monitoring are core features."
                    },
                    {
                      title: "Fully Collaborative",
                      desc: "Real-time multi-user workspace with version control. Teams prefer collaborative CFD over isolated tools."
                    },
                    {
                      title: "Cloud-Native",
                      desc: "No installation pain. No infrastructure investment. Elastic scaling. Simulation version control exists."
                    },
                    {
                      title: "Breaks the Market",
                      desc: "Most CFD tools are local software, expensive enterprise platforms, or non-collaborative. We break that paradigm."
                    }
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Sparkles className="w-5 h-5 text-aerospace-accent shrink-0 mt-1" />
                        <div>
                          <h4 className="font-heading text-lg font-bold text-foreground mb-2">
                            {item.title}
                          </h4>
                          <p className="font-paragraph text-foreground/70">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Development Roadmap */}
            <div className="mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <h3 className="font-heading text-3xl font-bold text-aerospace-blue mb-2">MVP Development Roadmap</h3>
                <div className="w-12 h-1 bg-aerospace-accent" />
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    phase: "Month 1–2",
                    title: "Foundation",
                    items: ["Core backend architecture", "Basic solver integration", "Cloud job system"]
                  },
                  {
                    phase: "Month 3–4",
                    title: "Frontend & Solvers",
                    items: ["Frontend + CAD upload", "Meshing pipeline", "RANS solver working", "Basic rocket module"]
                  },
                  {
                    phase: "Month 5–6",
                    title: "AI & Optimization",
                    items: ["AI copilot integration", "Optimization module", "Collaboration layer"]
                  },
                  {
                    phase: "Month 7–8",
                    title: "Scale & Launch",
                    items: ["GPU scaling", "Performance tuning", "Beta launch"]
                  }
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="relative bg-primary/40 border border-aerospace-blue/20 rounded-lg p-6 hover:border-aerospace-accent/50 transition-all duration-300"
                  >
                    <p className="font-mono text-xs text-aerospace-accent uppercase tracking-widest mb-2">{item.phase}</p>
                    <h4 className="font-heading text-lg font-bold text-foreground mb-4">{item.title}</h4>
                    <ul className="space-y-2">
                      {item.items.map((i, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-foreground/70">
                          <CheckCircle2 className="w-4 h-4 text-aerospace-accent shrink-0 mt-0.5" />
                          <span>{i}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Success Metrics */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <h3 className="font-heading text-3xl font-bold text-aerospace-blue mb-2">MVP Success Metrics</h3>
                <div className="w-12 h-1 bg-aerospace-accent" />
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { metric: "< 30 min", label: "Time from CAD upload to result" },
                  { metric: "> 85%", label: "First simulation success rate" },
                  { metric: "> 60%", label: "User retention after 30 days" },
                  { metric: "10+", label: "Active research labs onboarded" },
                  { metric: "100x", label: "Design exploration acceleration" },
                  { metric: "Zero", label: "Installation friction" }
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.05 }}
                    viewport={{ once: true }}
                    className="relative bg-gradient-to-br from-aerospace-accent/20 to-aerospace-blue/10 border border-aerospace-accent/30 rounded-lg p-6 text-center"
                  >
                    <div className="text-3xl font-bold text-aerospace-accent mb-2">{item.metric}</div>
                    <p className="font-paragraph text-sm text-foreground/70">{item.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ELITE SUITE SECTION */}
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
              className="mb-16"
            >
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-aerospace-accent" />
                <span className="font-mono text-sm uppercase tracking-widest text-aerospace-accent">Revolutionary Features</span>
              </div>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
                Elite Suite
              </h2>
              <p className="font-paragraph text-lg text-secondary-foreground max-w-2xl">
                Industry-leading tools for advanced aerospace engineering, research, and collaboration.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: TrendingUp,
                  title: "Elite Multi-Objective Optimization",
                  desc: "Revolutionary Pareto frontier analysis with NSGA-III algorithm for aerospace design optimization",
                  path: "/elite-multi-objective-optimization",
                  badge: "🏆 Elite"
                },
                {
                  icon: Wind,
                  title: "Turbulence Modeling Research Lab",
                  desc: "Interactive comparison of advanced turbulence models with real-time convergence monitoring",
                  path: "/turbulence-modeling-research-lab",
                  badge: "🌪️ Lab"
                },
                {
                  icon: Layers,
                  title: "Aerospace Design Patterns Library",
                  desc: "Professional wing, fuselage, and landing gear templates for rapid aerospace design",
                  path: "/aerospace-design-patterns-library",
                  badge: "📐 Library"
                },
                {
                  icon: Brain,
                  title: "AI Research Assistant",
                  desc: "Intelligent optimization strategies and research paper discovery powered by AI",
                  path: "/ai-research-assistant",
                  badge: "🤖 AI"
                },
                {
                  icon: Users,
                  title: "Collaborative Workspace",
                  desc: "Team projects, design versioning, and peer review for aerospace engineering",
                  path: "/collaborative-workspace",
                  badge: "👥 Team"
                },
                {
                  icon: Rocket,
                  title: "Advanced CFD Suite",
                  desc: "Production-grade computational fluid dynamics with multi-physics coupling",
                  path: "/advanced-cfd",
                  badge: "⚡ Pro"
                }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="group relative bg-aerospace-dark/50 border border-secondary/20 rounded-lg p-6 hover:border-aerospace-accent/50 transition-all duration-300 flex flex-col"
                  >
                    <div className="absolute top-4 right-4 px-2 py-1 bg-aerospace-accent/20 text-aerospace-accent text-xs font-bold rounded">
                      {item.badge}
                    </div>
                    <div className="p-3 bg-aerospace-accent/10 rounded-lg group-hover:bg-aerospace-accent/20 transition-colors w-fit mb-4">
                      <Icon className="w-6 h-6 text-aerospace-accent" />
                    </div>
                    <h3 className="font-heading text-lg font-bold text-foreground group-hover:text-aerospace-accent transition-colors mb-2">
                      {item.title}
                    </h3>
                    <p className="font-paragraph text-sm text-foreground/70 flex-1 mb-4">
                      {item.desc}
                    </p>
                    <Link
                      to={item.path}
                      className="inline-flex items-center gap-2 text-aerospace-accent hover:text-aerospace-blue transition-colors font-semibold text-sm"
                    >
                      Explore <ArrowRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CASE STUDIES SECTION */}
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
                <Zap className="w-6 h-6 text-aerospace-blue" />
                <span className="font-mono text-sm uppercase tracking-widest text-aerospace-blue">Real-World Impact</span>
              </div>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
                Case Studies
              </h2>
              <p className="font-paragraph text-lg text-secondary-foreground max-w-2xl">
                See how AeroForge AI has transformed engineering workflows across industries.
              </p>
            </motion.div>

            {!isLoading && caseStudies.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {caseStudies.map((study, idx) => (
                  <motion.div
                    key={study._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="group relative bg-primary/50 border border-secondary/20 rounded-lg overflow-hidden hover:border-aerospace-blue/50 transition-all duration-300 flex flex-col"
                  >
                    {study.mainProjectImage && (
                      <div className="relative h-48 overflow-hidden bg-secondary/10">
                        <Image
                          src={study.mainProjectImage}
                          alt={study.projectName || 'Case study'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-6 space-y-4 flex flex-col flex-1">
                      <div>
                        <p className="font-mono text-xs text-aerospace-blue uppercase tracking-widest mb-2">
                          {study.industrySector}
                        </p>
                        <h3 className="font-heading text-xl font-bold text-foreground">
                          {study.projectName}
                        </h3>
                      </div>
                      <p className="font-paragraph text-sm text-foreground/70 flex-1">
                        {study.projectOverview}
                      </p>
                      {(study.performanceImprovement || study.costReduction) && (
                        <div className="flex gap-4 pt-4 border-t border-secondary/20">
                          {study.performanceImprovement && (
                            <div>
                              <p className="font-mono text-xs text-aerospace-success">Performance</p>
                              <p className="font-heading text-lg font-bold text-foreground">+{study.performanceImprovement}%</p>
                            </div>
                          )}
                          {study.costReduction && (
                            <div>
                              <p className="font-mono text-xs text-aerospace-accent">Cost Savings</p>
                              <p className="font-heading text-lg font-bold text-foreground">${study.costReduction}k</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : null}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="mt-12 text-center"
            >
              <Link
                to="/case-studies"
                className="inline-flex items-center justify-center px-8 py-3 bg-aerospace-blue text-white font-semibold rounded-lg hover:bg-aerospace-accent transition-colors duration-300 gap-2"
              >
                View All Case Studies <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* KNOWLEDGE BASE SECTION */}
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
                <Lightbulb className="w-6 h-6 text-aerospace-blue" />
                <span className="font-mono text-sm uppercase tracking-widest text-aerospace-blue">Learning Resources</span>
              </div>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
                Knowledge Base
              </h2>
              <p className="font-paragraph text-lg text-secondary-foreground max-w-2xl">
                Comprehensive guides and technical documentation to master AeroForge AI.
              </p>
            </motion.div>

            {!isLoading && articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article, idx) => (
                  <motion.div
                    key={article._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="group relative bg-aerospace-dark/50 border border-secondary/20 rounded-lg p-6 hover:border-aerospace-blue/50 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <p className="font-mono text-xs text-aerospace-blue uppercase tracking-widest mb-2">
                          {article.category}
                        </p>
                        <h3 className="font-heading text-lg font-bold text-foreground group-hover:text-aerospace-blue transition-colors">
                          {article.title}
                        </h3>
                      </div>
                      <Code2 className="w-5 h-5 text-aerospace-blue/40 shrink-0 ml-2" />
                    </div>
                    <p className="font-paragraph text-sm text-foreground/70 mb-4 line-clamp-2">
                      {article.summary}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-secondary/20">
                      <span className="font-mono text-xs text-secondary-foreground">
                        {article.difficultyLevel}
                      </span>
                      <ChevronRight className="w-4 h-4 text-aerospace-blue/40 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : null}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="mt-12 text-center"
            >
              <Link
                to="/knowledge-base"
                className="inline-flex items-center justify-center px-8 py-3 bg-aerospace-blue text-white font-semibold rounded-lg hover:bg-aerospace-accent transition-colors duration-300 gap-2"
              >
                Explore Knowledge Base <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* COMPILER HIGHLIGHT SECTION */}
        <section className="w-full py-32 bg-aerospace-dark border-t border-secondary/20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <GridBackground />
          </div>
          
          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Terminal className="w-6 h-6 text-aerospace-blue" />
                    <span className="font-mono text-sm uppercase tracking-widest text-aerospace-blue">Parametric Compiler</span>
                  </div>
                  <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
                    From Intent to Geometry
                  </h2>
                  <p className="font-paragraph text-lg text-secondary-foreground">
                    Transform natural language design intent into deterministic, manufacturing-ready parametric CAD geometry with aerospace-grade precision.
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    { icon: CheckCircle2, text: 'Deterministic execution - identical results every time' },
                    { icon: ShieldCheck, text: 'Aerospace-certified validation standards' },
                    { icon: Database, text: 'Full audit trails and design history' },
                    { icon: Cpu, text: 'Cloud reasoning + local computation' }
                  ].map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div key={idx} className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-aerospace-blue shrink-0" />
                        <span className="font-paragraph text-foreground/80">{item.text}</span>
                      </div>
                    );
                  })}
                </div>

                <Link
                  to="/compiler"
                  className="inline-flex items-center justify-center px-10 py-4 bg-aerospace-blue text-white font-mono text-base uppercase tracking-wider hover:bg-aerospace-accent transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 rounded-lg w-fit"
                >
                  Launch Compiler <ChevronRight className="w-4 h-4 ml-2" />
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="relative h-96 hidden lg:block"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-aerospace-blue/10 to-aerospace-accent/10 rounded-lg border border-aerospace-blue/20 overflow-hidden">
                  <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6 p-8">
                    <div className="space-y-2 text-center">
                      <div className="font-mono text-xs text-aerospace-blue/60 uppercase tracking-widest">Compiler Status</div>
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-2 h-2 bg-aerospace-success rounded-full animate-pulse" />
                        <span className="font-mono text-sm text-aerospace-success">Ready</span>
                      </div>
                    </div>
                    <Terminal className="w-24 h-24 text-aerospace-blue/30" />
                    <div className="space-y-1 text-center">
                      <p className="font-mono text-xs text-foreground/40">v1.0.4 • Deterministic Mode</p>
                      <p className="font-mono text-xs text-foreground/40">Zero Latency • Full Audit Trail</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="w-full py-32 bg-primary border-t border-secondary/20">
          <div className="w-full max-w-4xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-aerospace-blue">
                Ready to Revolutionize Your Design Process?
              </h2>
              <p className="font-paragraph text-xl text-foreground/70 max-w-2xl mx-auto">
                Access the deterministic compiler interface. No registration required. Stateless execution. Enterprise-grade precision.
              </p>
              <Link 
                to="/compiler"
                className="inline-flex items-center justify-center px-10 py-5 bg-aerospace-blue text-white font-mono text-base uppercase tracking-wider hover:bg-aerospace-accent transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 rounded-lg"
              >
                Launch Compiler Interface
              </Link>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}

function PhilosophyCard({ item, index }: { item: any; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const Icon = item.icon;

  return (
    <div 
      ref={ref}
      className={`min-h-[50vh] flex flex-col justify-center p-8 md:p-16 lg:p-24 border-b border-secondary/20 transition-colors duration-500 ${isInView ? 'bg-primary/30' : 'bg-transparent'}`}
    >
      <div className={`transition-all duration-700 transform ${isInView ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-aerospace-blue/10 rounded-lg">
            <Icon className="w-6 h-6 text-aerospace-blue" />
          </div>
          <span className="font-mono text-xs text-aerospace-blue uppercase tracking-widest">Principle 0{index + 1}</span>
        </div>
        
        <h3 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
          {item.title}
        </h3>
        
        <p className="font-paragraph text-lg md:text-xl text-foreground/70 leading-relaxed max-w-2xl">
          {item.desc}
        </p>
      </div>
    </div>
  );
}

function ArchitectureNode({ step, index, total }: { step: any; index: number; total: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });

  return (
    <div ref={ref} className="relative flex flex-col items-center z-10">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-primary-foreground/5 border border-aerospace-blue/20 backdrop-blur-sm p-8 text-center relative group hover:border-aerospace-blue/50 transition-colors duration-300 rounded-lg"
      >
        {index !== 0 && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-2 h-2 bg-aerospace-blue rounded-full" />
        )}
        {index !== total - 1 && (
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-2 h-2 bg-aerospace-blue rounded-full" />
        )}

        <h3 className="font-mono text-lg md:text-xl font-bold text-primary-foreground mb-2">
          {step.label}
        </h3>
        
        {step.details && (
          <div className="mt-6 pt-6 border-t border-primary-foreground/10 flex flex-wrap justify-center gap-3">
            {step.details.map((detail: string, i: number) => (
              <span key={i} className="inline-block px-3 py-1 bg-aerospace-blue/10 text-xs font-mono text-aerospace-blue rounded-lg">
                {detail}
              </span>
            ))}
          </div>
        )}
      </motion.div>
      
      {index !== total - 1 && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={isInView ? { height: '4rem', opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-px bg-aerospace-blue/20 my-2 md:hidden" 
        />
      )}
    </div>
  );
}
