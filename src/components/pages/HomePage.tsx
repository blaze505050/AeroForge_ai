// HPI 1.7-G - Phase 1 Enhanced
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useInView } from 'framer-motion';
import { CheckCircle2, Layers, ShieldCheck, Cpu, Terminal, XCircle, ChevronRight, BookOpen } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Image } from '@/components/ui/image';

const HERO_DATA = {
  headline: "Precision CAD from Intent",
  subtext: "Enterprise-grade parametric design compiler with aerospace-certified determinism. Transform design intent into validated, manufacturing-ready geometry.",
  cta: "Start Designing"
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

  return (
    <div ref={containerRef} className="min-h-screen bg-aerospace-dark text-foreground font-paragraph selection:bg-aerospace-blue selection:text-white flex flex-col overflow-clip">
      <Header />

      <main className="flex-1 w-full flex flex-col">
        
        {/* HERO SECTION */}
        <section className="relative w-full min-h-screen flex flex-col justify-center border-b border-secondary/20 bg-aerospace-dark">
          <GridBackground />
          
          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16 relative z-10 pt-32 pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-end">
              
              {/* Left Column: Typography */}
              <div className="lg:col-span-8 flex flex-col gap-8">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="flex items-center gap-3"
                >
                  <div className="w-3 h-3 bg-aerospace-blue" />
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-secondary-foreground/70">
                    System Ready • v1.0.4
                  </span>
                </motion.div>

                <motion.h1 
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight text-aerospace-blue"
                >
                  Natural Language <br />
                  <span className="text-secondary-foreground/40">→</span> Deterministic <br />
                  Parametric CAD
                </motion.h1>

                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="font-paragraph text-xl md:text-2xl text-foreground/80 max-w-2xl leading-relaxed border-l-2 border-aerospace-blue/30 pl-6"
                >
                  {HERO_DATA.subtext}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="pt-8 flex gap-4"
                >
                  <Link 
                    to="/compiler"
                    className="group relative inline-flex items-center justify-center px-8 py-4 bg-aerospace-blue text-white font-mono text-sm uppercase tracking-wider hover:bg-aerospace-accent transition-colors duration-300 rounded-lg shadow-lg hover:shadow-xl"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {HERO_DATA.cta}
                      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                  <Link 
                    to="/compiler-classic"
                    className="group relative inline-flex items-center justify-center px-8 py-4 bg-transparent border border-aerospace-blue text-aerospace-blue font-mono text-sm uppercase tracking-wider hover:bg-aerospace-blue hover:text-white transition-colors duration-300 rounded-lg"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Classic View
                      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </motion.div>
              </div>

              {/* Right Column: Technical Visual */}
              <div className="lg:col-span-4 hidden lg:flex flex-col justify-end items-end opacity-60">
                <div className="w-full aspect-square border border-aerospace-blue/30 relative p-4 flex flex-col justify-between bg-aerospace-dark/50 backdrop-blur-sm rounded-lg">
                  <div className="flex justify-between items-start">
                    <Terminal className="w-6 h-6 text-aerospace-blue/60" />
                    <span className="font-mono text-[10px] text-aerospace-blue/40">AERO_FORGE_KERNEL</span>
                  </div>
                  <div className="space-y-2 font-mono text-xs text-aerospace-blue/60">
                    <div className="flex justify-between border-b border-aerospace-blue/10 pb-1">
                      <span>STATUS</span>
                      <span className="text-aerospace-success">ONLINE</span>
                    </div>
                    <div className="flex justify-between border-b border-aerospace-blue/10 pb-1">
                      <span>LATENCY</span>
                      <span>12ms</span>
                    </div>
                    <div className="flex justify-between border-b border-aerospace-blue/10 pb-1">
                      <span>MODE</span>
                      <span>STRICT</span>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span>BUILD</span>
                      <span>STABLE</span>
                    </div>
                  </div>
                </div>
              </div>
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

        {/* TOOLS CTA SECTION */}
        <section className="w-full py-20 bg-primary border-t border-secondary/20">
          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-aerospace-blue" />
                  <span className="font-mono text-sm uppercase tracking-widest text-aerospace-blue">Documentation</span>
                </div>
                <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground">
                  Explore All Tools
                </h2>
                <p className="font-paragraph text-lg text-secondary-foreground max-w-xl">
                  Learn about each aerospace calculator, simulator, and design tool. Understand the physics models, controls, and outputs.
                </p>
                <Link
                  to="/about-tools"
                  className="inline-flex items-center justify-center px-8 py-3 bg-aerospace-blue text-white font-semibold rounded-lg hover:bg-aerospace-accent transition-colors duration-300 gap-2 w-fit"
                >
                  View Tool Guide <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="hidden lg:block relative h-96 bg-aerospace-dark/50 rounded-lg border border-aerospace-blue/20 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Terminal className="w-16 h-16 text-aerospace-blue/40 mx-auto" />
                    <p className="font-mono text-sm text-foreground/40">Industry-Grade Tools</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="w-full py-32 bg-aerospace-dark border-t border-secondary/20">
          <div className="w-full max-w-4xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-aerospace-blue">
                Ready to Compile?
              </h2>
              <p className="font-paragraph text-xl text-foreground/70 max-w-2xl mx-auto">
                Access the deterministic compiler interface. No registration required. Stateless execution.
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
