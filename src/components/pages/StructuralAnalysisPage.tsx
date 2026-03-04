import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { AlertCircle, Download, Upload, Zap, Layers, TrendingUp, Settings, Play, Pause, RotateCcw } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const StructuralAnalysisPage = () => {
  const [analysisType, setAnalysisType] = useState('static');
  const [isRunning, setIsRunning] = useState(false);
  const [loadFactor, setLoadFactor] = useState(1.0);
  const [materialType, setMaterialType] = useState('aluminum');

  // Simulated FEA results
  const stressData = [
    { location: 'Root', stress: 450, factor: 2.1 },
    { location: 'Mid-Span', stress: 320, factor: 2.8 },
    { location: 'Tip', stress: 180, factor: 4.2 },
    { location: 'Junction', stress: 520, factor: 1.9 },
  ];

  const deformationData = [
    { node: '0', displacement: 0 },
    { node: '100', displacement: 0.45 },
    { node: '200', displacement: 1.2 },
    { node: '300', displacement: 1.8 },
    { node: '400', displacement: 2.1 },
    { node: '500', displacement: 1.9 },
  ];

  const modeShapeData = [
    { frequency: 12.5, damping: 0.02, mode: 'Mode 1' },
    { frequency: 34.2, damping: 0.018, mode: 'Mode 2' },
    { frequency: 67.8, damping: 0.015, mode: 'Mode 3' },
    { frequency: 102.3, damping: 0.012, mode: 'Mode 4' },
  ];

  const materialProperties = {
    aluminum: { yield: 276, density: 2.7, modulus: 69 },
    titanium: { yield: 880, density: 4.5, modulus: 103 },
    composite: { yield: 1200, density: 1.6, modulus: 140 },
  };

  const handleRunAnalysis = () => {
    setIsRunning(true);
    setTimeout(() => setIsRunning(false), 2000);
  };

  return (
    <div className="min-h-screen bg-aerospace-dark text-foreground">
      <Header />
      
      <main className="max-w-[100rem] mx-auto px-6 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h1 className="text-5xl font-bold mb-4 text-aerospace-blue">Structural Analysis Module</h1>
          <p className="text-xl text-secondary-foreground">
            Advanced FEA solver with static, modal, and nonlinear analysis capabilities
          </p>
        </motion.div>

        {/* Control Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
        >
          <Card className="bg-primary border-aerospace-blue/20 p-6">
            <label className="block text-sm font-semibold mb-3">Analysis Type</label>
            <select
              value={analysisType}
              onChange={(e) => setAnalysisType(e.target.value)}
              className="w-full bg-aerospace-dark border border-aerospace-blue/30 rounded px-3 py-2 text-foreground"
            >
              <option value="static">Static Structural</option>
              <option value="modal">Modal Analysis</option>
              <option value="thermal">Thermal Stress</option>
              <option value="fatigue">Fatigue Analysis</option>
            </select>
          </Card>

          <Card className="bg-primary border-aerospace-blue/20 p-6">
            <label className="block text-sm font-semibold mb-3">Material</label>
            <select
              value={materialType}
              onChange={(e) => setMaterialType(e.target.value)}
              className="w-full bg-aerospace-dark border border-aerospace-blue/30 rounded px-3 py-2 text-foreground"
            >
              <option value="aluminum">Aluminum 7075</option>
              <option value="titanium">Titanium Ti-6Al-4V</option>
              <option value="composite">Carbon Fiber Composite</option>
            </select>
          </Card>

          <Card className="bg-primary border-aerospace-blue/20 p-6">
            <label className="block text-sm font-semibold mb-3">Load Factor</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={loadFactor}
                onChange={(e) => setLoadFactor(parseFloat(e.target.value))}
                className="flex-1"
              />
              <span className="text-aerospace-blue font-bold">{loadFactor.toFixed(1)}x</span>
            </div>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-4 mb-12"
        >
          <Button
            onClick={handleRunAnalysis}
            disabled={isRunning}
            className="bg-aerospace-blue hover:bg-aerospace-accent text-primary-foreground"
          >
            <Play className="w-4 h-4 mr-2" />
            {isRunning ? 'Running...' : 'Run Analysis'}
          </Button>
          <Button variant="outline" className="border-aerospace-blue/30">
            <Upload className="w-4 h-4 mr-2" />
            Import Geometry
          </Button>
          <Button variant="outline" className="border-aerospace-blue/30">
            <Download className="w-4 h-4 mr-2" />
            Export Results
          </Button>
        </motion.div>

        {/* Results Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Tabs defaultValue="stress" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-primary border border-aerospace-blue/20">
              <TabsTrigger value="stress">Stress Distribution</TabsTrigger>
              <TabsTrigger value="deformation">Deformation</TabsTrigger>
              <TabsTrigger value="modal">Modal Shapes</TabsTrigger>
              <TabsTrigger value="properties">Material Properties</TabsTrigger>
            </TabsList>

            {/* Stress Distribution */}
            <TabsContent value="stress" className="mt-6">
              <Card className="bg-primary border-aerospace-blue/20 p-8">
                <h3 className="text-xl font-bold mb-6 text-aerospace-blue">Von Mises Stress Analysis</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={stressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(14, 165, 233, 0.1)" />
                    <XAxis dataKey="location" stroke="rgba(226, 232, 240, 0.5)" />
                    <YAxis stroke="rgba(226, 232, 240, 0.5)" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #0EA5E9' }}
                      labelStyle={{ color: '#E2E8F0' }}
                    />
                    <Legend />
                    <Bar dataKey="stress" fill="#0EA5E9" name="Stress (MPa)" />
                    <Bar dataKey="factor" fill="#06B6D4" name="Safety Factor" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-6 p-4 bg-aerospace-dark border border-aerospace-warning/30 rounded">
                  <div className="flex gap-2 items-start">
                    <AlertCircle className="w-5 h-5 text-aerospace-warning mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Critical Zone Detected</p>
                      <p className="text-sm text-secondary-foreground">Junction area shows stress concentration. Recommend fillet radius increase.</p>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Deformation */}
            <TabsContent value="deformation" className="mt-6">
              <Card className="bg-primary border-aerospace-blue/20 p-8">
                <h3 className="text-xl font-bold mb-6 text-aerospace-blue">Displacement Field</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={deformationData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(14, 165, 233, 0.1)" />
                    <XAxis dataKey="node" stroke="rgba(226, 232, 240, 0.5)" label={{ value: 'Node Position (mm)', position: 'insideBottomRight', offset: -5 }} />
                    <YAxis stroke="rgba(226, 232, 240, 0.5)" label={{ value: 'Displacement (mm)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #0EA5E9' }}
                      labelStyle={{ color: '#E2E8F0' }}
                    />
                    <Line type="monotone" dataKey="displacement" stroke="#0EA5E9" strokeWidth={2} dot={{ fill: '#06B6D4' }} />
                  </LineChart>
                </ResponsiveContainer>
                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="bg-aerospace-dark p-4 rounded border border-aerospace-blue/20">
                    <p className="text-sm text-secondary-foreground">Max Displacement</p>
                    <p className="text-2xl font-bold text-aerospace-blue">2.1 mm</p>
                  </div>
                  <div className="bg-aerospace-dark p-4 rounded border border-aerospace-blue/20">
                    <p className="text-sm text-secondary-foreground">Allowable</p>
                    <p className="text-2xl font-bold text-aerospace-success">5.0 mm</p>
                  </div>
                  <div className="bg-aerospace-dark p-4 rounded border border-aerospace-blue/20">
                    <p className="text-sm text-secondary-foreground">Margin</p>
                    <p className="text-2xl font-bold text-aerospace-accent">58%</p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Modal Analysis */}
            <TabsContent value="modal" className="mt-6">
              <Card className="bg-primary border-aerospace-blue/20 p-8">
                <h3 className="text-xl font-bold mb-6 text-aerospace-blue">Natural Frequencies & Damping</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(14, 165, 233, 0.1)" />
                    <XAxis dataKey="frequency" stroke="rgba(226, 232, 240, 0.5)" label={{ value: 'Frequency (Hz)', position: 'insideBottomRight', offset: -5 }} />
                    <YAxis stroke="rgba(226, 232, 240, 0.5)" label={{ value: 'Damping Ratio', angle: -90, position: 'insideLeft' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #0EA5E9' }}
                      labelStyle={{ color: '#E2E8F0' }}
                      cursor={{ strokeDasharray: '3 3' }}
                    />
                    <Scatter name="Mode Shapes" data={modeShapeData} fill="#0EA5E9" />
                  </ScatterChart>
                </ResponsiveContainer>
              </Card>
            </TabsContent>

            {/* Material Properties */}
            <TabsContent value="properties" className="mt-6">
              <Card className="bg-primary border-aerospace-blue/20 p-8">
                <h3 className="text-xl font-bold mb-6 text-aerospace-blue">Material Properties</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-aerospace-dark p-6 rounded border border-aerospace-blue/20">
                    <p className="text-sm text-secondary-foreground mb-2">Yield Strength</p>
                    <p className="text-3xl font-bold text-aerospace-blue">{materialProperties[materialType as keyof typeof materialProperties].yield} MPa</p>
                  </div>
                  <div className="bg-aerospace-dark p-6 rounded border border-aerospace-blue/20">
                    <p className="text-sm text-secondary-foreground mb-2">Density</p>
                    <p className="text-3xl font-bold text-aerospace-blue">{materialProperties[materialType as keyof typeof materialProperties].density} g/cm³</p>
                  </div>
                  <div className="bg-aerospace-dark p-6 rounded border border-aerospace-blue/20">
                    <p className="text-sm text-secondary-foreground mb-2">Young's Modulus</p>
                    <p className="text-3xl font-bold text-aerospace-blue">{materialProperties[materialType as keyof typeof materialProperties].modulus} GPa</p>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default StructuralAnalysisPage;
