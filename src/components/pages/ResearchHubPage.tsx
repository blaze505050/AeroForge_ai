import { useState, useEffect } from 'react';
import { BaseCrudService } from '@/integrations';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Search, Download, ExternalLink } from 'lucide-react';

interface ResearchPaper {
  _id: string;
  title?: string;
  abstract?: string;
  authors?: string;
  arxivId?: string;
  ieeeId?: string;
  pdfUrl?: string;
  researchTopic?: string;
  publicationDate?: Date | string;
}

export default function ResearchHubPage() {
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');

  useEffect(() => {
    loadPapers();
  }, []);

  const loadPapers = async () => {
    try {
      setIsLoading(true);
      const result = await BaseCrudService.getAll<ResearchPaper>('researchpapers', [], { limit: 50 });
      setPapers(result.items || []);
    } catch (error) {
      console.error('Failed to load research papers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPapers = papers.filter(paper => {
    const matchesSearch = paper.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paper.abstract?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paper.authors?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTopic = selectedTopic === 'all' || paper.researchTopic === selectedTopic;
    return matchesSearch && matchesTopic;
  });

  const topics = Array.from(new Set(papers.map(p => p.researchTopic).filter(Boolean))) as string[];

  return (
    <div className="min-h-screen bg-aerospace-dark text-foreground flex flex-col">
      <Header />
      
      <main className="flex-1 w-full max-w-[100rem] mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="mb-16">
          <h1 className="font-heading text-6xl font-bold mb-4 text-aerospace-blue">Research Hub</h1>
          <p className="font-paragraph text-xl text-secondary-foreground max-w-2xl">
            Discover the latest aerospace research papers from arXiv and IEEE. Stay updated with cutting-edge developments in aerodynamics, CFD, materials science, and more.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-12 space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-3 text-aerospace-accent" size={20} />
            <Input
              type="text"
              placeholder="Search papers by title, authors, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-3 bg-primary border-aerospace-accent/30 text-foreground placeholder:text-secondary-foreground"
            />
          </div>

          {/* Topic Filter */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => setSelectedTopic('all')}
              variant={selectedTopic === 'all' ? 'default' : 'outline'}
              className={selectedTopic === 'all' ? 'bg-aerospace-blue hover:bg-aerospace-accent' : ''}
            >
              All Topics
            </Button>
            {topics.map(topic => (
              <Button
                key={topic}
                onClick={() => setSelectedTopic(topic)}
                variant={selectedTopic === topic ? 'default' : 'outline'}
                className={selectedTopic === topic ? 'bg-aerospace-blue hover:bg-aerospace-accent' : ''}
              >
                {topic}
              </Button>
            ))}
          </div>
        </div>

        {/* Papers Grid */}
        <div className="min-h-96">
          {isLoading ? (
            <div className="flex justify-center items-center h-96">
              <LoadingSpinner />
            </div>
          ) : filteredPapers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPapers.map(paper => (
                <div
                  key={paper._id}
                  className="bg-primary border border-aerospace-accent/20 rounded-lg p-6 hover:border-aerospace-accent/50 transition-colors"
                >
                  <div className="mb-4">
                    <h3 className="font-heading text-lg font-semibold text-aerospace-blue mb-2 line-clamp-2">
                      {paper.title || 'Untitled Paper'}
                    </h3>
                    {paper.researchTopic && (
                      <span className="inline-block bg-aerospace-accent/20 text-aerospace-accent text-xs px-3 py-1 rounded-full mb-3">
                        {paper.researchTopic}
                      </span>
                    )}
                  </div>

                  <p className="font-paragraph text-sm text-secondary-foreground mb-3 line-clamp-3">
                    {paper.abstract || 'No abstract available'}
                  </p>

                  {paper.authors && (
                    <p className="font-paragraph text-xs text-secondary-foreground mb-4">
                      <span className="font-semibold">Authors:</span> {paper.authors}
                    </p>
                  )}

                  {paper.publicationDate && (
                    <p className="font-paragraph text-xs text-secondary-foreground mb-4">
                      <span className="font-semibold">Published:</span> {new Date(paper.publicationDate).toLocaleDateString()}
                    </p>
                  )}

                  <div className="flex gap-2 flex-wrap">
                    {paper.arxivId && (
                      <a
                        href={`https://arxiv.org/abs/${paper.arxivId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs bg-aerospace-blue/20 hover:bg-aerospace-blue/30 text-aerospace-blue px-3 py-2 rounded transition-colors"
                      >
                        <ExternalLink size={14} />
                        arXiv
                      </a>
                    )}
                    {paper.ieeeId && (
                      <a
                        href={`https://ieeexplore.ieee.org/document/${paper.ieeeId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs bg-aerospace-accent/20 hover:bg-aerospace-accent/30 text-aerospace-accent px-3 py-2 rounded transition-colors"
                      >
                        <ExternalLink size={14} />
                        IEEE
                      </a>
                    )}
                    {paper.pdfUrl && (
                      <a
                        href={paper.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs bg-aerospace-success/20 hover:bg-aerospace-success/30 text-aerospace-success px-3 py-2 rounded transition-colors"
                      >
                        <Download size={14} />
                        PDF
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="font-paragraph text-secondary-foreground text-lg">
                No research papers found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
