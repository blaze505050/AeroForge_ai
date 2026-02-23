import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Wind, Zap, Calculator, Gauge, Layers, BookOpen, 
  ArrowRight, Info, Cpu, Database 
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';

const TOOLS_DATA = [
  {
    id: 'wing-calculator',
    title: 'Wing Calculator',
    icon: Wind,
    shortDesc: 'Wing performance & aerodynamic metrics',
    fullDesc: 'Calculate wing span, chord, loading, and aerodynamic characteristics. Uses industry-standard lift coefficient models and Reynolds number analysis for accurate performance prediction.',
    controls: [
      { name: 'Wing Area', desc: 'Reference wing surface area (m²)', range: '50-500 m²' },
      { name: 'Aspect Ratio', desc: 'Wing span to mean chord ratio', range: '2-15' },
      { name: 'Aircraft Weight', desc: 'Total aircraft mass (kg)', range: '1,000-500,000 kg' },
      { name: 'Velocity', desc: 'Flight speed (m/s)', range: '10-300 m/s' },
      { name: 'Air Density', desc: 'Atmospheric density (kg/m³)', range: '0.5-1.5 kg/m³' }
    ],
    outputs: [
      { name: 'Wing Span', unit: 'm', desc: 'Calculated from area and aspect ratio' },
      { name: 'Mean Chord', unit: 'm', desc: 'Average wing chord length' },
      { name: 'Wing Loading', unit: 'kg/m²', desc: 'Weight per unit wing area' },
      { name: 'Stall Speed', unit: 'm/s', desc: 'Minimum flight speed (Cl_max = 1.3)' },
      { name: 'Max Speed', unit: 'm/s', desc: 'Maximum achievable velocity' }
    ],
    physics: 'Uses Cl_max = 1.3 for typical aircraft, Oswald efficiency factor 0.95, and dynamic pressure calculations per NACA standards.',
    link: '/wing-calculator'
  },
  {
    id: 'thrust-calculator',
    title: 'Thrust Calculator',
    icon: Zap,
    shortDesc: 'Engine thrust & power output analysis',
    fullDesc: 'Analyze jet and piston engine performance. Calculate thrust-to-weight ratio, specific thrust, and power output with combustion efficiency factors.',
    controls: [
      { name: 'Engine Type', desc: 'Jet or Piston engine', range: 'Jet / Piston' },
      { name: 'Fuel Flow', desc: 'Mass flow rate (kg/s)', range: '0.1-10 kg/s' },
      { name: 'Exhaust Velocity', desc: 'Jet exhaust speed (m/s)', range: '500-5000 m/s' },
      { name: 'Propeller Diameter', desc: 'Rotor diameter (m)', range: '1-8 m' },
      { name: 'RPM', desc: 'Engine rotational speed', range: '500-10,000 RPM' },
      { name: 'Aircraft Weight', desc: 'Total mass (kg)', range: '1,000-500,000 kg' }
    ],
    outputs: [
      { name: 'Thrust Generated', unit: 'N', desc: 'Total engine thrust' },
      { name: 'Thrust-to-Weight', unit: 'ratio', desc: 'T/W ratio for performance' },
      { name: 'Power Output', unit: 'W', desc: 'Mechanical power generated' },
      { name: 'Propeller Tip Speed', unit: 'm/s', desc: 'Blade tip velocity' },
      { name: 'Fuel Consumption', unit: 'kg/h', desc: 'Hourly fuel burn rate' }
    ],
    physics: 'Jet: F = ṁ × Ve × ηc (95% combustion efficiency). Piston: F = (ρ × A × V² × Ct × ηp) / 2 with 82% propeller efficiency.',
    link: '/thrust-calculator'
  },
  {
    id: 'drag-calculator',
    title: 'Drag Calculator',
    icon: Wind,
    shortDesc: 'Aerodynamic drag component analysis',
    fullDesc: 'Decompose total drag into skin friction, pressure, and induced components. Includes Mach number compressibility effects and Reynolds number corrections.',
    controls: [
      { name: 'Reference Area', desc: 'Wing reference area (m²)', range: '50-500 m²' },
      { name: 'Velocity', desc: 'Flight speed (m/s)', range: '10-300 m/s' },
      { name: 'Drag Coefficient', desc: 'Total Cd', range: '0.01-0.1' },
      { name: 'Mach Number', desc: 'Speed of sound ratio', range: '0.1-2.0' },
      { name: 'Reynolds Number', desc: 'Flow regime indicator', range: '1M-500M' },
      { name: 'Surface Roughness', desc: 'Smooth or rough surface', range: 'Smooth / Rough' }
    ],
    outputs: [
      { name: 'Dynamic Pressure', unit: 'Pa', desc: 'q = 0.5 × ρ × V²' },
      { name: 'Drag Force', unit: 'N', desc: 'Total aerodynamic drag' },
      { name: 'Skin Friction Drag', unit: 'N', desc: 'Viscous surface drag' },
      { name: 'Pressure Drag', unit: 'N', desc: 'Form drag component' },
      { name: 'Induced Drag', unit: 'N', desc: 'Lift-induced drag' }
    ],
    physics: 'Blasius equation for skin friction (Cf = 0.074/Re^0.2), Prandtl-Mach correction for compressibility, Reynolds effects on turbulent flow.',
    link: '/drag-calculator'
  },
  {
    id: 'airfoil-designer',
    title: 'Airfoil Designer',
    icon: Layers,
    shortDesc: 'Custom airfoil profile generation',
    fullDesc: 'Design and analyze custom airfoil sections. Modify thickness, camber, and leading edge radius with real-time visualization.',
    controls: [
      { name: 'Maximum Thickness', desc: 'Airfoil thickness (%)', range: '5-25%' },
      { name: 'Maximum Camber', desc: 'Camber amount (%)', range: '0-10%' },
      { name: 'Camber Position', desc: 'Location of max camber', range: '20-50% chord' },
      { name: 'Leading Edge Radius', desc: 'LE radius (% chord)', range: '0.5-5%' },
      { name: 'Trailing Edge Angle', desc: 'TE angle (degrees)', range: '0-20°' }
    ],
    outputs: [
      { name: 'Coordinates', unit: 'array', desc: 'Upper/lower surface points' },
      { name: 'Area', unit: 'units²', desc: 'Enclosed profile area' },
      { name: 'Thickness Distribution', unit: 'array', desc: 'Thickness along chord' },
      { name: 'Camber Line', unit: 'array', desc: 'Mean camber line' }
    ],
    physics: 'NACA 4-digit series parameterization with smooth spline interpolation. Generates coordinates suitable for CFD analysis.',
    link: '/airfoil-designer'
  },
  {
    id: 'cfd-simulator',
    title: 'CFD Simulator',
    icon: Cpu,
    shortDesc: 'Computational fluid dynamics analysis',
    fullDesc: 'Run simplified CFD simulations on airfoil sections. Visualize pressure fields and flow patterns around aerodynamic bodies.',
    controls: [
      { name: 'Angle of Attack', desc: 'AoA (degrees)', range: '-10 to +20°' },
      { name: 'Mach Number', desc: 'Flow speed ratio', range: '0.1-2.0' },
      { name: 'Reynolds Number', desc: 'Flow regime', range: '1M-500M' },
      { name: 'Grid Resolution', desc: 'Mesh density', range: 'Coarse / Medium / Fine' },
      { name: 'Simulation Time', desc: 'Convergence iterations', range: '100-10,000' }
    ],
    outputs: [
      { name: 'Pressure Coefficient', unit: 'Cp', desc: 'Pressure distribution' },
      { name: 'Lift Coefficient', unit: 'Cl', desc: 'Aerodynamic lift' },
      { name: 'Drag Coefficient', unit: 'Cd', desc: 'Aerodynamic drag' },
      { name: 'Moment Coefficient', unit: 'Cm', desc: 'Pitching moment' },
      { name: 'Flow Velocity Field', unit: 'visualization', desc: 'Streamlines and vectors' }
    ],
    physics: 'Simplified Euler/Navier-Stokes solver with boundary layer approximation. Suitable for preliminary aerodynamic analysis.',
    link: '/cfd-simulator'
  },
  {
    id: 'airfoil-downloader',
    title: 'Airfoil Downloader',
    icon: Database,
    shortDesc: 'Access NACA airfoil database',
    fullDesc: 'Browse and download NACA airfoil coordinates. Search by series, thickness, and camber specifications.',
    controls: [
      { name: 'NACA Series', desc: 'Select airfoil family', range: '4-digit / 5-digit / 6-series' },
      { name: 'Thickness', desc: 'Airfoil thickness (%)', range: '6-21%' },
      { name: 'Camber', desc: 'Camber amount (%)', range: '0-9%' },
      { name: 'Search', desc: 'Filter by name', range: 'Text search' }
    ],
    outputs: [
      { name: 'Coordinates File', unit: '.dat', desc: 'Standard airfoil format' },
      { name: 'Metadata', unit: 'JSON', desc: 'Airfoil properties' },
      { name: 'Preview', unit: 'SVG', desc: 'Visual profile shape' }
    ],
    physics: 'NACA 4-digit: t/c, m, p. NACA 5-digit: design Cl, m, p. 6-series: laminar flow optimization.',
    link: '/airfoil-downloader'
  }
];

const SECTION_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function AboutToolsPage() {
  return (
    <div className="min-h-screen bg-aerospace-dark text-foreground font-paragraph">
      <Header />
      
      <main className="flex-1 w-full flex flex-col">
        {/* Hero Section */}
        <section className="relative w-full py-20 border-b border-secondary/20">
          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-aerospace-blue" />
                <span className="font-mono text-sm uppercase tracking-widest text-aerospace-blue">
                  Tool Documentation
                </span>
              </div>
              <h1 className="font-heading text-5xl md:text-6xl font-bold text-foreground">
                Aerospace Tools Guide
              </h1>
              <p className="text-xl text-secondary-foreground max-w-3xl">
                Comprehensive documentation for each tool, including controls, outputs, and physics models used.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="w-full py-20 bg-aerospace-dark">
          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16">
            <div className="grid grid-cols-1 gap-12">
              {TOOLS_DATA.map((tool, index) => (
                <ToolCard key={tool.id} tool={tool} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-16 bg-primary border-t border-secondary/20">
          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                Ready to use the tools?
              </h2>
              <p className="text-secondary-foreground max-w-2xl mx-auto">
                Visit the Aerospace Tools section to access all calculators and simulators.
              </p>
              <Link
                to="/aerospace-tools"
                className="inline-flex items-center justify-center px-8 py-3 bg-aerospace-blue text-white font-semibold rounded-lg hover:bg-aerospace-accent transition-colors duration-300 gap-2"
              >
                Go to Tools <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function ToolCard({ tool, index }: { tool: any; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const Icon = tool.icon;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={SECTION_VARIANTS}
      className="bg-primary border border-secondary/30 rounded-lg overflow-hidden hover:border-aerospace-blue/50 transition-colors duration-300"
    >
      <div className="p-8 md:p-12">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-aerospace-blue/10 rounded-lg">
              <Icon className="w-6 h-6 text-aerospace-blue" />
            </div>
            <div>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2">
                {tool.title}
              </h2>
              <p className="text-aerospace-blue font-semibold">{tool.shortDesc}</p>
            </div>
          </div>
          <Link
            to={tool.link}
            className="flex items-center gap-2 px-4 py-2 bg-aerospace-blue/10 text-aerospace-blue hover:bg-aerospace-blue hover:text-white rounded-lg transition-colors duration-300 font-semibold text-sm"
          >
            Open <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Description */}
        <p className="text-secondary-foreground mb-8 leading-relaxed">
          {tool.fullDesc}
        </p>

        {/* Physics Model */}
        <div className="mb-8 p-4 bg-aerospace-dark/50 border border-secondary/20 rounded-lg">
          <div className="flex items-start gap-2 mb-2">
            <Info className="w-4 h-4 text-aerospace-accent mt-0.5 flex-shrink-0" />
            <span className="font-semibold text-aerospace-accent text-sm">Physics Model</span>
          </div>
          <p className="text-sm text-secondary-foreground font-mono">
            {tool.physics}
          </p>
        </div>

        {/* Controls & Outputs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls */}
          <div>
            <h3 className="font-heading text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Gauge className="w-5 h-5 text-aerospace-blue" />
              Input Controls
            </h3>
            <div className="space-y-3">
              {tool.controls.map((control: any, i: number) => (
                <div key={i} className="border-l-2 border-aerospace-blue/30 pl-4">
                  <div className="font-semibold text-foreground text-sm">{control.name}</div>
                  <div className="text-xs text-secondary-foreground mt-1">{control.desc}</div>
                  <div className="text-xs text-aerospace-blue font-mono mt-1">Range: {control.range}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Outputs */}
          <div>
            <h3 className="font-heading text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-aerospace-success" />
              Output Results
            </h3>
            <div className="space-y-3">
              {tool.outputs.map((output: any, i: number) => (
                <div key={i} className="border-l-2 border-aerospace-success/30 pl-4">
                  <div className="font-semibold text-foreground text-sm">
                    {output.name} <span className="text-aerospace-success font-mono text-xs ml-2">{output.unit}</span>
                  </div>
                  <div className="text-xs text-secondary-foreground mt-1">{output.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
