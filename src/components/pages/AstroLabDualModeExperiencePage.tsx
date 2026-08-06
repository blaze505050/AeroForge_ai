import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Zap, BarChart3, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type Mode = 'student' | 'professional';

interface ModeFeature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function AstroLabDualModeExperiencePage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('student');

  const studentFeatures: ModeFeature[] = [
    {
      title: 'Guided Tours',
      description: 'Interactive tutorials for learning astronomy basics',
      icon: <BookOpen className="w-6 h-6" />,
    },
    {
      title: 'Simplified Interface',
      description: 'Easy-to-use controls optimized for beginners',
      icon: <Zap className="w-6 h-6" />,
    },
    {
      title: 'Educational Content',
      description: 'Comprehensive learning materials and explanations',
      icon: <BarChart3 className="w-6 h-6" />,
    },
  ];

  const professionalFeatures: ModeFeature[] = [
    {
      title: 'Advanced Telemetry',
      description: 'Real-time satellite tracking with TLE updates',
      icon: <Zap className="w-6 h-6" />,
    },
    {
      title: 'Custom Analysis',
      description: 'Build custom workflows and analysis pipelines',
      icon: <Settings className="w-6 h-6" />,
    },
    {
      title: 'Data Export',
      description: 'Export results in multiple formats (CSV, FITS, HDF5)',
      icon: <BarChart3 className="w-6 h-6" />,
    },
  ];

  return (
    <div className="min-h-screen bg-aerospace-dark text-foreground font-paragraph flex flex-col">
      <Header />

      <main className="flex-1 w-full flex flex-col">
        {/* Header */}
        <section className="w-full bg-primary border-b border-secondary/20 py-8">
          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-aerospace-blue hover:text-aerospace-accent transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </button>
            <div>
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
                AstroLab Dual-Mode Experience
              </h1>
              <p className="font-paragraph text-lg text-secondary-foreground max-w-3xl">
                Seamless switching between Student and Professional modes. Learn at your pace or dive into advanced research.
              </p>
            </div>
          </div>
        </section>

        {/* Mode Selector */}
        <section className="w-full bg-aerospace-dark py-12">
          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16">
            <div className="flex justify-center gap-4 mb-16">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMode('student')}
                className={`px-8 py-4 rounded-lg font-heading font-bold text-lg transition-all ${
                  mode === 'student'
                    ? 'bg-aerospace-blue text-white shadow-lg'
                    : 'bg-primary/40 text-aerospace-blue border border-aerospace-blue/20 hover:border-aerospace-blue/50'
                }`}
              >
                <BookOpen className="w-5 h-5 inline mr-2" />
                Student Mode
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMode('professional')}
                className={`px-8 py-4 rounded-lg font-heading font-bold text-lg transition-all ${
                  mode === 'professional'
                    ? 'bg-aerospace-blue text-white shadow-lg'
                    : 'bg-primary/40 text-aerospace-blue border border-aerospace-blue/20 hover:border-aerospace-blue/50'
                }`}
              >
                <Zap className="w-5 h-5 inline mr-2" />
                Professional Mode
              </motion.button>
            </div>

            {/* Mode Content */}
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-12"
            >
              {/* Mode Description */}
              <div className="bg-gradient-to-br from-aerospace-dark/60 to-aerospace-dark/40 border border-aerospace-blue/20 rounded-lg p-8">
                <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
                  {mode === 'student' ? 'Student Mode' : 'Professional Mode'}
                </h2>
                <p className="font-paragraph text-lg text-foreground/80 mb-6">
                  {mode === 'student'
                    ? 'Perfect for learning astronomy and space science. Get started with interactive tutorials and simplified controls.'
                    : 'Advanced tools for researchers and professionals. Access real-time data, custom analysis, and professional-grade features.'}
                </p>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {(mode === 'student' ? studentFeatures : professionalFeatures).map((feature, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-primary/40 border border-aerospace-blue/20 rounded-lg p-6 hover:border-aerospace-blue/50 transition-all"
                    >
                      <div className="text-aerospace-blue mb-4">{feature.icon}</div>
                      <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                        {feature.title}
                      </h3>
                      <p className="font-paragraph text-sm text-foreground/70">
                        {feature.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Capabilities */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-aerospace-blue/20 to-aerospace-accent/20 border border-aerospace-blue/50 rounded-lg p-8"
                >
                  <h3 className="font-heading text-2xl font-bold text-foreground mb-6">
                    {mode === 'student' ? 'Learning Path' : 'Research Tools'}
                  </h3>
                  <ul className="space-y-4">
                    {(mode === 'student'
                      ? [
                          'Interactive celestial navigation',
                          'Satellite tracking basics',
                          'Orbital mechanics fundamentals',
                          'Photometry introduction',
                          'Guided missions',
                        ]
                      : [
                          'Real-time TLE updates',
                          'Advanced orbital analysis',
                          'Multi-wavelength data access',
                          'Custom simulation parameters',
                          'Batch processing',
                        ]
                    ).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-aerospace-blue font-bold">✓</span>
                        <span className="text-foreground/80">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-aerospace-accent/20 to-aerospace-blue/20 border border-aerospace-accent/50 rounded-lg p-8"
                >
                  <h3 className="font-heading text-2xl font-bold text-foreground mb-6">
                    {mode === 'student' ? 'Resources' : 'Integration'}
                  </h3>
                  <ul className="space-y-4">
                    {(mode === 'student'
                      ? [
                          'Video tutorials',
                          'Interactive quizzes',
                          'Glossary of terms',
                          'Practice simulations',
                          'Community forum',
                        ]
                      : [
                          'NASA HEASARC API',
                          'CelesTrak TLE data',
                          'JPL Horizons system',
                          'FITS file support',
                          'REST API access',
                        ]
                    ).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-aerospace-accent font-bold">→</span>
                        <span className="text-foreground/80">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>

              {/* CTA */}
              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-12 py-6 bg-gradient-to-r from-aerospace-blue to-aerospace-accent text-white font-mono text-sm uppercase tracking-wider rounded-lg shadow-xl hover:shadow-2xl transition-all"
                >
                  Enter {mode === 'student' ? 'Student' : 'Professional'} Mode
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
