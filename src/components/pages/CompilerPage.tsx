import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { compileDesign } from '@/services/compilerService';

export default function CompilerPage() {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [units, setUnits] = useState<'mm' | 'cm' | 'in' | 'ft'>('mm');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    
    setIsGenerating(true);
    
    try {
      const response = await compileDesign({
        input: input.trim(),
        units,
      });
      
      // Navigate to results page with the response data
      navigate('/results', { 
        state: { 
          result: response.dsl || { errors: response.errors },
          isValid: response.success,
          errors: response.errors,
          warnings: response.warnings,
          executionLog: response.executionLog,
        } 
      });
    } catch (error) {
      // Navigate to results page with error
      navigate('/results', { 
        state: { 
          result: { error: 'Failed to compile design. Please try again.' },
          isValid: false,
          errors: ['An unexpected error occurred during compilation.'],
        } 
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="w-full max-w-[120rem] mx-auto px-[8%] py-20">
          <div className="max-w-5xl">
            <h1 className="font-heading text-4xl text-foreground mb-3">
              Design Input
            </h1>
            <p className="font-paragraph text-base text-foreground mb-12">
              Describe your mechanical part in natural language. The compiler will generate a validated JSON Feature DSL v1.0.
            </p>

            <div className="space-y-6">
              {/* Text Input */}
              <div>
                <label htmlFor="design-input" className="block font-paragraph text-base font-medium text-foreground mb-3">
                  Describe your mechanical part
                </label>
                <textarea
                  id="design-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full h-64 px-4 py-3 border border-secondary rounded bg-background text-foreground font-paragraph text-base resize-none focus:outline-none focus:border-primary transition-colors duration-200"
                  placeholder="Example: Create a mounting bracket with two 6mm bolt holes spaced 50mm apart..."
                  disabled={isGenerating}
                />
              </div>

              {/* Units Dropdown */}
              <div>
                <label htmlFor="units" className="block font-paragraph text-base font-medium text-foreground mb-3">
                  Units
                </label>
                <select
                  id="units"
                  value={units}
                  onChange={(e) => setUnits(e.target.value as 'mm' | 'cm' | 'in' | 'ft')}
                  className="w-full px-4 py-3 border border-secondary rounded bg-background text-foreground font-paragraph text-base focus:outline-none focus:border-primary transition-colors duration-200"
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
                className="bg-accent text-accent-foreground font-paragraph text-base font-semibold px-6 py-3 rounded transition-colors duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
              >
                {isGenerating ? (
                  <>
                    <LoadingSpinner />
                    <span>Compiling...</span>
                  </>
                ) : (
                  'Compile Design'
                )}
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
