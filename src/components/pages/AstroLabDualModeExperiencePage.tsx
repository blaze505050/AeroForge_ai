import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Microscope, Zap, Target, Code, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AstroLabDualModeExperiencePage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'student' | 'professional'>('student');

  const features = {
    student: [
      { icon: BookOpen, title: 'Educational Tooltips', desc: 'Plain-language explanations of all concepts' },
      { icon: Target, title: 'Guided Missions', desc: 'Step-by-step learning paths with objectives' },
      { icon: Zap, title: 'Simplified Controls', desc: 'Intuitive interface optimized for learning' },
      { icon: BarChart3, title: 'Visual Analytics', desc: 'Charts and graphs to understand data' },
    ],
    professional: [
      { icon: Code, title: 'Raw Telemetry', desc: 'Direct access to simulation vectors & data' },
      { icon: Microscope, title: 'Advanced Tools', desc: 'LaTeX equations, custom parameters' },
      { icon: Zap, title: 'Full Control', desc: 'Unrestricted access to all parameters' },
      { icon: BarChart3, title: 'CSV Export', desc: 'Download datasets for external analysis' },
    ],
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-foreground flex flex-col">
      <Header />
      
      <main className="flex-1 w-full max-w-[120rem] mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {/* Header */}
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/astrolab')} className="p-2 hover:bg-[#131924] rounded-lg transition">
              <ArrowLeft size={20} className="text-[#00F0FF]" />
            </button>
            <div>
              <h1 className="text-4xl font-bold text-[#00F0FF] font-mono">Dual-Mode Experience</h1>
              <p className="text-secondary-foreground text-sm">Switch between Student and Professional modes</p>
            </div>
          </div>

          {/* Mode Selection */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Student Mode */}
            <motion.button
              onClick={() => setMode('student')}
              whileHover={{ scale: 1.02 }}
              className={`text-left p-8 rounded-lg border-2 transition-all ${
                mode === 'student'
                  ? 'bg-[#131924]/60 border-[#00F0FF] shadow-lg shadow-[#00F0FF]/20'
                  : 'bg-[#131924]/30 border-[#00F0FF33] hover:border-[#00F0FF]'
              }`}
            >
              <div className="text-5xl mb-4">🎓</div>
              <h2 className="text-3xl font-bold text-[#00F0FF] font-mono mb-2">Student Mode</h2>
              <p className="text-secondary-foreground mb-6">Perfect for learning and exploration</p>
              <div className="space-y-3">
                {features.student.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <feature.icon size={18} className="text-[#00F0FF] mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-foreground">{feature.title}</div>
                      <div className="text-sm text-secondary-foreground">{feature.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.button>

            {/* Professional Mode */}
            <motion.button
              onClick={() => setMode('professional')}
              whileHover={{ scale: 1.02 }}
              className={`text-left p-8 rounded-lg border-2 transition-all ${
                mode === 'professional'
                  ? 'bg-[#131924]/60 border-[#FF007A] shadow-lg shadow-[#FF007A]/20'
                  : 'bg-[#131924]/30 border-[#00F0FF33] hover:border-[#FF007A]'
              }`}
            >
              <div className="text-5xl mb-4">🔬</div>
              <h2 className="text-3xl font-bold text-[#FF007A] font-mono mb-2">Professional Mode</h2>
              <p className="text-secondary-foreground mb-6">For researchers and advanced users</p>
              <div className="space-y-3">
                {features.professional.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <feature.icon size={18} className="text-[#FF007A] mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-foreground">{feature.title}</div>
                      <div className="text-sm text-secondary-foreground">{feature.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.button>
          </div>

          {/* Current Mode Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-8"
          >
            <div className="flex items-start gap-4">
              <div className={`text-4xl ${mode === 'student' ? 'text-[#00F0FF]' : 'text-[#FF007A]'}`}>
                {mode === 'student' ? '🎓' : '🔬'}
              </div>
              <div className="flex-1">
                <h3 className={`text-2xl font-bold font-mono mb-2 ${mode === 'student' ? 'text-[#00F0FF]' : 'text-[#FF007A]'}`}>
                  {mode === 'student' ? 'Student Mode Active' : 'Professional Mode Active'}
                </h3>
                <p className="text-secondary-foreground mb-4">
                  {mode === 'student'
                    ? 'You are in Student Mode. All AstroLab modules will display educational content with simplified controls, guided overlays, and step-by-step learning paths. Perfect for understanding astronomical concepts and orbital mechanics.'
                    : 'You are in Professional Mode. All AstroLab modules will display advanced telemetry, raw data vectors, professional-grade analysis tools, and full access to simulation parameters. Ideal for research and advanced analysis.'}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-[#0B0E14] p-4 rounded-lg border border-[#00F0FF33]">
                    <div className="text-xs font-mono text-[#FF007A] mb-1">Interface</div>
                    <div className="text-sm font-semibold text-foreground">
                      {mode === 'student' ? 'Simplified' : 'Advanced'}
                    </div>
                  </div>
                  <div className="bg-[#0B0E14] p-4 rounded-lg border border-[#00F0FF33]">
                    <div className="text-xs font-mono text-[#FF007A] mb-1">Data Access</div>
                    <div className="text-sm font-semibold text-foreground">
                      {mode === 'student' ? 'Guided' : 'Full'}
                    </div>
                  </div>
                  <div className="bg-[#0B0E14] p-4 rounded-lg border border-[#00F0FF33]">
                    <div className="text-xs font-mono text-[#FF007A] mb-1">Export</div>
                    <div className="text-sm font-semibold text-foreground">
                      {mode === 'student' ? 'Limited' : 'CSV/JSON'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Comparison Table */}
          <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-6 overflow-x-auto">
            <h3 className="text-lg font-bold text-[#00F0FF] font-mono mb-4">Feature Comparison</h3>
            <table className="w-full text-sm font-mono">
              <thead>
                <tr className="border-b border-[#00F0FF33]">
                  <th className="text-left py-2 text-[#FF007A]">Feature</th>
                  <th className="text-center py-2 text-[#00F0FF]">Student</th>
                  <th className="text-center py-2 text-[#FF007A]">Professional</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Educational Tooltips', student: '✓', professional: '✓' },
                  { feature: 'Guided Missions', student: '✓', professional: '✗' },
                  { feature: 'Raw Telemetry', student: '✗', professional: '✓' },
                  { feature: 'Custom Parameters', student: 'Limited', professional: '✓' },
                  { feature: 'CSV Export', student: '✗', professional: '✓' },
                  { feature: 'LaTeX Equations', student: '✗', professional: '✓' },
                  { feature: 'Real-time Data', student: '✓', professional: '✓' },
                  { feature: 'Visualization Tools', student: '✓', professional: '✓' },
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-[#00F0FF33]">
                    <td className="py-3 text-secondary-foreground">{row.feature}</td>
                    <td className="py-3 text-center text-[#00F0FF]">{row.student}</td>
                    <td className="py-3 text-center text-[#FF007A]">{row.professional}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Action Button */}
          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate('/astrolab')}
              className={`px-8 py-3 rounded-lg font-mono font-bold text-lg transition-all flex items-center gap-2 ${
                mode === 'student'
                  ? 'bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF] hover:bg-[#00F0FF]/30'
                  : 'bg-[#FF007A]/20 text-[#FF007A] border border-[#FF007A] hover:bg-[#FF007A]/30'
              }`}
            >
              <Zap size={20} />
              Continue to AstroLab
            </motion.button>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
