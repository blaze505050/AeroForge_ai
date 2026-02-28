import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { CheckCircle2, Brain, Cloud, Code2, Database, GitBranch, Gauge, Globe, Microscope, Rocket, Sparkles, Wind, Target, Lock, Zap, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const GridBackground = () => (
  <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]" 
       style={{ 
         backgroundImage: 'linear-gradient(#0EA5E9 1px, transparent 1px), linear-gradient(90deg, #0EA5E9 1px, transparent 1px)', 
         backgroundSize: '40px 40px' 
       }} 
  />
);

export default function DigitalAerospaceResearchLabPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="min-h-screen bg-aerospace-dark text-foreground font-paragraph selection:bg-aerospace-blue selection:text-white flex flex-col overflow-clip">
      <Header />

      <main className="flex-1 w-full flex flex-col">
        
        {/* HERO SECTION */}
        <section className="relative w-full min-h-screen flex flex-col justify-center border-b border-secondary/20 bg-aerospace-dark overflow-hidden">
          <GridBackground />
          
          <div className="absolute top-20 right-10 w-96 h-96 bg-aerospace-accent/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-aerospace-blue/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          
          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16 relative z-10 pt-32 pb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-center gap-3 mb-6"
            >
              <Microscope className="w-6 h-6 text-aerospace-accent" />
              <span className="font-mono text-sm uppercase tracking-widest text-aerospace-accent">MVP Platform</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight text-center mb-8"
            >
              <span className="text-aerospace-accent">Digital Aerospace</span> <br />
              <span className="text-foreground">Research Lab</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="font-paragraph text-xl md:text-2xl text-foreground/80 max-w-3xl leading-relaxed text-center mx-auto mb-12"
            >
              The MVP solves ONE high-value problem extremely well: enabling aerospace engineers to upload CAD, generate mesh, run CFD, optimize designs with AI, and collaborate in real-time—all in the cloud.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex justify-center"
            >
              <Link
                to="/research-hub"
                className="inline-flex items-center justify-center px-10 py-5 bg-aerospace-accent text-white font-mono text-sm uppercase tracking-wider hover:bg-aerospace-blue transition-all duration-300 rounded-lg shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                Explore Research Hub <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* 12 CORE LABORATORY MODULES */}
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
              <h2 className="font-heading text-5xl md:text-6xl font-bold text-foreground mb-6">
                12 Core Laboratory <br />
                <span className="text-aerospace-accent">Modules</span>
              </h2>
              <p className="font-paragraph text-xl text-secondary-foreground max-w-3xl mx-auto">
                Complete virtual lab ecosystem covering aerodynamics, propulsion, structures, materials, avionics, and orbital mechanics.
              </p>
            </motion.div>

            {/* 12 Core Laboratory Modules */}
            <div className="space-y-12">
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
          </div>
        </section>

        {/* RESEARCH LAB DIFFERENTIATION */}
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
        </section>

        {/* MVP PHILOSOPHY */}
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
        </section>

        {/* CORE MVP MODULES */}
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
                    className="group relative bg-aerospace-dark/50 border border-secondary/20 rounded-lg p-6 hover:border-aerospace-accent/50 transition-all duration-300"
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
        </section>

        {/* MVP USER WORKFLOW */}
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
        </section>

        {/* TARGET USERS & MONETIZATION */}
        <section className="w-full py-32 bg-primary border-t border-secondary/20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <GridBackground />
          </div>
          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
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
                      <div key={idx} className="flex items-start gap-4 p-4 bg-aerospace-dark/50 border border-aerospace-blue/20 rounded-lg hover:border-aerospace-accent/50 transition-colors">
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
          </div>
        </section>

        {/* MVP DIFFERENTIATION */}
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
        </section>

        {/* DEVELOPMENT ROADMAP */}
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
                  className="relative bg-aerospace-dark/50 border border-aerospace-blue/20 rounded-lg p-6 hover:border-aerospace-accent/50 transition-all duration-300"
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
        </section>

        {/* SUCCESS METRICS */}
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
        </section>

      </main>
      <Footer />
    </div>
  );
}
