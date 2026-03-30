import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { CorePhilosophy, ArchitecturePrinciples, AntiGoals, AeroForgeDSL, ExecutionLog } from '@/entities';
import { Code2, CheckCircle2, AlertTriangle, Server, Database, Lock, ArrowRight, Check, X, Download, Copy, AlertCircle } from 'lucide-react';

export default function DocumentationPage() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'architecture' | 'dsl' | 'api' | 'results'>('architecture');
  const [philosophies, setPhilosophies] = useState<CorePhilosophy[]>([]);
  const [principles, setPrinciples] = useState<ArchitecturePrinciples[]>([]);
  const [antiGoals, setAntiGoals] = useState<AntiGoals[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const { result, isValid, errors: passedErrors, warnings, executionLog } = location.state || { 
    result: null, 
    isValid: false, 
    errors: [], 
    warnings: [],
    executionLog: []
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [philoResult, principlesResult, antiGoalsResult] = await Promise.all([
        BaseCrudService.getAll<CorePhilosophy>('corephilosophy'),
        BaseCrudService.getAll<ArchitecturePrinciples>('architectureprinciples'),
        BaseCrudService.getAll<AntiGoals>('antigoals'),
      ]);

      const sortedPhilosophies = [...philoResult.items].sort(
        (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)
      );

      setPhilosophies(sortedPhilosophies);
      setPrinciples(principlesResult.items);
      setAntiGoals(antiGoalsResult.items);
    } catch (error) {
      console.error('Failed to load architecture data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const dsl = result as AeroForgeDSL;
  const jsonString = result ? JSON.stringify(result, null, 2) : '';
  const errors = passedErrors || (result?.errors) || (result?.error ? [result.error] : []);

  const handleDownload = () => {
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

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Tab Navigation */}
        <section className="w-full bg-primary border-b border-secondary/20 sticky top-16 z-40">
          <div className="w-full max-w-[120rem] mx-auto px-[8%]">
            <div className="flex gap-1 overflow-x-auto">
              {[
                { id: 'architecture', label: 'Architecture' },
                { id: 'dsl', label: 'DSL Docs' },
                { id: 'api', label: 'API Reference' },
                { id: 'results', label: 'Results' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-4 font-paragraph text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-accent text-accent'
                      : 'border-transparent text-foreground/60 hover:text-foreground'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Content */}
        <AnimatePresence mode="wait">
          {/* Architecture Tab */}
          {activeTab === 'architecture' && (
            <motion.section
              key="architecture"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-[120rem] mx-auto px-[8%] py-20"
            >
              <div className="max-w-5xl">
                <h1 className="font-heading text-4xl text-foreground mb-3">How It Works</h1>
                <p className="font-paragraph text-lg text-foreground/70 mb-12">
                  Understanding the core architecture and design principles.
                </p>

                {isLoading ? (
                  <div className="text-center py-12">
                    <p className="text-foreground/60">Loading architecture data...</p>
                  </div>
                ) : (
                  <div className="space-y-12">
                    {/* Core Philosophy */}
                    {philosophies.length > 0 && (
                      <div>
                        <h2 className="font-heading text-2xl font-bold text-foreground mb-6">Core Philosophy</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {philosophies.map((philo) => (
                            <div key={philo._id} className="p-6 bg-primary border border-secondary/20 rounded-lg">
                              <h3 className="font-heading text-lg font-bold text-accent mb-2">
                                {philo.philosophyTitle}
                              </h3>
                              <p className="font-paragraph text-sm text-foreground/70 mb-3">
                                {philo.description}
                              </p>
                              {philo.emphasisKeyword && (
                                <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-mono rounded">
                                  {philo.emphasisKeyword}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Architecture Principles */}
                    {principles.length > 0 && (
                      <div>
                        <h2 className="font-heading text-2xl font-bold text-foreground mb-6">Architecture Principles</h2>
                        <div className="space-y-4">
                          {principles.map((principle) => (
                            <div key={principle._id} className="p-6 bg-primary border border-secondary/20 rounded-lg">
                              <h3 className="font-heading text-lg font-bold text-accent mb-2">
                                {principle.principleTitle}
                              </h3>
                              <p className="font-paragraph text-sm text-foreground/70 mb-3">
                                {principle.detailedExplanation}
                              </p>
                              {principle.analogyUsed && (
                                <div className="mt-3 p-3 bg-secondary/10 rounded border border-secondary/20">
                                  <p className="font-mono text-xs text-foreground/60 mb-1">Analogy:</p>
                                  <p className="font-paragraph text-sm text-foreground/80">{principle.analogyUsed}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Anti-Goals */}
                    {antiGoals.length > 0 && (
                      <div>
                        <h2 className="font-heading text-2xl font-bold text-foreground mb-6">Anti-Goals</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {antiGoals.map((goal) => (
                            <div key={goal._id} className="p-6 bg-primary border border-secondary/20 rounded-lg">
                              <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                                {goal.statement}
                              </h3>
                              <p className="font-paragraph text-sm text-foreground/70 mb-3">
                                {goal.rationale}
                              </p>
                              {goal.consequence && (
                                <div className="mt-3 p-3 bg-secondary/10 rounded">
                                  <p className="font-mono text-xs text-foreground/60 mb-1">Consequence:</p>
                                  <p className="font-paragraph text-sm text-foreground/80">{goal.consequence}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.section>
          )}

          {/* DSL Docs Tab */}
          {activeTab === 'dsl' && (
            <motion.section
              key="dsl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-[120rem] mx-auto px-[8%] py-20"
            >
              <div className="max-w-5xl">
                <div className="mb-16">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 bg-accent" />
                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-secondary-foreground/70">
                      Language Reference
                    </span>
                  </div>
                  <h1 className="font-heading text-5xl font-bold text-primary mb-4">
                    Design Language Specification
                  </h1>
                  <p className="font-paragraph text-lg text-foreground/70 max-w-3xl">
                    Complete reference for the AeroForge design language. Deterministic, versioned, and fully validated.
                  </p>
                </div>

                <div className="mb-16">
                  <h2 className="font-heading text-2xl font-bold text-primary mb-8">Core Principles</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      {
                        title: 'Explicit Units',
                        desc: 'Every dimension carries its unit. No implicit conversions.',
                      },
                      {
                        title: 'Deterministic Ordering',
                        desc: 'Features execute in strict sequence. No parallel or implicit dependencies.',
                      },
                      {
                        title: 'Named Features',
                        desc: 'Every feature has a unique ID and human-readable name for traceability.',
                      },
                      {
                        title: 'No Implicit Geometry',
                        desc: 'All geometry is explicit. No auto-repair or heuristic inference.',
                      },
                    ].map((principle, idx) => (
                      <div key={idx} className="p-6 bg-primary border border-secondary/20 rounded-lg">
                        <h3 className="font-heading text-lg font-bold text-accent mb-2">{principle.title}</h3>
                        <p className="font-paragraph text-sm text-foreground/70">{principle.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-16">
                  <h2 className="font-heading text-2xl font-bold text-primary mb-8">Language Features</h2>
                  <div className="space-y-4">
                    {[
                      { name: 'Sketches', desc: 'Define 2D profiles with explicit constraints' },
                      { name: 'Features', desc: 'Parametric operations (Pad, Pocket, Hole, etc.)' },
                      { name: 'Assemblies', desc: 'Combine parts with defined relationships' },
                      { name: 'Constraints', desc: 'Geometric and dimensional constraints' },
                    ].map((feature, idx) => (
                      <div key={idx} className="p-4 bg-primary border border-secondary/20 rounded-lg flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-heading font-bold text-foreground">{feature.name}</h3>
                          <p className="font-paragraph text-sm text-foreground/70">{feature.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* API Reference Tab */}
          {activeTab === 'api' && (
            <motion.section
              key="api"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-[120rem] mx-auto px-[8%] py-20"
            >
              <div className="max-w-5xl">
                <div className="mb-16">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 bg-accent" />
                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-secondary-foreground/70">
                      REST API Specification
                    </span>
                  </div>
                  <h1 className="font-heading text-5xl font-bold text-primary mb-4">
                    API Reference
                  </h1>
                  <p className="font-paragraph text-lg text-foreground/70 max-w-3xl">
                    Complete API documentation for design compilation and integration.
                  </p>
                </div>

                <div className="mb-12 p-6 border border-accent/20 bg-accent/5 rounded">
                  <div className="flex gap-3">
                    <Server className="w-6 h-6 text-accent shrink-0 mt-1" />
                    <div>
                      <h3 className="font-heading text-lg text-primary mb-2">API Specification Defined</h3>
                      <p className="font-paragraph text-base text-foreground/80">
                        The following API contract is defined for backend implementation. Execution backend runs locally or in private infrastructure. No public endpoints are currently available.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-12">
                  <h2 className="font-heading text-2xl font-bold text-primary mb-6">Base URL</h2>
                  <div className="bg-json-background p-4 rounded border border-secondary/20 font-mono text-sm">
                    <code className="text-foreground">https://api.aeroforge.local/v1</code>
                  </div>
                  <p className="font-paragraph text-sm text-foreground/70 mt-3">
                    Private infrastructure. Authentication via API key in Authorization header.
                  </p>
                </div>

                <div className="mb-12">
                  <h2 className="font-heading text-2xl font-bold text-primary mb-6">Endpoints</h2>
                  <div className="space-y-6">
                    {[
                      {
                        method: 'POST',
                        path: '/compile',
                        desc: 'Compile design from DSL input',
                        params: 'input (string), units (mm|cm|in|ft)',
                      },
                      {
                        method: 'GET',
                        path: '/validate/:designId',
                        desc: 'Validate compiled design',
                        params: 'designId (string)',
                      },
                      {
                        method: 'POST',
                        path: '/export',
                        desc: 'Export design to CAD format',
                        params: 'designId (string), format (step|iges|stl)',
                      },
                    ].map((endpoint, idx) => (
                      <div key={idx} className="p-6 bg-primary border border-secondary/20 rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`px-3 py-1 rounded font-mono text-xs font-bold ${
                            endpoint.method === 'POST' ? 'bg-accent/20 text-accent' : 'bg-aerospace-success/20 text-aerospace-success'
                          }`}>
                            {endpoint.method}
                          </span>
                          <code className="font-mono text-sm text-foreground">{endpoint.path}</code>
                        </div>
                        <p className="font-paragraph text-sm text-foreground/70 mb-3">{endpoint.desc}</p>
                        <p className="font-mono text-xs text-foreground/60">Parameters: {endpoint.params}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* Results Tab */}
          {activeTab === 'results' && (
            <motion.section
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-[120rem] mx-auto px-[8%] py-20"
            >
              <div className="max-w-5xl">
                {!result ? (
                  <div className="text-center py-12">
                    <p className="font-paragraph text-base text-foreground mb-6">No compilation results available.</p>
                    <Link 
                      to="/tools"
                      className="inline-block bg-accent text-accent-foreground font-paragraph text-base font-semibold px-6 py-3 rounded transition-colors duration-200 hover:opacity-90"
                    >
                      Go to Tools
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Status */}
                    <div className={`p-6 rounded-lg border ${
                      isValid 
                        ? 'bg-aerospace-success/10 border-aerospace-success/30' 
                        : 'bg-aerospace-danger/10 border-aerospace-danger/30'
                    }`}>
                      <div className="flex items-center gap-3">
                        {isValid ? (
                          <CheckCircle2 className="w-6 h-6 text-aerospace-success" />
                        ) : (
                          <AlertTriangle className="w-6 h-6 text-aerospace-danger" />
                        )}
                        <div>
                          <h3 className="font-heading font-bold text-foreground">
                            {isValid ? 'Compilation Successful' : 'Compilation Failed'}
                          </h3>
                          <p className="font-paragraph text-sm text-foreground/70">
                            {isValid ? 'Design compiled without errors' : `${errors.length} error(s) found`}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Errors */}
                    {errors.length > 0 && (
                      <div>
                        <h3 className="font-heading text-lg font-bold text-foreground mb-4">Errors</h3>
                        <div className="space-y-2">
                          {errors.map((error, idx) => (
                            <div key={idx} className="p-4 bg-aerospace-danger/10 border border-aerospace-danger/30 rounded-lg flex items-start gap-3">
                              <X className="w-5 h-5 text-aerospace-danger flex-shrink-0 mt-0.5" />
                              <p className="font-paragraph text-sm text-foreground/80">{error}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Warnings */}
                    {warnings && warnings.length > 0 && (
                      <div>
                        <h3 className="font-heading text-lg font-bold text-foreground mb-4">Warnings</h3>
                        <div className="space-y-2">
                          {warnings.map((warning, idx) => (
                            <div key={idx} className="p-4 bg-aerospace-warning/10 border border-aerospace-warning/30 rounded-lg flex items-start gap-3">
                              <AlertCircle className="w-5 h-5 text-aerospace-warning flex-shrink-0 mt-0.5" />
                              <p className="font-paragraph text-sm text-foreground/80">{warning}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* JSON Output */}
                    {dsl && (
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-heading text-lg font-bold text-foreground">Compiled DSL</h3>
                          <div className="flex gap-2">
                            <button
                              onClick={handleCopy}
                              className="px-3 py-2 bg-secondary/20 hover:bg-secondary/30 text-foreground rounded transition-colors flex items-center gap-2"
                            >
                              <Copy className="w-4 h-4" />
                              {copied ? 'Copied!' : 'Copy'}
                            </button>
                            <button
                              onClick={handleDownload}
                              className="px-3 py-2 bg-accent/20 hover:bg-accent/30 text-accent rounded transition-colors flex items-center gap-2"
                            >
                              <Download className="w-4 h-4" />
                              Download
                            </button>
                          </div>
                        </div>
                        <pre className="bg-json-background p-4 rounded border border-secondary/20 overflow-x-auto text-sm text-foreground font-mono max-h-96">
                          {jsonString}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
