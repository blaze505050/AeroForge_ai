import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll } from 'framer-motion';
import { CheckCircle2, Layers, ShieldCheck, Cpu, Terminal, XCircle, ChevronRight, BookOpen, Zap, Code2, Database, Lightbulb, ArrowRight, Rocket, Sparkles, Award, TrendingUp, Brain, Wind, Users, Microscope, Cloud, Gauge, Workflow, Lock, Globe, BarChart3, GitBranch, Target, Play, Wrench, Calculator, Download, Beaker, Navigation, Satellite, Telescope, Eye, Orbit, Radio, Map, Compass, Waves, Thermometer } from 'lucide-react';
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

// Lab Tools Data - All 53+ tools
interface LabTool {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  features: string[];
  color: string;
  path?: string;
  isActive: boolean;
  order: number;
}

const labTools: LabTool[] = [
  // ===== STRUCTURAL ANALYSIS =====
  { id: 'structural-analysis', title: 'Structural Analysis Lab', description: 'Advanced finite element analysis for aerospace structures', icon: <Layers className="w-8 h-8" />, category: 'Advanced Modules', features: ['FEA Solver', 'Stress Analysis', 'Modal Analysis', 'Optimization'], color: 'from-red-500 to-pink-500', isActive: true, order: 1 },
  { id: 'propulsion-systems', title: 'Propulsion Systems Lab', description: 'Comprehensive engine and propulsion analysis', icon: <Rocket className="w-8 h-8" />, category: 'Advanced Modules', features: ['Engine Analysis', 'Thermodynamics', 'Performance Curves', 'Fuel Efficiency'], color: 'from-orange-500 to-red-500', isActive: true, order: 2 },
  { id: 'aerodynamics-lab', title: 'Aerodynamics Lab', description: 'Complete aerodynamic analysis suite with CFD integration', icon: <Wind className="w-8 h-8" />, category: 'Advanced Modules', features: ['Flow Analysis', 'Pressure Distribution', 'Lift & Drag', 'Optimization'], color: 'from-blue-500 to-cyan-500', isActive: true, order: 3 },
  { id: 'materials-lab', title: 'Materials Lab', description: 'Material properties database with mechanical testing', icon: <Beaker className="w-8 h-8" />, category: 'Advanced Modules', features: ['Material Database', 'Properties Analysis', 'Testing', 'Selection Tools'], color: 'from-amber-500 to-yellow-500', isActive: true, order: 4 },
  { id: 'systems-integration', title: 'Systems Integration', description: 'Multi-disciplinary system integration and architecture design', icon: <Workflow className="w-8 h-8" />, category: 'Advanced Modules', features: ['System Architecture', 'Integration Testing', 'Requirements', 'Validation'], color: 'from-purple-500 to-pink-500', isActive: true, order: 5 },
  
  // ===== PRODUCTS =====
  { id: 'case-studies', title: 'Case Studies', description: 'Real-world aerospace projects with detailed analysis', icon: <BarChart3 className="w-8 h-8" />, category: 'Products', features: ['Project Analysis', 'Performance Data', 'Lessons Learned', 'Best Practices'], color: 'from-green-500 to-emerald-500', isActive: true, order: 6 },
  { id: 'aerospace-tools', title: 'Aerospace Tools', description: 'Comprehensive suite of aerospace design and analysis tools', icon: <Wrench className="w-8 h-8" />, category: 'Products', features: ['Design Tools', 'Analysis Suite', 'Calculators', 'Utilities'], color: 'from-slate-600 to-gray-700', isActive: true, order: 7 },
  { id: 'templates', title: 'Templates Hub', description: 'Pre-built aerospace design templates and project frameworks', icon: <GitBranch className="w-8 h-8" />, category: 'Products', features: ['Design Templates', 'Project Frameworks', 'Best Practices', 'Quick Start'], color: 'from-indigo-500 to-blue-600', isActive: true, order: 8 },
  { id: 'cfd-datasets', title: 'CFD Datasets Hub', description: 'Validated CFD simulation datasets with tutorials', icon: <Database className="w-8 h-8" />, category: 'Products', features: ['Validated Data', 'Mesh Tutorials', 'Boundary Conditions', 'Advanced Analysis'], color: 'from-cyan-500 to-blue-500', isActive: true, order: 9 },
  
  // ===== RESEARCH =====
  { id: 'research-hub', title: 'Research Hub', description: 'Central repository for aerospace research papers', icon: <Microscope className="w-8 h-8" />, category: 'Research', features: ['Research Papers', 'Publications', 'Literature', 'Knowledge Base'], color: 'from-violet-500 to-purple-600', isActive: true, order: 10 },
  { id: 'knowledge-base', title: 'Knowledge Base', description: 'Comprehensive documentation and technical knowledge', icon: <Lightbulb className="w-8 h-8" />, category: 'Research', features: ['Documentation', 'Tutorials', 'FAQs', 'Technical Guides'], color: 'from-yellow-500 to-amber-500', isActive: true, order: 11 },
  { id: 'advanced-turbulence-modeling', title: 'Advanced Turbulence Modeling', description: 'Research-grade turbulence modeling with advanced analysis', icon: <Cpu className="w-8 h-8" />, category: 'Research', features: ['RANS Models', 'LES Capabilities', 'Hybrid Methods', 'Research Tools'], color: 'from-orange-500 to-red-500', isActive: true, order: 12 },
  { id: 'multi-objective-optimization', title: 'Multi-Objective Optimization', description: 'Advanced Pareto frontier optimization for complex design', icon: <Target className="w-8 h-8" />, category: 'Research', features: ['Pareto Analysis', 'Multi-objective', 'Design Space', 'Visualization'], color: 'from-pink-500 to-rose-500', isActive: true, order: 13 },
  { id: 'batch-processing', title: 'Batch Processing Engine', description: 'High-performance parallel processing for large-scale simulations', icon: <Workflow className="w-8 h-8" />, category: 'Research', features: ['Parallel Processing', 'Queue Management', 'Result Aggregation', 'Monitoring'], color: 'from-teal-500 to-cyan-500', isActive: true, order: 14 },
  
  // ===== ELITE SUITE =====
  { id: 'elite-multi-objective', title: 'Elite Multi-Objective Optimizer', description: 'Enterprise-grade Pareto frontier optimization', icon: <Target className="w-8 h-8" />, category: 'Elite Suite', features: ['Pareto Frontier', 'Multi-physics', 'Advanced Visualization', 'Enterprise Tools'], color: 'from-fuchsia-500 to-purple-500', isActive: true, order: 15 },
  { id: 'turbulence-modeling-research-lab', title: 'Turbulence Modeling Research Lab', description: 'Elite research environment for advanced turbulence modeling', icon: <Microscope className="w-8 h-8" />, category: 'Elite Suite', features: ['Advanced RANS', 'LES/DES', 'Hybrid Approaches', 'Research Publishing'], color: 'from-indigo-500 to-blue-600', isActive: true, order: 16 },
  { id: 'aerospace-design-patterns', title: 'Aerospace Design Patterns Library', description: 'Enterprise design patterns and best practices', icon: <GitBranch className="w-8 h-8" />, category: 'Elite Suite', features: ['Design Patterns', 'Best Practices', 'Architecture', 'Implementation Guides'], color: 'from-emerald-500 to-teal-500', isActive: true, order: 17 },
  { id: 'ai-research-assistant', title: 'AI Research Assistant', description: 'Intelligent AI-powered assistant for aerospace research', icon: <Brain className="w-8 h-8" />, category: 'Elite Suite', features: ['Natural Language', 'Design Suggestions', 'Literature Search', 'Analysis'], color: 'from-rose-500 to-pink-500', isActive: true, order: 18 },
  { id: 'collaborative-workspace', title: 'Collaborative Workspace', description: 'Enterprise team collaboration platform', icon: <Users className="w-8 h-8" />, category: 'Elite Suite', features: ['Real-time Sync', 'Version Control', 'Comments', 'Permissions'], color: 'from-sky-500 to-blue-500', isActive: true, order: 19 },
  
  // ===== CORE TOOLS =====
  { id: 'airfoil-designer', title: 'Airfoil Design Studio', description: 'Real-time aerodynamic airfoil design with NACA profile generation', icon: <Wind className="w-8 h-8" />, category: 'Core Tools', features: ['NACA Generation', 'Real-time Visualization', 'Geometry Optimization', 'CAD Export'], color: 'from-blue-500 to-cyan-500', isActive: true, order: 20 },
  { id: 'cfd-simulator', title: 'CFD Solver Lab', description: 'Production-grade computational fluid dynamics', icon: <Cpu className="w-8 h-8" />, category: 'Core Tools', features: ['Mesh Generation', 'Solver Configuration', 'Results Visualization', 'Data Export'], color: 'from-purple-500 to-pink-500', isActive: true, order: 21 },
  { id: 'wing-calculator', title: 'Wing Performance Lab', description: 'Advanced wing aerodynamic analysis and performance', icon: <Calculator className="w-8 h-8" />, category: 'Core Tools', features: ['Wing Span Calc', 'Performance Metrics', 'Speed Analysis', 'CSV Export'], color: 'from-amber-500 to-yellow-500', isActive: true, order: 22 },
  { id: 'thrust-calculator', title: 'Engine Thrust Lab', description: 'Comprehensive engine thrust and performance analysis', icon: <Zap className="w-8 h-8" />, category: 'Core Tools', features: ['Jet Engine', 'Piston Engine', 'Power Output', 'Fuel Analysis'], color: 'from-red-500 to-pink-500', isActive: true, order: 23 },
  { id: 'drag-calculator', title: 'Drag Analysis Lab', description: 'Production-grade aerodynamic drag analysis', icon: <Wind className="w-8 h-8" />, category: 'Core Tools', features: ['Drag Components', 'Compressibility', 'Performance', 'CSV Export'], color: 'from-teal-500 to-cyan-500', isActive: true, order: 24 },
  { id: 'airfoil-downloader', title: 'Airfoil Repository', description: 'Comprehensive airfoil database with performance data', icon: <Download className="w-8 h-8" />, category: 'Core Tools', features: ['Natural Search', 'CSV Export', 'Batch Download', 'Performance Curves'], color: 'from-green-500 to-emerald-500', isActive: true, order: 25 },
  { id: 'advanced-cfd', title: 'Advanced CFD Suite', description: 'Elite computational fluid dynamics with convergence monitoring', icon: <Beaker className="w-8 h-8" />, category: 'Core Tools', features: ['Convergence Monitor', 'Advanced Solvers', 'Real-time Monitoring', 'Multi-physics'], color: 'from-violet-500 to-purple-600', isActive: true, order: 26 },
  { id: 'aerospace-suite', title: 'Enterprise Aerospace Suite', description: 'Integrated aerospace design platform with multi-physics', icon: <Rocket className="w-8 h-8" />, category: 'Core Tools', features: ['Multi-physics', 'Structural Analysis', 'Optimization', 'Collaboration'], color: 'from-purple-500 to-pink-500', isActive: true, order: 27 },
  { id: 'mechanical-suite', title: 'Mechanical CAD Suite', description: 'Production-grade mechanical design with parametric modeling', icon: <Wrench className="w-8 h-8" />, category: 'Core Tools', features: ['Parametric Modeling', 'Assembly Sim', 'Manufacturing', 'Material DB'], color: 'from-slate-600 to-gray-700', isActive: true, order: 28 },
  { id: 'digital-research-lab', title: 'Digital Aerospace Lab', description: 'Comprehensive digital research environment', icon: <Lightbulb className="w-8 h-8" />, category: 'Core Tools', features: ['Research Tools', 'Data Analysis', 'Visualization', 'Publishing'], color: 'from-yellow-500 to-amber-500', isActive: true, order: 29 },
  
  // ===== SPECIALIZED LABORATORIES =====
  { id: 'aircraft-uav-design', title: 'Aircraft & UAV Design Studio', description: 'Integrated platform for aircraft and UAV design', icon: <Rocket className="w-8 h-8" />, category: 'Specialized Laboratories', features: ['Aircraft Design', 'UAV Configuration', 'Aerodynamic Optimization', 'Performance Prediction'], color: 'from-sky-500 to-blue-600', isActive: true, order: 30 },
  { id: 'flight-simulator', title: 'Flight Simulation Engine', description: 'High-fidelity flight dynamics simulator', icon: <Navigation className="w-8 h-8" />, category: 'Specialized Laboratories', features: ['Flight Dynamics', 'Control Systems', 'Real-time Simulation', 'Autopilot Testing'], color: 'from-cyan-500 to-blue-500', isActive: true, order: 31 },
  { id: 'virtual-wind-tunnel', title: 'Virtual Wind Tunnel', description: 'Advanced CFD-based wind tunnel for aerodynamic testing', icon: <Wind className="w-8 h-8" />, category: 'Specialized Laboratories', features: ['Flow Visualization', 'Pressure Distribution', 'Force Measurement', 'Parametric Studies'], color: 'from-blue-500 to-indigo-600', isActive: true, order: 32 },
  { id: 'terrain-mission-sim', title: '3D Terrain & Mission Simulator', description: 'Real-time 3D environment for mission planning', icon: <Satellite className="w-8 h-8" />, category: 'Specialized Laboratories', features: ['3D Terrain Rendering', 'Mission Planning', 'Path Optimization', 'Real-time Visualization'], color: 'from-green-500 to-emerald-600', isActive: true, order: 33 },
  { id: 'digital-twin-lab', title: 'Digital Twin Laboratory', description: 'Real-time digital twins for rotating machinery', icon: <Database className="w-8 h-8" />, category: 'Specialized Laboratories', features: ['Real-time Telemetry', 'Condition Monitoring', 'Predictive Maintenance', 'Performance Analytics'], color: 'from-purple-500 to-pink-500', isActive: true, order: 34 },
  { id: 'plc-dcs-testing', title: 'PLC/DCS Testing Platform', description: 'Comprehensive platform for PLC and DCS testing', icon: <Cpu className="w-8 h-8" />, category: 'Specialized Laboratories', features: ['PLC Simulation', 'DCS Integration', 'Logic Testing', 'Safety Validation'], color: 'from-orange-500 to-red-500', isActive: true, order: 35 },
  { id: 'hvac-systems-lab', title: 'HVAC Systems Laboratory', description: 'Advanced simulation for HVAC system design', icon: <Thermometer className="w-8 h-8" />, category: 'Specialized Laboratories', features: ['Thermal Analysis', 'Flow Simulation', 'System Optimization', 'Energy Efficiency'], color: 'from-blue-500 to-cyan-500', isActive: true, order: 36 },
  { id: 'multibody-dynamics', title: 'Multibody Dynamics Engine', description: 'Real-time simulation of complex mechanical systems', icon: <Layers className="w-8 h-8" />, category: 'Specialized Laboratories', features: ['Rigid Body Dynamics', 'Constraint Solving', 'Contact Detection', 'Real-time Visualization'], color: 'from-red-500 to-pink-500', isActive: true, order: 37 },
  { id: 'hydraulics-powertrain', title: 'Hydraulics & Powertrain Simulator', description: 'Advanced simulation for hydraulic systems', icon: <Zap className="w-8 h-8" />, category: 'Specialized Laboratories', features: ['Hydraulic Modeling', 'Powertrain Analysis', 'Fluid Dynamics', 'System Integration'], color: 'from-yellow-500 to-amber-500', isActive: true, order: 38 },
  { id: 'robotics-lab', title: 'Robotics & Automation Lab', description: 'Comprehensive platform for robot design and control', icon: <Wrench className="w-8 h-8" />, category: 'Specialized Laboratories', features: ['Robot Kinematics', 'Dynamics Simulation', 'Path Planning', 'Control Development'], color: 'from-indigo-500 to-purple-600', isActive: true, order: 39 },
  { id: 'digital-thread-hub', title: 'Digital Thread Management Hub', description: 'Unified platform for managing digital thread', icon: <GitBranch className="w-8 h-8" />, category: 'Specialized Laboratories', features: ['Lifecycle Management', 'Data Integration', 'Version Control', 'Traceability'], color: 'from-teal-500 to-cyan-600', isActive: true, order: 40 },
  { id: 'industry-4-0-lab', title: 'Industry 4.0 Smart Manufacturing', description: 'Advanced platform for smart manufacturing', icon: <TrendingUp className="w-8 h-8" />, category: 'Specialized Laboratories', features: ['IoT Integration', 'Real-time Monitoring', 'Predictive Analytics', 'Process Optimization'], color: 'from-green-500 to-emerald-600', isActive: true, order: 41 },
  { id: 'vr-ar-engineering', title: 'VR/AR Engineering Environment', description: 'Immersive virtual and augmented reality platform', icon: <Lightbulb className="w-8 h-8" />, category: 'Specialized Laboratories', features: ['VR Visualization', 'AR Overlay', 'Assembly Simulation', 'Training Modules'], color: 'from-pink-500 to-rose-600', isActive: true, order: 42 },
  { id: 'mechanism-design-studio', title: 'Mechanism Design Studio', description: 'Advanced CAD-based platform for mechanism design', icon: <Wrench className="w-8 h-8" />, category: 'Specialized Laboratories', features: ['Mechanism Synthesis', 'Kinematics Analysis', 'Motion Simulation', 'Optimization'], color: 'from-slate-600 to-gray-700', isActive: true, order: 43 },
  { id: 'kinematics-solver', title: 'Advanced Kinematics Solver', description: 'Comprehensive kinematics and inverse kinematics solver', icon: <Calculator className="w-8 h-8" />, category: 'Specialized Laboratories', features: ['Forward Kinematics', 'Inverse Kinematics', 'Trajectory Planning', 'Singularity Analysis'], color: 'from-amber-500 to-yellow-600', isActive: true, order: 44 },
  { id: 'digital-human-modeling', title: 'Digital Human Modeling Lab', description: 'Ergonomic analysis and digital human modeling', icon: <Users className="w-8 h-8" />, category: 'Specialized Laboratories', features: ['Ergonomic Analysis', 'Posture Simulation', 'Reach Analysis', 'Comfort Assessment'], color: 'from-rose-500 to-pink-600', isActive: true, order: 45 },
  
  // ===== ASTROLAB =====
  { id: 'spatial-intelligence-globe', title: 'Spatial Intelligence & 3D Globe Engine', description: 'Real-time 3D geospatial visualization with satellite propagation', icon: <Globe className="w-8 h-8" />, category: 'AstroLab', features: ['CesiumJS Renderer', 'SGP4 Satellite Propagator', 'Real-time Ephemeris', 'Spatial Filtering'], color: 'from-indigo-500 to-purple-600', isActive: true, order: 46 },
  { id: 'deep-space-observation', title: 'Deep-Space Observation & Mapping', description: 'Advanced astronomical survey visualization', icon: <Telescope className="w-8 h-8" />, category: 'AstroLab', features: ['Aladin Lite Engine', 'Pan-STARRS/DSS Surveys', 'Coordinate Targeting', 'Multi-Spectral Overlays'], color: 'from-blue-600 to-indigo-700', isActive: true, order: 47 },
  { id: 'professional-photometry-suite', title: 'Professional Analytical & Photometry Suite', description: 'FITS image analysis with photometry tools', icon: <Eye className="w-8 h-8" />, category: 'AstroLab', features: ['JS9 Web FITS Analyzer', 'ROI Photometry', 'NASA HEASARC Bridge', 'Image Processing'], color: 'from-cyan-500 to-blue-600', isActive: true, order: 48 },
  { id: 'astrodynamics-sandbox', title: 'Astrodynamics & Physics Simulation Sandbox', description: 'Interactive orbital mechanics with N-Body gravity simulation', icon: <Orbit className="w-8 h-8" />, category: 'AstroLab', features: ['Pyodide Python Engine', 'N-Body Gravity Simulation', 'Mission Planner', 'Delta-V Calculator'], color: 'from-purple-500 to-pink-600', isActive: true, order: 49 },
  { id: 'astrolab-dual-mode-ux', title: 'AstroLab Dual-Mode Experience', description: 'Seamless switching between Student and Professional modes', icon: <Radio className="w-8 h-8" />, category: 'AstroLab', features: ['Student Mode', 'Professional Mode', 'Guided Tours', 'Advanced Telemetry'], color: 'from-pink-500 to-rose-600', isActive: true, order: 50 },
  { id: 'satellite-constellation-mapper', title: 'Satellite Constellation Mapper', description: 'Real-time mapping of LEO, MEO, GEO satellites', icon: <Satellite className="w-8 h-8" />, category: 'AstroLab', features: ['LEO/MEO/GEO Tracking', 'Debris Detection', 'Collision Avoidance', 'TLE Updates'], color: 'from-green-500 to-emerald-600', isActive: true, order: 51 },
  { id: 'celestial-coordinate-system', title: 'Celestial Coordinate System & Ephemeris', description: 'Advanced coordinate transformations and ephemeris data', icon: <Compass className="w-8 h-8" />, category: 'AstroLab', features: ['RA/Dec Conversions', 'Ephemeris Calculations', 'CelesTrak Integration', 'JPL Data Pipeline'], color: 'from-yellow-500 to-amber-600', isActive: true, order: 52 },
  { id: 'orbital-mechanics-calculator', title: 'Orbital Mechanics Calculator', description: 'Comprehensive orbital element calculations', icon: <Waves className="w-8 h-8" />, category: 'AstroLab', features: ['Kepler Elements', 'Trajectory Analysis', 'Orbital Decay', 'Perturbation Analysis'], color: 'from-red-500 to-orange-600', isActive: true, order: 53 },
];

labTools.sort((a, b) => a.order - b.order);

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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);
  const [activeCount, setActiveCount] = useState(0);

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

  useEffect(() => {
    setActiveCount(labTools.filter(t => t.isActive).length);
  }, []);

  const categoryOrder = [
    'Elite Suite',
    'Products',
    'Advanced Modules',
    'Research',
    'Core Tools',
    'Specialized Laboratories',
    'AstroLab'
  ];
  
  const categories = categoryOrder.filter(cat => 
    labTools.some(t => t.category === cat)
  );
  
  const filteredTools = selectedCategory 
    ? labTools.filter(t => t.category === selectedCategory)
    : labTools;

  const handleToolClick = (tool: LabTool) => {
    // Map tool IDs to their routes
    const toolRoutes: { [key: string]: string } = {
      'spatial-intelligence-globe': '/astrolab/spatial-globe',
      'deep-space-observation': '/astrolab/deep-space-observation',
      'professional-photometry-suite': '/astrolab/photometry-suite',
      'astrodynamics-sandbox': '/astrolab/astrodynamics-sandbox',
      'astrolab-dual-mode-ux': '/astrolab/dual-mode',
      'satellite-constellation-mapper': '/astrolab/satellite-constellation',
      'celestial-coordinate-system': '/astrolab/celestial-coordinate',
      'orbital-mechanics-calculator': '/astrolab/orbital-mechanics',
    };

    const route = toolRoutes[tool.id];
    if (route) {
      navigate(route);
    }
  };

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
                    to="/professional-interactive-lab"
                    className="group relative inline-flex items-center justify-center px-10 py-5 bg-aerospace-blue text-white font-mono text-sm uppercase tracking-wider hover:bg-aerospace-accent transition-all duration-300 rounded-lg shadow-xl hover:shadow-2xl hover:-translate-y-1"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Professional Lab
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

        {/* INTEGRATED VIRTUAL LAB - ALL 53+ TOOLS */}
        <section className="w-full py-32 bg-aerospace-dark border-t border-secondary/20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-aerospace-blue rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-aerospace-accent rounded-full blur-3xl" />
          </div>

          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16 relative z-10">
            {/* Header */}
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
                  Complete Engineering Ecosystem
                </span>
                <Sparkles className="w-6 h-6 text-aerospace-blue animate-pulse" />
              </div>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
                {activeCount}+ Integrated Research Tools
              </h2>
              <p className="font-paragraph text-xl text-secondary-foreground max-w-3xl mx-auto mb-8">
                Aerospace, mechanical, and astronomical research all in one unified platform. Explore all tools directly on the homepage.
              </p>
            </motion.div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-6 py-2 rounded-lg font-paragraph font-medium transition-all ${
                  selectedCategory === null
                    ? 'bg-aerospace-blue text-white'
                    : 'bg-primary/40 text-foreground/70 hover:bg-primary/60'
                }`}
              >
                All Tools ({labTools.length})
              </button>
              {categories.map(cat => {
                const count = labTools.filter(t => t.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-6 py-2 rounded-lg font-paragraph font-medium transition-all ${
                      selectedCategory === cat
                        ? 'bg-aerospace-blue text-white'
                        : 'bg-primary/40 text-foreground/70 hover:bg-primary/60'
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>

            {/* Tools Grid */}
            {!selectedCategory ? (
              // Show all tools organized by category
              <div className="space-y-16">
                {categories.map((category) => {
                  const categoryTools = labTools.filter(t => t.category === category);
                  return (
                    <motion.div
                      key={category}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      viewport={{ once: true }}
                    >
                      {/* Category Header */}
                      <div className="mb-8">
                        <h3 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
                          {category}
                        </h3>
                        <div className="h-1 w-20 bg-gradient-to-r from-aerospace-blue to-aerospace-accent rounded-full" />
                        <p className="text-secondary-foreground mt-3 text-lg">
                          {category === 'Advanced Modules' && 'Specialized aerospace analysis and design modules'}
                          {category === 'Products' && 'Production-ready tools and resources'}
                          {category === 'Research' && 'Advanced research and development tools'}
                          {category === 'Elite Suite' && 'Enterprise-grade optimization and collaboration'}
                          {category === 'Core Tools' && 'Essential aerospace design and simulation tools'}
                          {category === 'Specialized Laboratories' && 'World-class virtual engineering labs'}
                          {category === 'AstroLab' && 'Advanced astronomical and space research tools'}
                        </p>
                      </div>
                      
                      {/* Tools Grid for this category */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categoryTools.map((tool) => (
                          <motion.div
                            key={tool.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            onMouseEnter={() => setHoveredTool(tool.id)}
                            onMouseLeave={() => setHoveredTool(null)}
                            className="group cursor-pointer"
                          >
                            <div className="relative h-full bg-gradient-to-br from-aerospace-dark/60 to-aerospace-dark/40 border border-aerospace-blue/20 rounded-lg p-6 hover:border-aerospace-blue/60 hover:from-aerospace-dark/80 hover:to-aerospace-dark/60 transition-all duration-300 shadow-lg hover:shadow-xl flex flex-col">
                              {/* Status Badge */}
                              <div className="absolute top-4 right-4 z-10">
                                <div className="flex items-center gap-2 bg-aerospace-dark/80 backdrop-blur-sm px-3 py-1 rounded-full border border-aerospace-success/50">
                                  <div className="w-2 h-2 bg-aerospace-success rounded-full animate-pulse" />
                                  <span className="text-xs font-mono text-aerospace-success">Active</span>
                                </div>
                              </div>

                              {/* Icon */}
                              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${tool.color} p-2 mb-4 flex items-center justify-center text-white`}>
                                {tool.icon}
                              </div>

                              {/* Title and description */}
                              <h4 className="font-heading text-lg font-bold text-foreground mb-2 group-hover:text-aerospace-blue transition-colors">
                                {tool.title}
                              </h4>
                              <p className="font-paragraph text-sm text-foreground/70 mb-4 flex-grow">
                                {tool.description}
                              </p>

                              {/* Features */}
                              <div className="mb-4">
                                <ul className="space-y-1">
                                  {tool.features.slice(0, 2).map((feature, i) => (
                                    <li key={i} className="font-paragraph text-xs text-foreground/60 flex items-start">
                                      <span className="inline-block w-1 h-1 rounded-full bg-aerospace-blue mr-2 mt-1.5 flex-shrink-0" />
                                      {feature}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Button */}
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleToolClick(tool)}
                                className={`w-full py-2 rounded-lg font-paragraph font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                                  hoveredTool === tool.id
                                    ? `bg-gradient-to-r ${tool.color} text-white`
                                    : 'bg-aerospace-blue/20 text-aerospace-blue hover:bg-aerospace-blue/30'
                                }`}
                              >
                                <Play className="w-3 h-3" />
                                Launch
                              </motion.button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              // Show filtered category
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTools.map((tool) => (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    onMouseEnter={() => setHoveredTool(tool.id)}
                    onMouseLeave={() => setHoveredTool(null)}
                    className="group cursor-pointer"
                  >
                    <div className="relative h-full bg-gradient-to-br from-aerospace-dark/60 to-aerospace-dark/40 border border-aerospace-blue/20 rounded-lg p-6 hover:border-aerospace-blue/60 hover:from-aerospace-dark/80 hover:to-aerospace-dark/60 transition-all duration-300 shadow-lg hover:shadow-xl flex flex-col">
                      {/* Status Badge */}
                      <div className="absolute top-4 right-4 z-10">
                        <div className="flex items-center gap-2 bg-aerospace-dark/80 backdrop-blur-sm px-3 py-1 rounded-full border border-aerospace-success/50">
                          <div className="w-2 h-2 bg-aerospace-success rounded-full animate-pulse" />
                          <span className="text-xs font-mono text-aerospace-success">Active</span>
                        </div>
                      </div>

                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${tool.color} p-2 mb-4 flex items-center justify-center text-white`}>
                        {tool.icon}
                      </div>

                      {/* Title and description */}
                      <h4 className="font-heading text-lg font-bold text-foreground mb-2 group-hover:text-aerospace-blue transition-colors">
                        {tool.title}
                      </h4>
                      <p className="font-paragraph text-sm text-foreground/70 mb-4 flex-grow">
                        {tool.description}
                      </p>

                      {/* Features */}
                      <div className="mb-4">
                        <ul className="space-y-1">
                          {tool.features.slice(0, 2).map((feature, i) => (
                            <li key={i} className="font-paragraph text-xs text-foreground/60 flex items-start">
                              <span className="inline-block w-1 h-1 rounded-full bg-aerospace-blue mr-2 mt-1.5 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Button */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleToolClick(tool)}
                        className={`w-full py-2 rounded-lg font-paragraph font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                          hoveredTool === tool.id
                            ? `bg-gradient-to-r ${tool.color} text-white`
                            : 'bg-aerospace-blue/20 text-aerospace-blue hover:bg-aerospace-blue/30'
                        }`}
                      >
                        <Play className="w-3 h-3" />
                        Launch
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* CTA */}
            <div className="text-center mt-16">
              <Link
                to="/virtual-lab"
                className="group relative inline-flex items-center justify-center px-12 py-6 bg-gradient-to-r from-aerospace-blue to-aerospace-accent text-white font-mono text-sm uppercase tracking-wider hover:shadow-2xl transition-all duration-300 rounded-lg shadow-xl hover:-translate-y-1"
              >
                <span className="relative z-10 flex items-center gap-2">
                  View Full Virtual Lab
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* RESEARCH VIRTUAL LAB SECTION */}
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
                  Research Virtual Lab
                </span>
                <Sparkles className="w-6 h-6 text-aerospace-blue animate-pulse" />
              </div>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
                Advanced Research Capabilities
              </h2>
              <p className="font-paragraph text-xl text-secondary-foreground max-w-3xl mx-auto mb-8">
                Comprehensive research environment with 53+ integrated tools for aerospace, mechanical, and astronomical research. All tools are physics-validated and production-ready.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Tools', value: activeCount, icon: Microscope },
                { label: 'Categories', value: categories.length, icon: Layers },
                { label: 'Research Modules', value: '15+', icon: Brain },
                { label: 'Uptime', value: '99.9%', icon: Gauge }
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-aerospace-dark/50 border border-aerospace-blue/20 rounded-lg p-6 hover:border-aerospace-blue/60 transition-all duration-300 text-center"
                  >
                    <Icon className="w-8 h-8 text-aerospace-blue mx-auto mb-3" />
                    <div className="text-3xl font-bold text-aerospace-blue mb-2">{stat.value}</div>
                    <div className="text-sm text-foreground/70">{stat.label}</div>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-12 text-center">
              <Link
                to="/virtual-lab"
                className="group relative inline-flex items-center justify-center px-12 py-6 bg-gradient-to-r from-aerospace-blue to-aerospace-accent text-white font-mono text-sm uppercase tracking-wider hover:shadow-2xl transition-all duration-300 rounded-lg shadow-xl hover:-translate-y-1"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Explore Full Virtual Lab
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
