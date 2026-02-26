import { useState, useEffect } from 'react';
import { BaseCrudService } from '@/integrations';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Search, BookOpen, Zap } from 'lucide-react';
import { Image } from '@/components/ui/image';

interface KnowledgeArticle {
  _id: string;
  title?: string;
  summary?: string;
  content?: string;
  category?: string;
  subcategory?: string;
  difficultyLevel?: string;
  publicationDate?: Date | string;
  author?: string;
  mainImage?: string;
  relatedTopics?: string;
}

export default function KnowledgeBasePage() {
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setIsLoading(true);
      const result = await BaseCrudService.getAll<KnowledgeArticle>('knowledgebasearticles', [], { limit: 100 });
      setArticles(result.items || []);
    } catch (error) {
      console.error('Failed to load knowledge base articles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.content?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || article.difficultyLevel === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const categories = Array.from(new Set(articles.map(a => a.category).filter(Boolean))) as string[];
  const difficulties = Array.from(new Set(articles.map(a => a.difficultyLevel).filter(Boolean))) as string[];

  const getDifficultyColor = (level?: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-aerospace-success/20 text-aerospace-success';
      case 'Intermediate':
        return 'bg-aerospace-warning/20 text-aerospace-warning';
      case 'Advanced':
        return 'bg-aerospace-danger/20 text-aerospace-danger';
      default:
        return 'bg-aerospace-accent/20 text-aerospace-accent';
    }
  };

  return (
    <div className="min-h-screen bg-aerospace-dark text-foreground flex flex-col">
      <Header />
      
      <main className="flex-1 w-full max-w-[100rem] mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="mb-16">
          <h1 className="font-heading text-6xl font-bold mb-4 text-aerospace-blue">Knowledge Base</h1>
          <p className="font-paragraph text-xl text-secondary-foreground max-w-2xl">
            Master aerospace fundamentals, CFD theory, and design principles with our comprehensive learning resources.
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-12">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-3 text-aerospace-accent" size={20} />
            <Input
              type="text"
              placeholder="Search articles by title or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-3 bg-primary border-aerospace-accent/30 text-foreground placeholder:text-secondary-foreground"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="font-paragraph text-sm font-semibold text-secondary-foreground mb-3">Category</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => setSelectedCategory('all')}
                  size="sm"
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  className={selectedCategory === 'all' ? 'bg-aerospace-blue hover:bg-aerospace-accent' : ''}
                >
                  All
                </Button>
                {categories.map(cat => (
                  <Button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    size="sm"
                    variant={selectedCategory === cat ? 'default' : 'outline'}
                    className={selectedCategory === cat ? 'bg-aerospace-blue hover:bg-aerospace-accent' : ''}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <p className="font-paragraph text-sm font-semibold text-secondary-foreground mb-3">Difficulty</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => setSelectedDifficulty('all')}
                  size="sm"
                  variant={selectedDifficulty === 'all' ? 'default' : 'outline'}
                  className={selectedDifficulty === 'all' ? 'bg-aerospace-blue hover:bg-aerospace-accent' : ''}
                >
                  All
                </Button>
                {difficulties.map(diff => (
                  <Button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    size="sm"
                    variant={selectedDifficulty === diff ? 'default' : 'outline'}
                    className={selectedDifficulty === diff ? 'bg-aerospace-blue hover:bg-aerospace-accent' : ''}
                  >
                    {diff}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="min-h-96">
          {isLoading ? (
            <div className="flex justify-center items-center h-96">
              <LoadingSpinner />
            </div>
          ) : filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredArticles.map(article => (
                <div
                  key={article._id}
                  className="bg-primary border border-aerospace-accent/20 rounded-lg overflow-hidden hover:border-aerospace-accent/50 transition-colors"
                >
                  {article.mainImage && (
                    <div className="h-48 overflow-hidden bg-aerospace-dark">
                      <Image
                        src={article.mainImage}
                        alt={article.title || 'Article'}
                        width={400}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-heading text-lg font-semibold text-aerospace-blue flex-1">
                        {article.title || 'Untitled Article'}
                      </h3>
                      {article.difficultyLevel && (
                        <span className={`text-xs px-3 py-1 rounded-full whitespace-nowrap ml-2 ${getDifficultyColor(article.difficultyLevel)}`}>
                          {article.difficultyLevel}
                        </span>
                      )}
                    </div>

                    {article.category && (
                      <p className="font-paragraph text-xs text-aerospace-accent mb-2">
                        {article.category}
                        {article.subcategory && ` • ${article.subcategory}`}
                      </p>
                    )}

                    <p className="font-paragraph text-sm text-secondary-foreground mb-4 line-clamp-3">
                      {article.summary || article.content || 'No summary available'}
                    </p>

                    <div className="flex items-center justify-between text-xs text-secondary-foreground">
                      <div>
                        {article.author && <span>{article.author}</span>}
                        {article.publicationDate && (
                          <span className="ml-2">
                            {new Date(article.publicationDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <BookOpen size={16} className="text-aerospace-accent" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Zap className="mx-auto mb-4 text-aerospace-accent" size={48} />
              <p className="font-paragraph text-secondary-foreground text-lg">
                No articles found matching your criteria.
              </p>
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-primary border border-aerospace-accent/20 rounded-lg p-6 text-center">
            <p className="font-heading text-3xl font-bold text-aerospace-blue mb-2">
              {articles.length}
            </p>
            <p className="font-paragraph text-secondary-foreground">Total Articles</p>
          </div>
          <div className="bg-primary border border-aerospace-accent/20 rounded-lg p-6 text-center">
            <p className="font-heading text-3xl font-bold text-aerospace-accent mb-2">
              {categories.length}
            </p>
            <p className="font-paragraph text-secondary-foreground">Categories</p>
          </div>
          <div className="bg-primary border border-aerospace-accent/20 rounded-lg p-6 text-center">
            <p className="font-heading text-3xl font-bold text-aerospace-success mb-2">
              {difficulties.length}
            </p>
            <p className="font-paragraph text-secondary-foreground">Difficulty Levels</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
