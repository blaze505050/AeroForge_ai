import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Minimize2, Maximize2, X, Lightbulb, Zap, HelpCircle } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AICopilotSidebarProps {
  projectId: string;
  isOpen?: boolean;
  onToggle?: (open: boolean) => void;
}

export default function AICopilotSidebar({ projectId, isOpen = true, onToggle }: AICopilotSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI Copilot. I can help you with design optimization, simulation setup, and analysis. What would you like to work on?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
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
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateAIResponse(inputValue),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const generateAIResponse = (userInput: string): string => {
    const responses: Record<string, string> = {
      'mesh': 'I recommend using a refined mesh with aspect ratio between 1.2-45.8 for better convergence. Would you like me to suggest specific mesh parameters?',
      'convergence': 'For faster convergence, try adjusting the relaxation factors or using a coarser initial mesh. What simulation type are you running?',
      'optimization': 'I can help optimize your design. What parameters would you like to focus on - aerodynamics, structural, or thermal performance?',
      'cfd': 'For CFD analysis, ensure your domain size is at least 5-10 times the characteristic length. Would you like recommendations on boundary conditions?',
      'fea': 'For structural analysis, make sure your mesh is refined in high-stress areas. I can help identify critical regions.',
      'default': 'That\'s a great question! Based on your project context, I suggest exploring the simulation parameters. What specific aspect would you like help with?',
    };

    const lowerInput = userInput.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
      if (lowerInput.includes(key)) {
        return response;
      }
    }
    return responses.default;
  };

  const suggestedPrompts = [
    { icon: Zap, text: 'Optimize mesh settings' },
    { icon: Lightbulb, text: 'Design recommendations' },
    { icon: HelpCircle, text: 'Simulation help' },
  ];

  if (!isOpen) {
    return null;
  }

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      className="fixed right-0 top-0 h-screen w-96 bg-primary border-l border-secondary/20 flex flex-col shadow-2xl z-40"
    >
      {/* Header */}
      <div className="p-4 border-b border-secondary/20 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">AI Copilot</h2>
          <p className="text-xs text-secondary-foreground">Project Context Active</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 hover:bg-secondary/20 rounded transition-colors text-secondary-foreground hover:text-foreground"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onToggle?.(false)}
            className="p-2 hover:bg-secondary/20 rounded transition-colors text-secondary-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex-1 overflow-y-auto p-4 space-y-4"
          >
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <Lightbulb className="w-8 h-8 text-aerospace-blue mb-3 opacity-50" />
                <p className="text-secondary-foreground text-sm">Start a conversation to get AI assistance</p>
              </div>
            ) : (
              <>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-aerospace-blue text-white'
                          : 'bg-secondary/20 text-foreground'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-secondary/20 text-foreground px-4 py-2 rounded-lg">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-aerospace-blue rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-aerospace-blue rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-aerospace-blue rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suggested Prompts */}
      {messages.length === 1 && !isMinimized && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-4 pb-4 space-y-2"
        >
          <p className="text-xs text-secondary-foreground font-medium">Suggested:</p>
          {suggestedPrompts.map((prompt, index) => {
            const Icon = prompt.icon;
            return (
              <button
                key={index}
                onClick={() => {
                  setInputValue(prompt.text);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 bg-secondary/10 hover:bg-secondary/20 rounded-lg transition-colors text-left text-sm text-foreground"
              >
                <Icon className="w-4 h-4 text-aerospace-blue flex-shrink-0" />
                <span className="truncate">{prompt.text}</span>
              </button>
            );
          })}
        </motion.div>
      )}

      {/* Input Area */}
      {!isMinimized && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 border-t border-secondary/20"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask for help..."
              className="flex-1 bg-aerospace-dark text-foreground px-3 py-2 rounded-lg border border-secondary/20 focus:border-aerospace-blue focus:outline-none text-sm"
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
              className="p-2 bg-aerospace-blue hover:bg-aerospace-accent text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
