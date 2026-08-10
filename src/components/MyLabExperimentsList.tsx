import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExperimentStore } from '@/stores/experimentStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trash2, Download, Play, FileJson, FileText } from 'lucide-react';
import { format } from 'date-fns';

export default function MyLabExperimentsList() {
  const experiments = useExperimentStore((state) => state.getAllExperiments());
  const deleteExperiment = useExperimentStore((state) => state.deleteExperiment);
  const exportExperiments = useExperimentStore((state) => state.exportExperiments);
  const [selectedFormat, setSelectedFormat] = useState<'json' | 'csv'>('json');

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this experiment?')) {
      deleteExperiment(id);
    }
  };

  const handleExport = () => {
    const data = exportExperiments(selectedFormat);
    const element = document.createElement('a');
    const file = new Blob([data], {
      type: selectedFormat === 'json' ? 'application/json' : 'text/csv',
    });
    element.href = URL.createObjectURL(file);
    element.download = `astrolab-experiments.${selectedFormat}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      orbital: 'from-blue-600 to-cyan-600',
      gravity: 'from-purple-600 to-pink-600',
      transit: 'from-orange-600 to-red-600',
      stellar: 'from-yellow-600 to-orange-600',
      leo: 'from-green-600 to-emerald-600',
      exoplanet: 'from-indigo-600 to-purple-600',
      'star-classification': 'from-amber-600 to-yellow-600',
    };
    return colors[type] || 'from-slate-600 to-slate-700';
  };

  if (experiments.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400 mb-4">No experiments saved yet.</p>
        <p className="text-slate-500 text-sm">
          Run simulations and save your results to see them here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Export Controls */}
      <div className="flex gap-2 justify-end">
        <select
          value={selectedFormat}
          onChange={(e) => setSelectedFormat(e.target.value as 'json' | 'csv')}
          className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white text-sm"
        >
          <option value="json">JSON</option>
          <option value="csv">CSV</option>
        </select>
        <Button
          onClick={handleExport}
          variant="outline"
          className="border-slate-600 text-slate-300 hover:bg-slate-700 flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export All
        </Button>
      </div>

      {/* Experiments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {experiments.map((exp, idx) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="bg-slate-800 border-slate-700 overflow-hidden hover:border-slate-500 transition-all h-full flex flex-col">
                {/* Header with Type Badge */}
                <div className={`h-2 bg-gradient-to-r ${getTypeColor(exp.type)}`} />

                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-white flex-1 line-clamp-2">
                      {exp.name}
                    </h3>
                    <span className="ml-2 px-2 py-1 bg-slate-700 rounded text-xs text-slate-300 whitespace-nowrap">
                      {exp.type}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mb-3">
                    {format(new Date(exp.timestamp), 'MMM d, yyyy HH:mm')}
                  </p>

                  {exp.notes && (
                    <p className="text-sm text-slate-300 mb-3 line-clamp-2">
                      {exp.notes}
                    </p>
                  )}

                  {/* Results Preview */}
                  <div className="bg-slate-700/50 rounded p-2 mb-3 flex-1">
                    <p className="text-xs text-slate-400 font-mono">
                      {Object.entries(exp.results)
                        .slice(0, 2)
                        .map(([key, value]) => {
                          let displayValue = value;
                          if (typeof value === 'number') {
                            displayValue = value > 1e6 ? value.toExponential(2) : value.toFixed(2);
                          }
                          return `${key}: ${displayValue}`;
                        })
                        .join(' | ')}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 h-8 text-xs flex items-center justify-center gap-1"
                    >
                      <Play className="w-3 h-3" />
                      Re-run
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 h-8 text-xs flex items-center justify-center gap-1"
                    >
                      <FileJson className="w-3 h-3" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-700 text-red-400 hover:bg-red-900/20 h-8 text-xs flex items-center justify-center"
                      onClick={() => handleDelete(exp.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
