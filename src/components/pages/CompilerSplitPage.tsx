import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import Viewer3D from '@/components/3DViewer';
import { compileDesign } from '@/services/compilerService';
import { AeroForgeDSL } from '@/services/dslSchema';
import { Copy, Download, AlertCircle, CheckCircle2, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CompilerSplitPage() {
  const [input, setInput] = useState('');
  const [units, setUnits] = useState<'mm' | 'cm' | 'in' | 'ft'>('mm');
  const [isGenerating, setIsGenerating] = useState(false);
  const [dsl, setDsl] = useState<AeroForgeDSL | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [isValid, setIsValid] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'dsl' | 'validation'>('dsl');
  const [expandedPanel, setExpandedPanel] = useState(true);

  const handleGenerate = async () => {
    if (!input.trim()) return;

    setIsGenerating(true);
    setErrors([]);
    setWarnings([]);

    try {
      const response = await compileDesign({
        input: input.trim(),
        units,
      });

      if (response.dsl) {
        setDsl(response.dsl);
        setIsValid(response.success);
        setErrors(response.errors || []);
        setWarnings(response.warnings || []);
      } else {
        setErrors(response.errors || ['Compilation failed']);
        setDsl(null);
      }
    } catch (error) {
      setErrors(['An unexpected error occurred during compilation.']);
      setDsl(null);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!dsl) return;
    const jsonString = JSON.stringify(dsl, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aeroforge-dsl-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    if (!dsl) return;
    const jsonString = JSON.stringify(dsl, null, 2);
    await navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const jsonString = dsl ? JSON.stringify(dsl, null, 2) : '';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Panel - Compiler */}
        <div className="w-full lg:w-1/2 flex flex-col border-b lg:border-b-0 lg:border-r border-secondary/20 overflow-y-auto">
          <section className="flex-1 px-6 lg:px-8 py-8">
            <div className="max-w-2xl">
              <div className="flex items-center justify-between mb-2">
                <h1 className="font-heading text-3xl text-foreground">Design Compiler</h1>
                <button
                  onClick={() => setExpandedPanel(!expandedPanel)}
                  className="lg:hidden p-2 hover:bg-secondary/10 rounded transition-colors"
                >
                  <ChevronDown
                    className={`w-5 h-5 text-foreground transition-transform ${
                      expandedPanel ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </div>
              <p className="font-paragraph text-sm text-foreground/60 mb-8">
                Describe your mechanical part and watch it render in real-time
              </p>

              {expandedPanel && (
                <div className="space-y-6">
                  {/* Text Input */}
                  <div>
                    <label htmlFor="design-input" className="block font-paragraph text-sm font-medium text-foreground mb-2">
                      Describe your mechanical part
                    </label>
                    <textarea
                      id="design-input"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="w-full h-48 px-4 py-3 border border-secondary rounded bg-background text-foreground font-paragraph text-sm resize-none focus:outline-none focus:border-primary transition-colors duration-200"
                      placeholder="Example: Create a mounting bracket with two 6mm bolt holes spaced 50mm apart, with rounded corners..."
                      disabled={isGenerating}
                    />
                  </div>

                  {/* Units Dropdown */}
                  <div>
                    <label htmlFor="units" className="block font-paragraph text-sm font-medium text-foreground mb-2">
                      Units
                    </label>
                    <select
                      id="units"
                      value={units}
                      onChange={(e) => setUnits(e.target.value as 'mm' | 'cm' | 'in' | 'ft')}
                      className="w-full px-4 py-2 border border-secondary rounded bg-background text-foreground font-paragraph text-sm focus:outline-none focus:border-primary transition-colors duration-200"
                      disabled={isGenerating}
                    >
                      <option value="mm">Millimeters (mm)</option>
                      <option value="cm">Centimeters (cm)</option>
                      <option value="in">Inches (in)</option>
                      <option value="ft">Feet (ft)</option>
                    </select>
                  </div>

                  {/* Generate Button */}
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !input.trim()}
                    className="w-full bg-accent text-accent-foreground font-paragraph text-sm font-semibold px-6 py-3 rounded transition-colors duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <LoadingSpinner />
                        <span>Compiling...</span>
                      </>
                    ) : (
                      'Compile & Render'
                    )}
                  </button>
                </div>
              )}

              {/* Status Panel */}
              {dsl && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-4 border border-secondary/20 rounded bg-background"
                >
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {isValid ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-destructive" />
                        )}
                        <span className="font-mono text-xs uppercase text-foreground/60">Status</span>
                      </div>
                      <div className={`font-heading text-lg font-bold ${isValid ? 'text-green-600' : 'text-destructive'}`}>
                        {isValid ? 'PASS' : 'FAIL'}
                      </div>
                    </div>
                    <div>
                      <span className="font-mono text-xs uppercase text-foreground/60 block mb-1">Features</span>
                      <div className="font-heading text-lg font-bold text-primary">{dsl.features?.length || 0}</div>
                    </div>
                    <div>
                      <span className="font-mono text-xs uppercase text-foreground/60 block mb-1">Constraints</span>
                      <div className="font-heading text-lg font-bold text-primary">{dsl.constraints?.length || 0}</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={handleDownload}
                      className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground font-paragraph text-xs font-semibold px-3 py-2 rounded transition-colors duration-200 hover:opacity-90"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    <div className="relative flex-1">
                      <button
                        onClick={handleCopy}
                        className="w-full flex items-center justify-center gap-2 bg-transparent text-primary border border-primary font-paragraph text-xs font-semibold px-3 py-2 rounded transition-colors duration-200 hover:bg-primary hover:text-primary-foreground"
                      >
                        <Copy className="w-4 h-4" />
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                      <AnimatePresence>
                        {copied && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 bg-green-600 text-white font-paragraph text-xs font-semibold px-2 py-1 rounded whitespace-nowrap"
                          >
                            ✓ Copied!
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Errors */}
              {errors.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 border border-destructive/20 bg-destructive/5 rounded"
                >
                  <h3 className="font-heading text-sm text-destructive mb-3 flex items-center gap-2">
                    <X className="w-4 h-4" />
                    Errors ({errors.length})
                  </h3>
                  <ul className="space-y-1">
                    {errors.map((error, i) => (
                      <li key={i} className="font-paragraph text-xs text-foreground">
                        • {error}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Warnings */}
              {warnings.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 border border-yellow-600/20 bg-yellow-600/5 rounded"
                >
                  <h3 className="font-heading text-sm text-yellow-600 mb-3">Warnings ({warnings.length})</h3>
                  <ul className="space-y-1">
                    {warnings.map((warning, i) => (
                      <li key={i} className="font-paragraph text-xs text-foreground">
                        ⚠ {warning}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* DSL Output */}
              {dsl && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6"
                >
                  <div className="mb-3 flex gap-2 border-b border-secondary/20">
                    <button
                      onClick={() => setActiveTab('dsl')}
                      className={`pb-2 font-paragraph text-xs font-medium transition-colors ${
                        activeTab === 'dsl'
                          ? 'text-primary border-b-2 border-primary'
                          : 'text-foreground/60 hover:text-foreground'
                      }`}
                    >
                      DSL Output
                    </button>
                    {dsl.validationResults && dsl.validationResults.length > 0 && (
                      <button
                        onClick={() => setActiveTab('validation')}
                        className={`pb-2 font-paragraph text-xs font-medium transition-colors ${
                          activeTab === 'validation'
                            ? 'text-primary border-b-2 border-primary'
                            : 'text-foreground/60 hover:text-foreground'
                        }`}
                      >
                        Validation ({dsl.validationResults.length})
                      </button>
                    )}
                  </div>

                  {activeTab === 'dsl' && (
                    <div className="bg-json-background p-3 rounded overflow-auto max-h-64 border border-secondary/20">
                      <pre className="font-mono text-xs text-foreground whitespace-pre">{jsonString}</pre>
                    </div>
                  )}

                  {activeTab === 'validation' && dsl.validationResults && (
                    <div className="space-y-2 max-h-64 overflow-auto">
                      {dsl.validationResults.map((result, i) => (
                        <div
                          key={i}
                          className={`p-2 rounded border text-xs ${
                            result.severity === 'ERROR'
                              ? 'border-destructive/20 bg-destructive/5'
                              : result.severity === 'WARNING'
                              ? 'border-yellow-600/20 bg-yellow-600/5'
                              : 'border-secondary/20 bg-secondary/5'
                          }`}
                        >
                          <div className="font-mono uppercase text-foreground/60 mb-1">{result.type}</div>
                          <p className="font-paragraph text-foreground">{result.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </section>
        </div>

        {/* Right Panel - 3D Viewer */}
        <div className="w-full lg:w-1/2 flex flex-col bg-gray-50 min-h-96 lg:min-h-auto">
          <div className="flex-1 p-4 lg:p-8">
            <Viewer3D dsl={dsl} isLoading={isGenerating} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
