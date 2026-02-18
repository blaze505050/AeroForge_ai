import { useLocation, Link } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Check, X, Download, Copy, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AeroForgeDSL, ExecutionLog } from '@/services/dslSchema';

export default function ResultsPage() {
  const location = useLocation();
  const { result, isValid, errors: passedErrors, warnings, executionLog } = location.state || { 
    result: null, 
    isValid: false, 
    errors: [], 
    warnings: [],
    executionLog: []
  };
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'dsl' | 'validation' | 'execution'>('dsl');

  if (!result) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="font-paragraph text-base text-foreground mb-6">No compilation results available.</p>
            <Link 
              to="/compiler"
              className="inline-block bg-accent text-accent-foreground font-paragraph text-base font-semibold px-6 py-3 rounded transition-colors duration-200 hover:opacity-90"
            >
              Go to Compiler
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const dsl = result as AeroForgeDSL;
  const jsonString = JSON.stringify(result, null, 2);
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

  const handleCopy = async () => {
    await navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="w-full max-w-[120rem] mx-auto px-[8%] py-20">
          <div className="max-w-6xl">
            {/* Header */}
            <div className="mb-12">
              <h1 className="font-heading text-4xl text-foreground mb-3">
                Compilation Results
              </h1>
              <p className="font-paragraph text-base text-foreground/70">
                AeroForge DSL v{dsl.version} • {dsl.units.toUpperCase()} • {dsl.features?.length || 0} features
              </p>
            </div>

            {/* Validation Status Panel */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
              {/* Overall Status */}
              <div className="border border-secondary/20 p-6 rounded bg-background">
                <div className="flex items-center gap-3 mb-2">
                  {isValid ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-destructive" />
                  )}
                  <span className="font-mono text-xs uppercase tracking-widest text-foreground/60">
                    Validation Status
                  </span>
                </div>
                <div className={`font-heading text-2xl font-bold ${isValid ? 'text-green-600' : 'text-destructive'}`}>
                  {isValid ? 'PASS' : 'FAIL'}
                </div>
              </div>

              {/* Features Count */}
              <div className="border border-secondary/20 p-6 rounded bg-background">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-xs uppercase tracking-widest text-foreground/60">
                    Features
                  </span>
                </div>
                <div className="font-heading text-2xl font-bold text-primary">
                  {dsl.features?.length || 0}
                </div>
              </div>

              {/* Constraints Count */}
              <div className="border border-secondary/20 p-6 rounded bg-background">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-xs uppercase tracking-widest text-foreground/60">
                    Constraints
                  </span>
                </div>
                <div className="font-heading text-2xl font-bold text-primary">
                  {dsl.constraints?.length || 0}
                </div>
              </div>
            </div>

            {/* Error/Warning Summary */}
            {errors.length > 0 && (
              <div className="mb-8 p-6 border border-destructive/20 bg-destructive/5 rounded">
                <h2 className="font-heading text-lg text-destructive mb-4 flex items-center gap-2">
                  <X className="w-5 h-5" />
                  Compilation Errors ({errors.length})
                </h2>
                <ul className="space-y-2">
                  {errors.map((error: string, index: number) => (
                    <li key={index} className="font-paragraph text-sm text-foreground">
                      • {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {warnings && warnings.length > 0 && (
              <div className="mb-8 p-6 border border-yellow-600/20 bg-yellow-600/5 rounded">
                <h2 className="font-heading text-lg text-yellow-600 mb-4">
                  Warnings ({warnings.length})
                </h2>
                <ul className="space-y-2">
                  {warnings.map((warning: string, index: number) => (
                    <li key={index} className="font-paragraph text-sm text-foreground">
                      ⚠ {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 bg-primary text-primary-foreground font-paragraph text-base font-semibold px-6 py-3 rounded transition-colors duration-200 hover:opacity-90"
              >
                <Download className="w-4 h-4" />
                Download DSL
              </button>
              <div className="relative">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 bg-transparent text-primary border border-primary font-paragraph text-base font-semibold px-6 py-3 rounded transition-colors duration-200 hover:bg-primary hover:text-primary-foreground"
                >
                  <Copy className="w-4 h-4" />
                  {copied ? 'Copied!' : 'Copy JSON'}
                </button>
                <AnimatePresence>
                  {copied && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-green-600 text-white font-paragraph text-sm font-semibold px-4 py-2 rounded whitespace-nowrap"
                    >
                      ✓ Copied to clipboard!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-6 flex gap-4 border-b border-secondary/20">
              <button
                onClick={() => setActiveTab('dsl')}
                className={`pb-4 font-paragraph text-base font-medium transition-colors ${
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
                  className={`pb-4 font-paragraph text-base font-medium transition-colors ${
                    activeTab === 'validation' 
                      ? 'text-primary border-b-2 border-primary' 
                      : 'text-foreground/60 hover:text-foreground'
                  }`}
                >
                  Validation ({dsl.validationResults.length})
                </button>
              )}
              {executionLog && executionLog.length > 0 && (
                <button
                  onClick={() => setActiveTab('execution')}
                  className={`pb-4 font-paragraph text-base font-medium transition-colors ${
                    activeTab === 'execution' 
                      ? 'text-primary border-b-2 border-primary' 
                      : 'text-foreground/60 hover:text-foreground'
                  }`}
                >
                  Execution Log ({executionLog.length})
                </button>
              )}
            </div>

            {/* Tab Content */}
            {activeTab === 'dsl' && (
              <div className="bg-json-background p-6 rounded overflow-auto max-h-[600px] border border-secondary/20">
                <pre className="font-mono text-xs text-foreground whitespace-pre">
                  {jsonString}
                </pre>
              </div>
            )}

            {activeTab === 'validation' && dsl.validationResults && (
              <div className="space-y-4">
                {dsl.validationResults.map((result, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded border ${
                      result.severity === 'ERROR' 
                        ? 'border-destructive/20 bg-destructive/5' 
                        : result.severity === 'WARNING'
                        ? 'border-yellow-600/20 bg-yellow-600/5'
                        : 'border-secondary/20 bg-secondary/5'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 ${
                        result.severity === 'ERROR' ? 'text-destructive' :
                        result.severity === 'WARNING' ? 'text-yellow-600' :
                        'text-blue-600'
                      }`}>
                        {result.severity === 'ERROR' ? <X className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <div className="font-mono text-xs uppercase tracking-widest text-foreground/60 mb-1">
                          {result.type}
                        </div>
                        <p className="font-paragraph text-sm text-foreground mb-2">
                          {result.message}
                        </p>
                        {result.suggestion && (
                          <p className="font-paragraph text-xs text-foreground/70 italic">
                            💡 {result.suggestion}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'execution' && executionLog && (
              <div className="space-y-3">
                {executionLog.map((log: ExecutionLog, index: number) => (
                  <div key={index} className="p-4 border border-secondary/20 bg-background rounded">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-mono text-xs uppercase tracking-widest text-foreground/60">
                          {log.featureName}
                        </div>
                        <p className="font-paragraph text-sm text-foreground">
                          {log.operation}
                        </p>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-mono font-semibold ${
                        log.status === 'SUCCESS' 
                          ? 'bg-green-600/10 text-green-600'
                          : 'bg-destructive/10 text-destructive'
                      }`}>
                        {log.status}
                      </div>
                    </div>
                    <div className="text-xs text-foreground/60 space-y-1">
                      <div>⏱ {new Date(log.timestamp).toLocaleTimeString()}</div>
                      {log.geometryHash && <div>🔐 Hash: {log.geometryHash}</div>}
                      {log.notes && <div>📝 {log.notes}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Back to Compiler */}
            <div className="mt-12">
              <Link 
                to="/compiler"
                className="inline-block text-primary font-paragraph text-base font-medium hover:underline"
              >
                ← Back to Compiler
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
