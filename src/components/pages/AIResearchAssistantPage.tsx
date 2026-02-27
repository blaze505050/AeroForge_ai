import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Send,
  Search,
  Lightbulb,
  BookOpen,
  Zap,
  TrendingUp,
  Filter,
  Download,
  Copy,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Brain,
  GitBranch,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { ResearchPapers, AISuggestions } from '@/entities';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  references?: string[];
}

interface ResearchContext {
  topic: string;
  papers: ResearchPapers[];
  suggestions: AISuggestions[];
}

export default function AIResearchAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [context, setContext] = useState<ResearchContext>({
    topic: '',
    papers: [],
    suggestions: [],
  });
  const [selectedPaper, setSelectedPaper] = useState<ResearchPapers | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [conversationMode, setConversationMode] = useState<'chat' | 'research' | 'optimization'>('chat');

  useEffect(() => {
    const loadResearchData = async () => {
      try {
        const [papersResult, suggestionsResult] = await Promise.all([
          BaseCrudService.getAll<ResearchPapers>('researchpapers'),
          BaseCrudService.getAll<AISuggestions>('aisuggestions'),
        ]);

        setContext(prev => ({
          ...prev,
          papers: papersResult.items || [],
          suggestions: suggestionsResult.items || [],
        }));
      } catch (error) {
        console.error('Error loading research data:', error);
      }
    };

    loadResearchData();

    // Initial greeting
    setMessages([
      {
        id: '0',
        role: 'assistant',
        content:
          'Welcome to the AI Research Assistant! I can help you find optimization strategies, discover similar research papers, and accelerate your aerospace design process. What would you like to explore?',
        timestamp: new Date(),
      },
    ]);
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        optimization:
          'Based on your design parameters, I recommend using NSGA-III algorithm with a population size of 150. This will give you excellent convergence while maintaining computational efficiency. Consider implementing adaptive mutation rates for better exploration.',
        turbulence:
          'For your Reynolds number range, the k-omega SST model provides the best accuracy for boundary layer prediction. It shows 92% accuracy compared to experimental data and converges in ~800 iterations.',
        wing:
          'Wing design optimization typically focuses on three objectives: minimize weight, maximize lift coefficient, and minimize drag. I found 5 similar papers in our database that discuss multi-objective wing optimization.',
        fuselage:
          'For fuselage design, consider stress concentration factors at attachment points. The current design shows potential for 15% weight reduction through topology optimization.',
        default:
          'That\'s an interesting question! Based on current aerospace research trends, I recommend exploring multi-objective optimization approaches. Would you like me to suggest specific papers or optimization strategies?',
      };

      let response = responses.default;
      const lowerInput = inputValue.toLowerCase();

      if (lowerInput.includes('optim')) response = responses.optimization;
      else if (lowerInput.includes('turbulence') || lowerInput.includes('cfd'))
        response = responses.turbulence;
      else if (lowerInput.includes('wing')) response = responses.wing;
      else if (lowerInput.includes('fuselage')) response = responses.fuselage;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        suggestions: [
          'Show similar papers',
          'Explain in detail',
          'Show code example',
          'Save to workspace',
        ],
        references: context.papers.slice(0, 3).map(p => p.title || 'Untitled'),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const quickPrompts = [
    { icon: Lightbulb, text: 'Suggest optimization strategies', category: 'optimization' },
    { icon: BookOpen, text: 'Find similar research papers', category: 'research' },
    { icon: TrendingUp, text: 'Analyze design trends', category: 'research' },
    { icon: Brain, text: 'Explain CFD concepts', category: 'chat' },
  ];

  const suggestedTopics = [
    'Multi-objective wing optimization',
    'Turbulence modeling comparison',
    'Aerodynamic efficiency improvements',
    'Structural optimization techniques',
    'Advanced CFD methods',
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-aerospace-dark">
        <section className="w-full max-w-[120rem] mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Brain className="text-aerospace-blue" size={32} />
              <h1 className="text-4xl font-heading font-bold text-white">AI Research Assistant</h1>
            </div>
            <p className="text-lg text-secondary-foreground">
              Intelligent optimization strategies and research paper discovery
            </p>
          </motion.div>

          {/* Main Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-1 space-y-4"
            >
              {/* Mode Selection */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg border border-aerospace-blue/30 p-4">
                <h3 className="text-sm font-bold text-aerospace-blue mb-3 uppercase tracking-wide">
                  Conversation Mode
                </h3>
                <div className="space-y-2">
                  {(['chat', 'research', 'optimization'] as const).map(mode => (
                    <motion.button
                      key={mode}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setConversationMode(mode)}
                      className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left capitalize ${
                        conversationMode === mode
                          ? 'bg-aerospace-blue text-white'
                          : 'bg-aerospace-blue/10 text-aerospace-blue hover:bg-aerospace-blue/20'
                      }`}
                    >
                      {mode}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Suggested Topics */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg border border-aerospace-accent/30 p-4">
                <h3 className="text-sm font-bold text-aerospace-accent mb-3 uppercase tracking-wide">
                  Suggested Topics
                </h3>
                <div className="space-y-2">
                  {suggestedTopics.map((topic, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setInputValue(topic)}
                      className="w-full px-3 py-2 rounded-lg text-xs text-left text-secondary-foreground hover:text-aerospace-accent hover:bg-aerospace-accent/10 transition-colors"
                    >
                      {topic}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg border border-aerospace-success/30 p-4">
                <h3 className="text-sm font-bold text-aerospace-success mb-3 uppercase tracking-wide">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-aerospace-success hover:bg-aerospace-success/10 transition-colors"
                  >
                    <Download size={14} /> Export Chat
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-aerospace-success hover:bg-aerospace-success/10 transition-colors"
                  >
                    <GitBranch size={14} /> Save Session
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Chat Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2 flex flex-col bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg border border-aerospace-blue/30 overflow-hidden"
            >
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Brain className="mx-auto mb-4 text-aerospace-blue/50" size={48} />
                      <p className="text-secondary-foreground">Start a conversation...</p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                          msg.role === 'user'
                            ? 'bg-aerospace-blue text-white'
                            : 'bg-slate-700 text-foreground'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        {msg.suggestions && msg.role === 'assistant' && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {msg.suggestions.map((suggestion, sidx) => (
                              <motion.button
                                key={sidx}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setInputValue(suggestion)}
                                className="text-xs px-2 py-1 bg-white/20 hover:bg-white/30 rounded transition-colors"
                              >
                                {suggestion}
                              </motion.button>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-slate-700 text-foreground px-4 py-3 rounded-lg">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-aerospace-blue rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-aerospace-blue rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-aerospace-blue rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Input Area */}
              <div className="border-t border-aerospace-blue/20 p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask about optimization, research papers, or aerospace design..."
                    className="flex-1 px-4 py-2 bg-aerospace-dark border border-aerospace-blue/30 rounded-lg text-white placeholder-secondary-foreground focus:outline-none focus:border-aerospace-blue"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    className="px-4 py-2 bg-aerospace-blue hover:bg-aerospace-blue/90 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    <Send size={18} />
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Right Panel - Research Context */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-1 space-y-4"
            >
              {/* Recent Papers */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg border border-aerospace-blue/30 p-4 max-h-96 overflow-y-auto">
                <h3 className="text-sm font-bold text-aerospace-blue mb-3 uppercase tracking-wide">
                  Recent Papers
                </h3>
                <div className="space-y-2">
                  {context.papers.slice(0, 5).map((paper, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedPaper(paper)}
                      className={`w-full text-left p-2 rounded-lg text-xs transition-colors ${
                        selectedPaper?.title === paper.title
                          ? 'bg-aerospace-blue/20 border border-aerospace-blue'
                          : 'hover:bg-aerospace-blue/10'
                      }`}
                    >
                      <p className="font-medium text-foreground line-clamp-2">{paper.title}</p>
                      <p className="text-secondary-foreground text-xs mt-1">{paper.authors}</p>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* AI Suggestions */}
              {showSuggestions && (
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg border border-aerospace-accent/30 p-4 max-h-96 overflow-y-auto">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-aerospace-accent uppercase tracking-wide">
                      AI Suggestions
                    </h3>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowSuggestions(false)}
                      className="text-xs text-secondary-foreground hover:text-aerospace-accent"
                    >
                      ✕
                    </motion.button>
                  </div>
                  <div className="space-y-2">
                    {context.suggestions.slice(0, 4).map((suggestion, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.02 }}
                        className="p-2 rounded-lg bg-aerospace-accent/10 border border-aerospace-accent/20 cursor-pointer hover:border-aerospace-accent/40 transition-colors"
                      >
                        <p className="text-xs font-medium text-aerospace-accent">
                          {suggestion.suggestionText}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="text-xs text-secondary-foreground">
                            Confidence: {(suggestion.confidenceScore || 0).toFixed(0)}%
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
