import { useState, useEffect } from 'react';
import { BaseCrudService } from '@/integrations';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { TrendingUp, DollarSign, Briefcase } from 'lucide-react';
import { Image } from '@/components/ui/image';

interface CaseStudy {
  _id: string;
  projectName?: string;
  clientName?: string;
  industrySector?: string;
  projectOverview?: string;
  keyChallenge?: string;
  solutionImplemented?: string;
  performanceImprovement?: number;
  costReduction?: number;
  mainProjectImage?: string;
  beforeImage?: string;
  afterImage?: string;
}

export default function CaseStudiesPage() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStudy, setSelectedStudy] = useState<CaseStudy | null>(null);

  useEffect(() => {
    loadCaseStudies();
  }, []);

  const loadCaseStudies = async () => {
    try {
      setIsLoading(true);
      const result = await BaseCrudService.getAll<CaseStudy>('casestudies', [], { limit: 50 });
      setCaseStudies(result.items || []);
      if (result.items && result.items.length > 0) {
        setSelectedStudy(result.items[0]);
      }
    } catch (error) {
      console.error('Failed to load case studies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalImprovement = caseStudies.reduce((sum, cs) => sum + (cs.performanceImprovement || 0), 0);
  const totalCostReduction = caseStudies.reduce((sum, cs) => sum + (cs.costReduction || 0), 0);

  return (
    <div className="min-h-screen bg-aerospace-dark text-foreground flex flex-col">
      <Header />
      
      <main className="flex-1 w-full max-w-[100rem] mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="mb-16">
          <h1 className="font-heading text-6xl font-bold mb-4 text-aerospace-blue">Case Studies</h1>
          <p className="font-paragraph text-xl text-secondary-foreground max-w-2xl">
            Explore real aerospace projects showcasing our expertise, innovation, and measurable results across diverse industries.
          </p>
        </div>

        {/* Impact Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-primary border border-aerospace-accent/20 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="font-heading text-3xl font-bold text-aerospace-blue">{caseStudies.length}</p>
              <Briefcase className="text-aerospace-accent" size={32} />
            </div>
            <p className="font-paragraph text-secondary-foreground">Completed Projects</p>
          </div>

          <div className="bg-primary border border-aerospace-success/20 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="font-heading text-3xl font-bold text-aerospace-success">
                {totalImprovement.toFixed(0)}%
              </p>
              <TrendingUp className="text-aerospace-success" size={32} />
            </div>
            <p className="font-paragraph text-secondary-foreground">Avg Performance Improvement</p>
          </div>

          <div className="bg-primary border border-aerospace-warning/20 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="font-heading text-3xl font-bold text-aerospace-warning">
                ${(totalCostReduction / 1000000).toFixed(1)}M
              </p>
              <DollarSign className="text-aerospace-warning" size={32} />
            </div>
            <p className="font-paragraph text-secondary-foreground">Total Cost Reduction</p>
          </div>
        </div>

        {/* Case Studies Section */}
        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <LoadingSpinner />
          </div>
        ) : caseStudies.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Case Studies List */}
            <div className="lg:col-span-1">
              <h3 className="font-heading text-xl font-bold text-aerospace-blue mb-4">Projects</h3>
              <div className="space-y-3">
                {caseStudies.map(study => (
                  <button
                    key={study._id}
                    onClick={() => setSelectedStudy(study)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      selectedStudy?._id === study._id
                        ? 'bg-aerospace-blue/20 border-aerospace-blue'
                        : 'bg-primary border-aerospace-accent/20 hover:border-aerospace-accent/50'
                    }`}
                  >
                    <p className="font-heading font-semibold text-foreground line-clamp-2">
                      {study.projectName || 'Unnamed Project'}
                    </p>
                    {study.clientName && (
                      <p className="font-paragraph text-xs text-secondary-foreground mt-1">
                        {study.clientName}
                      </p>
                    )}
                    {study.industrySector && (
                      <p className="font-paragraph text-xs text-aerospace-accent mt-1">
                        {study.industrySector}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Case Study Detail */}
            <div className="lg:col-span-2">
              {selectedStudy ? (
                <div className="space-y-6">
                  {/* Main Image */}
                  {selectedStudy.mainProjectImage && (
                    <div className="rounded-lg overflow-hidden h-64 bg-aerospace-dark">
                      <Image
                        src={selectedStudy.mainProjectImage}
                        alt={selectedStudy.projectName || 'Project'}
                        width={600}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Project Header */}
                  <div>
                    <h2 className="font-heading text-3xl font-bold text-aerospace-blue mb-2">
                      {selectedStudy.projectName || 'Unnamed Project'}
                    </h2>
                    <div className="flex flex-wrap gap-4 text-sm">
                      {selectedStudy.clientName && (
                        <div>
                          <p className="font-paragraph text-secondary-foreground">Client</p>
                          <p className="font-heading font-semibold text-foreground">{selectedStudy.clientName}</p>
                        </div>
                      )}
                      {selectedStudy.industrySector && (
                        <div>
                          <p className="font-paragraph text-secondary-foreground">Industry</p>
                          <p className="font-heading font-semibold text-foreground">{selectedStudy.industrySector}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Overview */}
                  {selectedStudy.projectOverview && (
                    <div>
                      <h3 className="font-heading text-lg font-semibold text-aerospace-accent mb-2">Overview</h3>
                      <p className="font-paragraph text-secondary-foreground">
                        {selectedStudy.projectOverview}
                      </p>
                    </div>
                  )}

                  {/* Challenge & Solution */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedStudy.keyChallenge && (
                      <div className="bg-primary border border-aerospace-danger/20 rounded-lg p-4">
                        <h4 className="font-heading font-semibold text-aerospace-danger mb-2">Challenge</h4>
                        <p className="font-paragraph text-sm text-secondary-foreground">
                          {selectedStudy.keyChallenge}
                        </p>
                      </div>
                    )}
                    {selectedStudy.solutionImplemented && (
                      <div className="bg-primary border border-aerospace-success/20 rounded-lg p-4">
                        <h4 className="font-heading font-semibold text-aerospace-success mb-2">Solution</h4>
                        <p className="font-paragraph text-sm text-secondary-foreground">
                          {selectedStudy.solutionImplemented}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Results */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedStudy.performanceImprovement !== undefined && (
                      <div className="bg-aerospace-success/10 border border-aerospace-success/30 rounded-lg p-6">
                        <p className="font-paragraph text-sm text-secondary-foreground mb-2">Performance Improvement</p>
                        <p className="font-heading text-3xl font-bold text-aerospace-success">
                          {selectedStudy.performanceImprovement}%
                        </p>
                      </div>
                    )}
                    {selectedStudy.costReduction !== undefined && (
                      <div className="bg-aerospace-warning/10 border border-aerospace-warning/30 rounded-lg p-6">
                        <p className="font-paragraph text-sm text-secondary-foreground mb-2">Cost Reduction</p>
                        <p className="font-heading text-3xl font-bold text-aerospace-warning">
                          ${(selectedStudy.costReduction / 1000000).toFixed(1)}M
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Before/After Comparison */}
                  {(selectedStudy.beforeImage || selectedStudy.afterImage) && (
                    <div>
                      <h3 className="font-heading text-lg font-semibold text-aerospace-accent mb-4">
                        Before & After
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedStudy.beforeImage && (
                          <div>
                            <p className="font-paragraph text-sm text-secondary-foreground mb-2">Before</p>
                            <div className="rounded-lg overflow-hidden h-48 bg-aerospace-dark">
                              <Image
                                src={selectedStudy.beforeImage}
                                alt="Before"
                                width={300}
                                height={200}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        )}
                        {selectedStudy.afterImage && (
                          <div>
                            <p className="font-paragraph text-sm text-secondary-foreground mb-2">After</p>
                            <div className="rounded-lg overflow-hidden h-48 bg-aerospace-dark">
                              <Image
                                src={selectedStudy.afterImage}
                                alt="After"
                                width={300}
                                height={200}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="font-paragraph text-secondary-foreground">Select a case study to view details</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="font-paragraph text-secondary-foreground text-lg">
              No case studies found.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
