// HPI 1.7-G
import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView, useSpring } from 'framer-motion';
import { ArrowDown, Terminal, ShieldCheck, Cpu, Layers, AlertTriangle, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Image } from '@/components/ui/image';

// --- CANONICAL DATA SOURCES ---
// Preserving original content structure exactly as requested.

const HERO_DATA = {
  headline: "Natural Language → Deterministic Parametric CAD",
  subtext: "AeroForge AI is a compiler that converts mechanical design intent into validated, parametric feature plans for deterministic execution.",
  cta: "Launch Compiler"
};

const PHILOSOPHY_DATA = [
  { 
    title: "Deterministic Execution", 
    desc: "Every JSON feature plan produces identical geometry when executed locally, ensuring repeatability and manufacturing safety.",
    icon: CheckCircle2
  },
  { 
    title: "Separation of Concerns", 
    desc: "Cloud reasoning generates validated JSON DSL. Local interpreters execute geometry. No mixing of intelligence and execution.",
    icon: Layers
  },
  { 
    title: "Schema-Enforced Validation", 
    desc: "All outputs conform to strict Pydantic schemas with DFM rule checks before delivery.",
    icon: ShieldCheck
  },
  { 
    title: "Aerospace-Grade Reliability", 
    desc: "No black-box geometry generation. No auto-repair heuristics. Explicit, traceable feature sequences only.",
    icon: Cpu
  },
  { 
    title: "Stateless Architecture", 
    desc: "The frontend is replaceable infrastructure. All intelligence resides in the backend compiler.",
    icon: Terminal
  }
];

const ARCHITECTURE_STEPS = [
  { 
    label: "Natural Language Input", 
    details: null 
  },
  { 
    label: "Cloud Reasoning Layer", 
    details: [
      "FastAPI Backend",
      "AI Intent Analysis",
      "JSON DSL Generation",
      "Pydantic Validation",
      "DFM Rule Checks"
    ]
  },
  { 
    label: "Validated JSON Feature DSL", 
    details: null 
  },
  { 
    label: "Local Deterministic Interpreter", 
    details: [
      "CadQuery / Fusion 360 API",
      "Sequential Execution",
      "No Heuristics"
    ]
  },
  { 
    label: "Parametric CAD Geometry", 
    details: null 
  }
];

const ANTI_GOALS = [
  "No mesh diffusion",
  "No topology optimization",
  "No auto-repair heuristics",
  "No simulation",
  "No black-box geometry",
  "No reinforcement learning"
];

// --- UTILITY COMPONENTS ---

const SectionDivider = () => (
  <div className="w-full h-px bg-secondary/30 my-0" />
);

const GridBackground = () => (
  <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]" 
       style={{ 
         backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', 
         backgroundSize: '40px 40px' 
       }} 
  />
);

// --- MAIN COMPONENT ---

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div ref={containerRef} className="min-h-screen bg-background text-foreground font-paragraph selection:bg-accent selection:text-accent-foreground flex flex-col overflow-clip">
      <Header />

      <main className="flex-1 w-full flex flex-col">
        
        {/* HERO SECTION */}
        <section className="relative w-full min-h-screen flex flex-col justify-center border-b border-secondary/20">
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
                  <div className="w-3 h-3 bg-accent" />
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-secondary-foreground/70">
                    System Ready • v1.0.4
                  </span>
                </motion.div>

                <motion.h1 
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight text-primary"
                >
                  Natural Language <br />
                  <span className="text-secondary-foreground/40">→</span> Deterministic <br />
                  Parametric CAD
                </motion.h1>

                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="font-paragraph text-xl md:text-2xl text-foreground/80 max-w-2xl leading-relaxed border-l-2 border-accent/30 pl-6"
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
                    className="group relative inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-mono text-sm uppercase tracking-wider hover:bg-accent transition-colors duration-300"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {HERO_DATA.cta}
                      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                  <Link 
                    to="/compiler-classic"
                    className="group relative inline-flex items-center justify-center px-8 py-4 bg-transparent border border-primary text-primary font-mono text-sm uppercase tracking-wider hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
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
                <div className="w-full aspect-square border border-secondary/30 relative p-4 flex flex-col justify-between bg-json-background/50 backdrop-blur-sm">
                  <div className="flex justify-between items-start">
                    <Terminal className="w-6 h-6 text-foreground/40" />
                    <span className="font-mono text-[10px] text-foreground/40">AERO_FORGE_KERNEL</span>
                  </div>
                  <div className="space-y-2 font-mono text-xs text-foreground/60">
                    <div className="flex justify-between border-b border-secondary/10 pb-1">
                      <span>STATUS</span>
                      <span className="text-green-600">ONLINE</span>
                    </div>
                    <div className="flex justify-between border-b border-secondary/10 pb-1">
                      <span>LATENCY</span>
                      <span>12ms</span>
                    </div>
                    <div className="flex justify-between border-b border-secondary/10 pb-1">
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

        {/* PHILOSOPHY SECTION - Sticky Layout */}
        <section className="w-full bg-background relative">
          <div className="w-full max-w-[120rem] mx-auto">
            <div className="flex flex-col lg:flex-row">
              
              {/* Sticky Sidebar */}
              <div className="lg:w-1/3 lg:sticky lg:top-0 lg:h-screen flex flex-col justify-center p-8 md:p-16 lg:p-20 border-b lg:border-b-0 lg:border-r border-secondary/20 bg-background z-10">
                <div className="space-y-6">
                  <div className="w-12 h-1 bg-accent mb-8" />
                  <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary leading-tight">
                    Core <br /> Philosophy
                  </h2>
                  <p className="font-paragraph text-lg text-foreground/70 max-w-md">
                    AeroForge AI is built on unshakeable engineering principles. We prioritize determinism over creativity, and validation over heuristics.
                  </p>
                </div>
              </div>

              {/* Scrolling Content */}
              <div className="lg:w-2/3 bg-json-background/30">
                {PHILOSOPHY_DATA.map((item, index) => (
                  <PhilosophyCard key={index} item={item} index={index} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SYSTEM ARCHITECTURE - Vertical Flow */}
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
              {/* Connecting Line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-primary-foreground/20 -translate-x-1/2 hidden md:block" />

              <div className="space-y-16 md:space-y-24">
                {ARCHITECTURE_STEPS.map((step, index) => (
                  <ArchitectureNode key={index} step={step} index={index} total={ARCHITECTURE_STEPS.length} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ANTI-GOALS & CONSTRAINTS - Split Layout */}
        <section className="w-full py-32 bg-background border-t border-secondary/20">
          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32">
              
              {/* Left: The "No" List */}
              <div className="space-y-12">
                <div>
                  <h3 className="font-heading text-3xl font-bold text-primary mb-6">Explicit Anti-Goals</h3>
                  <p className="font-paragraph text-lg text-foreground/70 mb-8">
                    To ensure aerospace-grade reliability, we explicitly reject probabilistic methods.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ANTI_GOALS.map((goal, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-4 border border-destructive/20 bg-destructive/5 rounded-sm">
                      <XCircle className="w-5 h-5 text-destructive shrink-0" />
                      <span className="font-mono text-sm text-foreground/80">{goal}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Visual Context */}
              <div className="relative h-full min-h-[400px] w-full overflow-hidden bg-secondary/10">
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

        {/* FINAL CTA */}
        <section className="w-full py-32 bg-json-background border-t border-secondary/20">
          <div className="w-full max-w-4xl mx-auto px-6 text-center">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-8">
              Ready to Compile?
            </h2>
            <p className="font-paragraph text-xl text-foreground/70 mb-12 max-w-2xl mx-auto">
              Access the deterministic compiler interface. No registration required. Stateless execution.
            </p>
            <Link 
              to="/compiler"
              className="inline-flex items-center justify-center px-10 py-5 bg-primary text-primary-foreground font-mono text-base uppercase tracking-wider hover:bg-accent transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Launch Compiler Interface
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}

// --- SUB-COMPONENTS ---

function PhilosophyCard({ item, index }: { item: any, index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <div 
      ref={ref}
      className={`min-h-[50vh] flex flex-col justify-center p-8 md:p-16 lg:p-24 border-b border-secondary/20 transition-colors duration-500 ${isInView ? 'bg-background' : 'bg-transparent'}`}
    >
      <div className={`transition-all duration-700 transform ${isInView ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-secondary/10 rounded-sm">
            <item.icon className="w-6 h-6 text-primary" />
          </div>
          <span className="font-mono text-xs text-accent uppercase tracking-widest">Principle 0{index + 1}</span>
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

function ArchitectureNode({ step, index, total }: { step: any, index: number, total: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });

  return (
    <div ref={ref} className="relative flex flex-col items-center z-10">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-primary-foreground/5 border border-primary-foreground/10 backdrop-blur-sm p-8 text-center relative group hover:border-accent/50 transition-colors duration-300"
      >
        {/* Node Connector Dots */}
        {index !== 0 && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-2 h-2 bg-accent rounded-full" />
        )}
        {index !== total - 1 && (
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-2 h-2 bg-accent rounded-full" />
        )}

        <h3 className="font-mono text-lg md:text-xl font-bold text-primary-foreground mb-2">
          {step.label}
        </h3>
        
        {step.details && (
          <div className="mt-6 pt-6 border-t border-primary-foreground/10 flex flex-wrap justify-center gap-3">
            {step.details.map((detail: string, i: number) => (
              <span key={i} className="inline-block px-3 py-1 bg-primary-foreground/10 text-xs font-mono text-primary-foreground/80 rounded-sm">
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
          className="w-px bg-accent my-2 md:hidden" 
        />
      )}
    </div>
  );
}