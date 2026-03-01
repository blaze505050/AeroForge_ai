import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Wind,
  Brain,
  Microscope,
  Layers,
  TrendingUp,
  Zap,
  GitBranch,
  Database,
  Code2,
  Gauge,
  Lock,
  Globe,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const GridBackground = () => (
  <div
    className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]"
    style={{
      backgroundImage:
        'linear-gradient(#0EA5E9 1px, transparent 1px), linear-gradient(90deg, #0EA5E9 1px, transparent 1px)',
      backgroundSize: '40px 40px',
    }}
  />
);

const ResearchLabCard = ({ icon: Icon, title, description, path, badge, features }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6 }}
      className="group relative"
    >
      <Link to={path} className="block h-full">
        <div className="relative h-full bg-gradient-to-br from-primary/40 to-primary/20 border border-secondary/30 rounded-lg p-8 hover:border-aerospace-blue/50 transition-all duration-300 overflow-hidden">
          {/* Background gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-aerospace-blue/5 to-aerospace-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Content */}
          <div className="relative z-10">
            {/* Badge */}
            <div className="inline-block mb-4 px-3 py-1 bg-aerospace-blue/20 border border-aerospace-blue/30 rounded-full">
              <span className="text-xs font-mono text-aerospace-blue uppercase tracking-wider">
                {badge}
              </span>
            </div>

            {/* Icon */}
            <div className="mb-4 p-3 bg-aerospace-blue/10 rounded-lg w-fit">
              <Icon className="w-6 h-6 text-aerospace-blue" />
            </div>

            {/* Title */}
            <h3 className="font-heading text-xl font-bold text-foreground mb-3 group-hover:text-aerospace-blue transition-colors">
              {title}
            </h3>

            {/* Description */}
            <p className="text-secondary-foreground text-sm mb-6 leading-relaxed">
              {description}
            </p>

            {/* Features */}
            <div className="space-y-2 mb-6">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-aerospace-success mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-secondary-foreground">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex items-center gap-2 text-aerospace-blue font-medium text-sm group-hover:gap-3 transition-all">
              Access Lab <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default function ResearchLabsHubPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  const researchLabs = [
    {
      icon: Wind,
      title: 'Turbulence Modeling Research Lab',
      description:
        'Interactive comparison of advanced turbulence models with real-time convergence monitoring and performance analysis.',
      path: '/turbulence-modeling-research-lab',
      badge: '🌪️ Turbulence',
      features: [
        'Real-time convergence monitoring',
        'Advanced turbulence model comparison',
        'Performance metrics visualization',
        'Export simulation results',
      ],
    },
    {
      icon: Microscope,
      title: 'Digital Aerospace Research Lab',
      description:
        'Comprehensive MVP platform for aerospace research with integrated tools for design, simulation, and collaboration.',
      path: '/digital-aerospace-research-lab',
      badge: '🔬 Aerospace',
      features: [
        'Integrated research ecosystem',
        'Multi-tool collaboration',
        'Advanced analytics dashboard',
        'Real-time data processing',
      ],
    },
    {
      icon: TrendingUp,
      title: 'Elite Multi-Objective Optimization',
      description:
        'Revolutionary Pareto frontier analysis with NSGA-III algorithm for aerospace design optimization.',
      path: '/elite-multi-objective-optimization',
      badge: '🏆 Elite',
      features: [
        'NSGA-III algorithm implementation',
        'Pareto frontier visualization',
        'Multi-objective trade-off analysis',
        'Design space exploration',
      ],
    },
    {
      icon: Brain,
      title: 'AI Research Assistant',
      description:
        'Intelligent optimization strategies and research paper discovery powered by advanced AI algorithms.',
      path: '/ai-research-assistant',
      badge: '🤖 AI',
      features: [
        'AI-powered optimization suggestions',
        'Research paper discovery',
        'Intelligent recommendations',
        'Context-aware analysis',
      ],
    },
    {
      icon: Layers,
      title: 'Aerospace Design Patterns Library',
      description:
        'Professional wing, fuselage, and landing gear templates for rapid aerospace design and prototyping.',
      path: '/aerospace-design-patterns-library',
      badge: '📐 Library',
      features: [
        'Pre-built design templates',
        'Parametric modeling',
        'Design pattern library',
        'Quick prototyping tools',
      ],
    },
    {
      icon: Code2,
      title: 'Collaborative Workspace',
      description:
        'Real-time collaboration platform for aerospace teams with integrated version control and communication.',
      path: '/collaborative-workspace',
      badge: '👥 Collab',
      features: [
        'Real-time collaboration',
        'Version control integration',
        'Team communication tools',
        'Project management features',
      ],
    },
  ];

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-aerospace-dark text-foreground font-paragraph selection:bg-aerospace-blue selection:text-white flex flex-col overflow-clip"
    >
      <Header />

      <main className="flex-1 w-full flex flex-col">
        {/* HERO SECTION */}
        <section className="relative w-full min-h-[70vh] flex flex-col justify-center border-b border-secondary/20 bg-aerospace-dark overflow-hidden">
          <GridBackground />

          <div className="absolute top-20 right-10 w-96 h-96 bg-aerospace-accent/5 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-20 left-10 w-96 h-96 bg-aerospace-blue/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: '1s' }}
          />

          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16 relative z-10 py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-center gap-3 mb-6"
            >
              <Microscope className="w-6 h-6 text-aerospace-accent" />
              <span className="font-mono text-sm uppercase tracking-widest text-aerospace-accent">
                Research Hub
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight text-center mb-8"
            >
              <span className="text-aerospace-accent">Research Labs</span>
              <br />
              <span className="text-foreground">Unified Ecosystem</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center text-secondary-foreground text-lg md:text-xl max-w-3xl mx-auto mb-12"
            >
              Access all advanced research tools in one integrated platform. From turbulence modeling to AI-powered
              optimization, everything you need for cutting-edge aerospace research.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <div className="flex items-center gap-2 text-aerospace-success">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-medium">6 Advanced Research Labs</span>
              </div>
              <div className="hidden sm:block w-px h-6 bg-secondary/30" />
              <div className="flex items-center gap-2 text-aerospace-success">
                <Zap className="w-5 h-5" />
                <span className="text-sm font-medium">Real-time Collaboration</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* RESEARCH LABS GRID */}
        <section className="relative w-full py-20 md:py-32 bg-aerospace-dark border-b border-secondary/20">
          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: '-100px' }}
              className="mb-16"
            >
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
                Explore Our Research Labs
              </h2>
              <p className="text-secondary-foreground text-lg max-w-2xl">
                Each lab is designed for specific aerospace research challenges with integrated tools and real-time
                capabilities.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {researchLabs.map((lab, idx) => (
                <ResearchLabCard key={idx} {...lab} />
              ))}
            </div>
          </div>
        </section>

        {/* CAPABILITIES SECTION */}
        <section className="relative w-full py-20 md:py-32 bg-aerospace-dark border-b border-secondary/20">
          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: '-100px' }}
              className="mb-16"
            >
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
                Unified Capabilities
              </h2>
              <p className="text-secondary-foreground text-lg max-w-2xl">
                All research labs share a common infrastructure for seamless integration and data flow.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Database,
                  title: 'Centralized Data Hub',
                  desc: 'Access and manage all research data across labs',
                },
                {
                  icon: GitBranch,
                  title: 'Version Control',
                  desc: 'Track changes and maintain research history',
                },
                {
                  icon: Gauge,
                  title: 'Performance Monitoring',
                  desc: 'Real-time metrics and convergence tracking',
                },
                {
                  icon: Lock,
                  title: 'Secure Collaboration',
                  desc: 'Enterprise-grade security for team projects',
                },
                {
                  icon: Globe,
                  title: 'Cloud Integration',
                  desc: 'Access from anywhere with cloud sync',
                },
                {
                  icon: Sparkles,
                  title: 'AI-Powered Insights',
                  desc: 'Intelligent recommendations and analysis',
                },
              ].map((capability, idx) => {
                const ref = useRef(null);
                const isInView = useInView(ref, { once: true, margin: '-100px' });

                return (
                  <motion.div
                    key={idx}
                    ref={ref}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    className="bg-gradient-to-br from-primary/40 to-primary/20 border border-secondary/30 rounded-lg p-6 hover:border-aerospace-blue/50 transition-all duration-300"
                  >
                    <div className="p-3 bg-aerospace-blue/10 rounded-lg w-fit mb-4">
                      <capability.icon className="w-6 h-6 text-aerospace-blue" />
                    </div>
                    <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                      {capability.title}
                    </h3>
                    <p className="text-secondary-foreground text-sm">{capability.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="relative w-full py-20 md:py-32 bg-aerospace-dark">
          <div className="absolute inset-0 bg-gradient-to-r from-aerospace-blue/5 via-transparent to-aerospace-accent/5" />

          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: '-100px' }}
              className="text-center"
            >
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
                Ready to Start Your Research?
              </h2>
              <p className="text-secondary-foreground text-lg max-w-2xl mx-auto mb-8">
                Choose a research lab and begin your aerospace engineering journey with industry-leading tools.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/turbulence-modeling-research-lab"
                  className="px-8 py-3 bg-aerospace-blue hover:bg-aerospace-blue/90 text-white font-medium rounded-lg transition-colors"
                >
                  Explore Turbulence Lab
                </Link>
                <Link
                  to="/digital-aerospace-research-lab"
                  className="px-8 py-3 border border-aerospace-blue text-aerospace-blue hover:bg-aerospace-blue/10 font-medium rounded-lg transition-colors"
                >
                  Visit Aerospace Lab
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
