import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Zap, TrendingUp, Gauge, Layers, Code2, Rocket, CheckCircle2, AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PerformanceMonitor from '@/components/PerformanceMonitor';
import { useAdvancedFilter } from '@/hooks/useAdvancedFilter';

interface OptimizationTip {
  id: string;
  title: string;
  category: 'performance' | 'filtering' | 'integration';
  description: string;
  impact: 'high' | 'medium' | 'low';
  implementation: string;
  example: string;
}

const OPTIMIZATION_TIPS: OptimizationTip[] = [
  {
    id: '1',
    title: 'Debounced Search',
    category: 'performance',
    description: 'Reduce API calls by debouncing search input',
    impact: 'high',
    implementation: 'Use debounce utility from performanceOptimization service',
    example: 'const debouncedSearch = debounce((query) => onSearch(query), 300);',
  },
  {
    id: '2',
    title: 'Request Caching',
    category: 'performance',
    description: 'Cache API responses to minimize network requests',
    impact: 'high',
    implementation: 'Enable caching in integration handlers',
    example: 'const response = await handler.request(method, path, data, true);',
  },
  {
    id: '3',
    title: 'Advanced Filtering',
    category: 'filtering',
    description: 'Implement multi-criteria filtering with sorting',
    impact: 'high',
    implementation: 'Use FilterEngine and QueryBuilder from advancedFilteringService',
    example: 'const filtered = FilterEngine.filter(items, filters);',
  },
  {
    id: '4',
    title: 'Fuzzy Search',
    category: 'filtering',
    description: 'Enable typo-tolerant search with fuzzy matching',
    impact: 'medium',
    implementation: 'Use SearchEngine with fuzzy option enabled',
    example: 'SearchEngine.search(items, { query, fields, fuzzy: true });',
  },
  {
    id: '5',
    title: 'Virtual Scrolling',
    category: 'performance',
    description: 'Render only visible items in large lists',
    impact: 'high',
    implementation: 'Use getVisibleRange utility for large datasets',
    example: 'const { visibleItems } = getVisibleRange(config);',
  },
  {
    id: '6',
    title: 'Rate Limiting',
    category: 'integration',
    description: 'Prevent API rate limit errors with built-in throttling',
    impact: 'medium',
    implementation: 'Use RateLimiter from integrationService',
    example: 'if (rateLimiter.isAllowed()) { /* make request */ }',
  },
  {
    id: '7',
    title: 'Data Synchronization',
    category: 'integration',
    description: 'Batch and sync data changes efficiently',
    impact: 'high',
    implementation: 'Use DataSyncService for queued operations',
    example: 'dataSyncService.queueSync(id, "update", data);',
  },
  {
    id: '8',
    title: 'Event Bus',
    category: 'integration',
    description: 'Decouple components with event-driven architecture',
    impact: 'medium',
    implementation: 'Use EventBus for inter-component communication',
    example: 'eventBus.emit("data-updated", newData);',
  },
];

export default function OptimizationPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const {
    items: filteredTips,
    addFilter,
    clearFilters,
    filters,
  } = useAdvancedFilter({
    items: OPTIMIZATION_TIPS,
    searchFields: ['title', 'description', 'implementation'],
    defaultPageSize: 12,
  });

  const categories = useMemo(
    () => [...new Set(OPTIMIZATION_TIPS.map((t) => t.category))],
    []
  );

  const impactColors = {
    high: 'text-aerospace-danger',
    medium: 'text-aerospace-warning',
    low: 'text-aerospace-success',
  };

  const impactBgColors = {
    high: 'bg-aerospace-danger/10',
    medium: 'bg-aerospace-warning/10',
    low: 'bg-aerospace-success/10',
  };

  return (
    <div className="min-h-screen bg-aerospace-dark text-foreground font-paragraph flex flex-col">
      <Header />
      <PerformanceMonitor />

      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="w-full py-24 bg-primary border-b border-secondary/20">
          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <Zap className="w-6 h-6 text-aerospace-blue" />
                <span className="font-mono text-sm uppercase tracking-widest text-aerospace-blue">
                  Performance & Integration
                </span>
              </div>
              <h1 className="font-heading text-5xl md:text-6xl font-bold text-foreground mb-6">
                Performance Tips
              </h1>
              <p className="font-paragraph text-xl text-secondary-foreground max-w-3xl mx-auto">
                Best practices for optimizing your design workflow and system performance.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filter Section */}
        <section className="w-full py-12 bg-aerospace-dark border-b border-secondary/20">
          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16">
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    if (selectedCategory === cat) {
                      setSelectedCategory(null);
                      clearFilters();
                    } else {
                      setSelectedCategory(cat);
                      clearFilters();
                      addFilter('category', 'equals', cat);
                    }
                  }}
                  className={`px-4 py-2 rounded-lg font-mono text-sm font-bold transition-all ${
                    selectedCategory === cat
                      ? 'bg-aerospace-blue text-aerospace-dark'
                      : 'bg-secondary/20 text-foreground hover:bg-secondary/30'
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
              {selectedCategory && (
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    clearFilters();
                  }}
                  className="px-4 py-2 bg-aerospace-blue/10 border border-aerospace-blue/30 text-aerospace-blue hover:bg-aerospace-blue/20 rounded-lg font-mono text-sm font-bold transition-all"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Tips Grid */}
        <section className="w-full py-24 bg-primary">
          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTips.map((tip, idx) => (
                <motion.div
                  key={tip.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="p-6 bg-aerospace-dark border border-aerospace-blue/20 rounded-lg hover:border-aerospace-blue/60 transition-all duration-300 group flex flex-col"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-aerospace-blue/15 rounded-lg group-hover:bg-aerospace-blue/30 transition-colors">
                      {tip.category === 'performance' && <Gauge className="w-6 h-6 text-aerospace-blue" />}
                      {tip.category === 'filtering' && <Layers className="w-6 h-6 text-aerospace-blue" />}
                      {tip.category === 'integration' && <Rocket className="w-6 h-6 text-aerospace-blue" />}
                    </div>
                    <span className={`font-mono text-xs px-2 py-1 rounded ${impactBgColors[tip.impact]} ${impactColors[tip.impact]}`}>
                      {tip.impact.toUpperCase()}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-heading text-lg font-bold text-foreground mb-2 group-hover:text-aerospace-blue transition-colors">
                    {tip.title}
                  </h3>

                  {/* Description */}
                  <p className="font-paragraph text-sm text-foreground/70 mb-4 flex-1">
                    {tip.description}
                  </p>

                  {/* Implementation */}
                  <div className="mb-4 pt-4 border-t border-secondary/20">
                    <p className="font-mono text-xs text-foreground/60 uppercase tracking-wider mb-2">
                      Implementation
                    </p>
                    <p className="font-mono text-xs text-aerospace-accent">
                      {tip.implementation}
                    </p>
                  </div>

                  {/* Example */}
                  <div className="p-3 bg-primary/50 border border-secondary/20 rounded">
                    <p className="font-mono text-xs text-foreground/70 break-all">
                      {tip.example}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredTips.length === 0 && (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-foreground/30 mx-auto mb-4" />
                <p className="text-foreground/60 text-lg">No tips found for this category.</p>
              </div>
            )}
          </div>
        </section>

        {/* Key Features Section */}
        <section className="w-full py-24 bg-aerospace-dark border-t border-secondary/20">
          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-aerospace-blue" />
                <span className="font-mono text-sm uppercase tracking-widest text-aerospace-blue">
                  Key Features
                </span>
              </div>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
                Built-in Optimization Tools
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: 'Performance Cache',
                  description: 'Automatic caching with TTL management',
                  features: ['Request caching', 'TTL management', 'Pattern-based clearing'],
                },
                {
                  title: 'Advanced Filtering',
                  description: 'Multi-criteria filtering with sorting',
                  features: ['Filter engine', 'Sort engine', 'Query builder'],
                },
                {
                  title: 'Search Capabilities',
                  description: 'Fuzzy matching and faceted search',
                  features: ['Fuzzy matching', 'Faceted search', 'Score calculation'],
                },
                {
                  title: 'Integration Services',
                  description: 'Seamless API integration with retry logic',
                  features: ['Retry logic', 'Rate limiting', 'Data sync'],
                },
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="p-8 bg-primary border border-aerospace-blue/20 rounded-lg hover:border-aerospace-blue/60 transition-all duration-300"
                >
                  <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="font-paragraph text-sm text-foreground/70 mb-4">
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-aerospace-success" />
                        <span className="text-foreground/80">{f}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
