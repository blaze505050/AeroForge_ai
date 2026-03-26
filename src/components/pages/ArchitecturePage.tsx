import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { CorePhilosophy, ArchitecturePrinciples, AntiGoals } from '@/entities';

export default function ArchitecturePage() {
  const [philosophies, setPhilosophies] = useState<CorePhilosophy[]>([]);
  const [principles, setPrinciples] = useState<ArchitecturePrinciples[]>([]);
  const [antiGoals, setAntiGoals] = useState<AntiGoals[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

      // Sort philosophies by displayOrder
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="w-full max-w-[120rem] mx-auto px-[8%] py-20">
          <div className="max-w-5xl min-h-[400px]">
            <h1 className="font-heading text-4xl text-foreground mb-3">
              How It Works
            </h1>
            <p className="font-paragraph text-base text-foreground mb-12">
              Understanding the AeroForge design compilation system and its deterministic approach.
            </p>

            {isLoading ? null : (
              <>
                {/* Core Philosophy */}
                {philosophies.length > 0 && (
                  <div className="mb-16">
                    <h2 className="font-heading text-3xl text-primary mb-8">Core Philosophy</h2>
                    <div className="space-y-6">
                      {philosophies.map((philosophy) => (
                        <div key={philosophy._id}>
                          <h3 className="font-heading text-xl text-foreground mb-2">
                            {philosophy.philosophyTitle}
                          </h3>
                          <p className="font-paragraph text-base text-foreground leading-relaxed">
                            {philosophy.description}
                          </p>
                          {philosophy.emphasisKeyword && (
                            <p className="font-paragraph text-sm text-primary mt-2 font-medium">
                              Key: {philosophy.emphasisKeyword}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Architecture Diagram */}
                <div className="mb-16">
                  <h2 className="font-heading text-3xl text-primary mb-8">Design Process</h2>
                  <div className="bg-json-background p-8 font-mono text-sm text-foreground leading-relaxed">
                    <pre className="whitespace-pre">
{`[ Natural Language Input ]
         ↓
[ Cloud Reasoning Layer ]
  • FastAPI Backend
  • AI Intent Analysis
  • JSON DSL Generation
  • Pydantic Validation
  • DFM Rule Checks
         ↓
[ Validated JSON Feature DSL ]
         ↓
[ Local Deterministic Interpreter ]
  • CadQuery / Fusion 360 API
  • Sequential Execution
  • No Heuristics
         ↓
[ Parametric CAD Geometry ]`}
                    </pre>
                  </div>
                </div>

                {/* Architecture Principles */}
                {principles.length > 0 && (
                  <div className="mb-16">
                    <h2 className="font-heading text-3xl text-primary mb-8">Architecture Principles</h2>
                    <div className="space-y-8">
                      {principles.map((principle) => (
                        <div key={principle._id}>
                          <h3 className="font-heading text-xl text-foreground mb-3">
                            {principle.principleTitle}
                          </h3>
                          <p className="font-paragraph text-base text-foreground leading-relaxed mb-3">
                            {principle.detailedExplanation}
                          </p>
                          {principle.analogyUsed && (
                            <p className="font-paragraph text-sm text-secondary-foreground italic">
                              Analogy: {principle.analogyUsed}
                            </p>
                          )}
                          {principle.keyConcepts && (
                            <p className="font-paragraph text-sm text-foreground mt-2">
                              <strong>Key Concepts:</strong> {principle.keyConcepts}
                            </p>
                          )}
                          {principle.diagramText && (
                            <div className="bg-json-background p-4 mt-3 font-mono text-xs text-foreground">
                              <pre className="whitespace-pre-wrap">{principle.diagramText}</pre>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Anti-Goals */}
                {antiGoals.length > 0 && (
                  <div className="mb-16">
                    <h2 className="font-heading text-3xl text-primary mb-8">Explicit Anti-Goals</h2>
                    <p className="font-paragraph text-base text-foreground mb-6">
                      What this system explicitly does NOT do:
                    </p>
                    <div className="space-y-6">
                      {antiGoals.map((antiGoal) => (
                        <div key={antiGoal._id} className="border-l-4 border-destructive pl-6">
                          <h3 className="font-heading text-lg text-destructive mb-2">
                            ❌ {antiGoal.statement}
                          </h3>
                          {antiGoal.rationale && (
                            <p className="font-paragraph text-base text-foreground mb-2">
                              <strong>Rationale:</strong> {antiGoal.rationale}
                            </p>
                          )}
                          {antiGoal.consequence && (
                            <p className="font-paragraph text-sm text-secondary-foreground">
                              <strong>Consequence:</strong> {antiGoal.consequence}
                            </p>
                          )}
                          {antiGoal.category && (
                            <p className="font-paragraph text-xs text-secondary mt-2">
                              Category: {antiGoal.category}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
