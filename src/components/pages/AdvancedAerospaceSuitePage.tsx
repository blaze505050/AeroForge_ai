import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, Brain, Cpu, BarChart3, Lightbulb, Rocket, 
  TrendingUp, Shield, Gauge, Layers, Code, Database,
  ArrowRight, CheckCircle, AlertCircle, Sparkles, Wind, Wrench
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  capabilities: string[];
}

const features: Feature[] = [
  {
    icon: <Wind className="w-8 h-8" />,
    title: 'Multi-Physics Simulation',
    description: 'Advanced computational fluid dynamics with coupled structural analysis',
    capabilities: [
      'Aerodynamic analysis (RANS, LES, DNS)',
      'Structural mechanics simulation',
      'Thermal analysis and heat transfer',
      'Fluid-structure interaction (FSI)',
      'Real-time convergence monitoring'
    ]
  },
  {
    icon: <Wrench className="w-8 h-8" />,
    title: 'Structural Analysis',
    description: 'Comprehensive finite element analysis for aerospace structures',
    capabilities: [
      'Static and dynamic analysis',
      'Composite material modeling',
      'Fatigue and stress analysis',
      'Modal analysis and vibration',
      'Optimization algorithms'
    ]
  },
  {
    icon: <Brain className="w-8 h-8" />,
    title: 'AI-Powered Optimization',
    description: 'Machine learning-driven design optimization and suggestions',
    capabilities: [
      'Parametric design optimization',
      'Automated design variations',
      'Performance prediction',
      'Design space exploration',
      'Intelligent recommendations'
    ]
  },
  {
    icon: <Database className="w-8 h-8" />,
    title: 'Advanced Data Management',
    description: 'Comprehensive database and version control for projects',
    capabilities: [
      'Project versioning and history',
      'Collaborative workspace',
      'Data export (STEP, STL, IGES)',
      'Result archiving',
      'Performance benchmarking'
    ]
  },
  {
    icon: <Gauge className="w-8 h-8" />,
    title: 'Real-Time Monitoring',
    description: 'Live simulation monitoring and performance tracking',
    capabilities: [
      'Live convergence plots',
      'Real-time residual monitoring',
      'Performance metrics dashboard',
      'Custom probe points',
      'Alert system'
    ]
  },
  {
    icon: <Layers className="w-8 h-8" />,
    title: 'Advanced Meshing',
    description: 'Intelligent mesh generation and refinement strategies',
    capabilities: [
      'Automatic mesh generation',
      'Boundary layer refinement',
      'Adaptive mesh refinement',
      'Mesh quality assessment',
      'Multi-region meshing'
    ]
  }
];

const capabilities = [
  {
    category: 'Simulation',
    items: [
      'Transonic and supersonic flow analysis',
      'Turbulence modeling (k-ε, k-ω, SST)',
      'Compressibility effects',
      'Heat transfer and combustion',
      'Multiphase flow simulation'
    ]
  },
  {
    category: 'Design',
    items: [
      'Parametric modeling',
      'Topology optimization',
      'Shape optimization',
      'Material selection',
      'Manufacturing constraints'
    ]
  },
  {
    category: 'Analysis',
    items: [
      'Aerodynamic coefficients (Cl, Cd, Cm)',
      'Pressure distribution',
      'Stress and strain analysis',
      'Thermal gradients',
      'Vibration modes'
    ]
  },
  {
    category: 'Collaboration',
    items: [
      'Team workspaces',
      'Real-time collaboration',
      'Comment and annotation',
      'Version control',
      'Access management'
    ]
  }
];

export default function AdvancedAerospaceSuitePage() {
  const [selectedFeature, setSelectedFeature] = useState(0);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-aerospace-dark via-aerospace-dark to-black">
        {/* Hero Section */}
        <section className="relative w-full max-w-[120rem] mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Sparkles className="w-8 h-8 text-aerospace-accent" />
              <span className="text-aerospace-accent font-heading text-lg font-semibold">Professional Grade</span>
            </div>
            <h1 className="font-heading text-6xl md:text-7xl font-bold text-white mb-6">
              Advanced Aerospace Suite
            </h1>
            <p className="text-xl text-secondary-foreground max-w-3xl mx-auto mb-8">
              Enterprise-grade aerospace design and analysis platform with multi-physics simulation, AI-powered optimization, and real-time collaboration. The complete solution for professional aerospace engineering.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button className="bg-aerospace-accent hover:bg-aerospace-accent/90 text-black font-semibold px-8 py-6 text-lg">
                Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="outline" className="border-aerospace-blue text-aerospace-blue hover:bg-aerospace-blue/10 px-8 py-6 text-lg">
                View Documentation
              </Button>
            </div>
          </motion.div>

          {/* Key Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-20"
          >
            {[
              { label: 'Simulation Types', value: '15+' },
              { label: 'Physics Modules', value: '8' },
              { label: 'Max Mesh Elements', value: '100M+' },
              { label: 'Collaboration Users', value: 'Unlimited' }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="bg-primary/50 border border-aerospace-blue/30 rounded-lg p-6 text-center"
              >
                <div className="text-3xl font-bold text-aerospace-accent mb-2">{stat.value}</div>
                <div className="text-secondary-foreground font-paragraph">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="relative w-full max-w-[120rem] mx-auto px-6 py-20">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="font-heading text-4xl md:text-5xl font-bold text-white mb-16 text-center"
          >
            Comprehensive Features
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setSelectedFeature(i)}
                className={`p-6 rounded-lg border transition-all cursor-pointer ${
                  selectedFeature === i
                    ? 'bg-aerospace-accent/20 border-aerospace-accent'
                    : 'bg-primary/50 border-aerospace-blue/30 hover:border-aerospace-accent/50'
                }`}
              >
                <div className="text-aerospace-accent mb-4">{feature.icon}</div>
                <h3 className="font-heading text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-secondary-foreground font-paragraph text-sm mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.capabilities.slice(0, 3).map((cap, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-secondary-foreground">
                      <CheckCircle className="w-4 h-4 text-aerospace-success flex-shrink-0 mt-0.5" />
                      <span>{cap}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Capabilities Grid */}
        <section className="relative w-full max-w-[120rem] mx-auto px-6 py-20">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="font-heading text-4xl md:text-5xl font-bold text-white mb-16 text-center"
          >
            Complete Capabilities
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {capabilities.map((cap, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-primary/50 border border-aerospace-blue/30 rounded-lg p-8"
              >
                <h3 className="font-heading text-2xl font-bold text-aerospace-accent mb-6">{cap.category}</h3>
                <ul className="space-y-3">
                  {cap.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <Zap className="w-5 h-5 text-aerospace-accent flex-shrink-0 mt-0.5" />
                      <span className="text-secondary-foreground font-paragraph">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Pricing Section */}
        <section className="relative w-full max-w-[120rem] mx-auto px-6 py-20">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="font-heading text-4xl md:text-5xl font-bold text-white mb-16 text-center"
          >
            Flexible Pricing Plans
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Professional',
                price: '$99',
                period: '/month',
                description: 'Perfect for individual engineers',
                features: ['5 concurrent simulations', 'Basic support', 'Cloud storage 100GB', 'Export to STL/STEP']
              },
              {
                name: 'Enterprise',
                price: '$499',
                period: '/month',
                description: 'For teams and organizations',
                features: ['Unlimited simulations', 'Priority support', 'Cloud storage 1TB', 'Team collaboration', 'Custom integrations'],
                highlighted: true
              },
              {
                name: 'Academic',
                price: 'Free',
                period: 'for students',
                description: 'Educational institutions',
                features: ['Full feature access', 'Community support', 'Cloud storage 500GB', 'Educational resources']
              }
            ].map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-lg p-8 border transition-all ${
                  plan.highlighted
                    ? 'bg-aerospace-accent/20 border-aerospace-accent shadow-lg shadow-aerospace-accent/20'
                    : 'bg-primary/50 border-aerospace-blue/30'
                }`}
              >
                <h3 className="font-heading text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-secondary-foreground font-paragraph text-sm mb-6">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-aerospace-accent">{plan.price}</span>
                  <span className="text-secondary-foreground font-paragraph text-sm">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-secondary-foreground">
                      <CheckCircle className="w-4 h-4 text-aerospace-success flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className={`w-full ${plan.highlighted ? 'bg-aerospace-accent text-black hover:bg-aerospace-accent/90' : 'bg-aerospace-blue text-white hover:bg-aerospace-blue/90'}`}>
                  Get Started
                </Button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative w-full max-w-[120rem] mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-aerospace-blue/20 to-aerospace-accent/20 border border-aerospace-accent/50 rounded-lg p-12 text-center"
          >
            <h2 className="font-heading text-4xl font-bold text-white mb-6">Ready to Transform Your Aerospace Design?</h2>
            <p className="text-xl text-secondary-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of engineers using the Advanced Aerospace Suite for professional-grade design and analysis.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button className="bg-aerospace-accent hover:bg-aerospace-accent/90 text-black font-semibold px-8 py-6 text-lg">
                Start Your Free Trial
              </Button>
              <Button variant="outline" className="border-aerospace-blue text-aerospace-blue hover:bg-aerospace-blue/10 px-8 py-6 text-lg">
                Schedule Demo
              </Button>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
