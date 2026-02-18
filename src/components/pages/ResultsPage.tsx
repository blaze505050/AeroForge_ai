import { useLocation, Link } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Check, X, Download, Copy } from 'lucide-react';

export default function ResultsPage() {
  const location = useLocation();
  const { result, isValid, errors: passedErrors, warnings } = location.state || { result: null, isValid: false, errors: [], warnings: [] };
  const [copied, setCopied] = useState(false);

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

  const jsonString = JSON.stringify(result, null, 2);

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aeroforge-output-${Date.now()}.json`;
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

  const errors = passedErrors || (result?.errors) || (result?.error ? [result.error] : []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="w-full max-w-[120rem] mx-auto px-[8%] py-20">
          <div className="max-w-5xl">
            <h1 className="font-heading text-4xl text-foreground mb-3">
              Compilation Results
            </h1>
            
            {/* Validation Status */}
            <div className="flex items-center gap-3 mb-8">
              <span className="font-paragraph text-base font-medium text-foreground">
                Validation Status:
              </span>
              {isValid ? (
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="font-paragraph text-base font-semibold text-green-600">PASS</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <X className="w-5 h-5 text-destructive" />
                  <span className="font-paragraph text-base font-semibold text-destructive">FAIL</span>
                </div>
              )}
            </div>

            {/* Error List */}
            {errors.length > 0 && (
              <div className="mb-8">
                <h2 className="font-heading text-xl text-destructive mb-4">Errors</h2>
                <ul className="space-y-2">
                  {errors.map((error: string, index: number) => (
                    <li key={index} className="font-paragraph text-base text-foreground">
                      • {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Warnings List */}
            {warnings && warnings.length > 0 && (
              <div className="mb-8">
                <h2 className="font-heading text-xl text-yellow-600 mb-4">Warnings</h2>
                <ul className="space-y-2">
                  {warnings.map((warning: string, index: number) => (
                    <li key={index} className="font-paragraph text-base text-foreground">
                      ⚠ {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 bg-primary text-primary-foreground font-paragraph text-base font-semibold px-6 py-3 rounded transition-colors duration-200 hover:opacity-90"
              >
                <Download className="w-4 h-4" />
                Download JSON
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

            {/* JSON Viewer */}
            <div className="bg-json-background p-6 rounded overflow-auto max-h-[600px]">
              <pre className="font-mono text-sm text-foreground whitespace-pre">
                {jsonString}
              </pre>
            </div>

            {/* Back to Compiler */}
            <div className="mt-8">
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
