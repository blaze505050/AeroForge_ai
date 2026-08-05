import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Save, Eye, Edit2, Trash2, Copy } from 'lucide-react';

interface NotebookSection {
  id: string;
  title: string;
  content: string;
  type: 'markdown' | 'code' | 'equation';
}

interface EngineeringNotebookProps {
  projectId: string;
  initialContent?: string;
}

export default function EngineeringNotebook({ projectId, initialContent }: EngineeringNotebookProps) {
  const [sections, setSections] = useState<NotebookSection[]>([
    {
      id: '1',
      title: 'Project Overview',
      content: '# Project Overview\n\nAdd your project overview here...',
      type: 'markdown',
    },
  ]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [isSaving, setIsSaving] = useState(false);

  const addSection = (type: NotebookSection['type']) => {
    const newSection: NotebookSection = {
      id: Date.now().toString(),
      title: `New ${type} Section`,
      content: type === 'equation' ? '$$E = mc^2$$' : type === 'code' ? '```python\n# Your code here\n```' : '# New Section',
      type,
    };
    setSections([...sections, newSection]);
  };

  const updateSection = (id: string, updates: Partial<NotebookSection>) => {
    setSections(sections.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteSection = (id: string) => {
    setSections(sections.filter(s => s.id !== id));
  };

  const duplicateSection = (id: string) => {
    const section = sections.find(s => s.id === id);
    if (section) {
      const newSection = { ...section, id: Date.now().toString(), title: `${section.title} (Copy)` };
      setSections([...sections, newSection]);
    }
  };

  const saveNotebook = async () => {
    setIsSaving(true);
    try {
      // Simulate save
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Notebook saved:', sections);
    } finally {
      setIsSaving(false);
    }
  };

  const renderContent = (content: string, type: NotebookSection['type']) => {
    if (type === 'markdown') {
      return (
        <div className="prose prose-invert max-w-none">
          <div className="text-foreground whitespace-pre-wrap">{content}</div>
        </div>
      );
    }
    if (type === 'code') {
      return (
        <pre className="bg-aerospace-dark p-4 rounded overflow-x-auto">
          <code className="text-aerospace-accent font-mono text-sm">{content}</code>
        </pre>
      );
    }
    if (type === 'equation') {
      return (
        <div className="text-center py-4 text-foreground font-mono">
          {content}
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between bg-primary border border-secondary/20 rounded-lg p-4"
      >
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('edit')}
            className={`flex items-center gap-2 px-3 py-2 rounded transition-colors ${
              viewMode === 'edit'
                ? 'bg-aerospace-blue text-white'
                : 'text-secondary-foreground hover:text-foreground'
            }`}
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => setViewMode('preview')}
            className={`flex items-center gap-2 px-3 py-2 rounded transition-colors ${
              viewMode === 'preview'
                ? 'bg-aerospace-blue text-white'
                : 'text-secondary-foreground hover:text-foreground'
            }`}
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2 bg-aerospace-blue/10 hover:bg-aerospace-blue/20 text-aerospace-blue rounded-lg transition-colors">
              <Plus className="w-4 h-4" />
              Add Section
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-primary border border-secondary/20 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <button
                onClick={() => addSection('markdown')}
                className="w-full text-left px-4 py-2 hover:bg-secondary/20 text-foreground first:rounded-t-lg"
              >
                Markdown Section
              </button>
              <button
                onClick={() => addSection('code')}
                className="w-full text-left px-4 py-2 hover:bg-secondary/20 text-foreground"
              >
                Code Block
              </button>
              <button
                onClick={() => addSection('equation')}
                className="w-full text-left px-4 py-2 hover:bg-secondary/20 text-foreground last:rounded-b-lg"
              >
                LaTeX Equation
              </button>
            </div>
          </div>

          <button
            onClick={saveNotebook}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-aerospace-success hover:bg-aerospace-success/80 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </motion.div>

      {/* Sections */}
      <div className="space-y-4">
        {sections.map((section, index) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-primary border border-secondary/20 rounded-lg overflow-hidden"
          >
            {/* Section Header */}
            <div className="p-4 border-b border-secondary/20 flex items-center justify-between bg-primary/50">
              {editingId === section.id ? (
                <input
                  autoFocus
                  value={section.title}
                  onChange={(e) => updateSection(section.id, { title: e.target.value })}
                  onBlur={() => setEditingId(null)}
                  className="flex-1 bg-aerospace-dark text-foreground px-3 py-1 rounded border border-aerospace-blue/50 focus:outline-none"
                />
              ) : (
                <h3
                  onClick={() => setEditingId(section.id)}
                  className="text-lg font-semibold text-foreground cursor-pointer hover:text-aerospace-blue transition-colors"
                >
                  {section.title}
                </h3>
              )}

              <div className="flex items-center gap-2">
                <span className="text-xs text-secondary-foreground bg-secondary/20 px-2 py-1 rounded">
                  {section.type}
                </span>
                <button
                  onClick={() => duplicateSection(section.id)}
                  className="p-1 hover:bg-secondary/20 rounded transition-colors text-secondary-foreground hover:text-foreground"
                  title="Duplicate section"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteSection(section.id)}
                  className="p-1 hover:bg-aerospace-danger/20 rounded transition-colors text-secondary-foreground hover:text-aerospace-danger"
                  title="Delete section"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Section Content */}
            <div className="p-6">
              {viewMode === 'edit' ? (
                <textarea
                  value={section.content}
                  onChange={(e) => updateSection(section.id, { content: e.target.value })}
                  className="w-full h-48 bg-aerospace-dark text-foreground font-mono text-sm p-4 rounded border border-secondary/20 focus:border-aerospace-blue focus:outline-none resize-none"
                  placeholder="Enter content here..."
                />
              ) : (
                <div className="text-foreground">
                  {renderContent(section.content, section.type)}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
