import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Layers, Zap, TrendingUp, Gauge, Download, Settings } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const MaterialsLabPage = () => {
  const [selectedMaterial, setSelectedMaterial] = useState('aluminum');
  const [temperature, setTemperature] = useState(20);

  // Material properties database
  const materials = {
    aluminum: {
      name: 'Aluminum 7075-T6',
      density: 2.81,
      yield: 505,
      ultimate: 570,
      modulus: 72,
      poisson: 0.33,
      conductivity: 130,
      expansion: 23.4,
      cost: 15,
    },
    titanium: {
      name: 'Titanium Ti-6Al-4V',
      density: 4.43,
      yield: 880,
      ultimate: 950,
      modulus: 103,
      poisson: 0.342,
      conductivity: 7.4,
      expansion: 8.6,
      cost: 45,
    },
    composite: {
      name: 'Carbon Fiber Composite',
      density: 1.6,
      yield: 1200,
      ultimate: 1400,
      modulus: 140,
      poisson: 0.25,
      conductivity: 5.0,
      expansion: -0.5,
      cost: 60,
    },
    steel: {
      name: 'Stainless Steel 304',
      density: 8.0,
      yield: 215,
      ultimate: 505,
      modulus: 193,
      poisson: 0.305,
      conductivity: 16.3,
      expansion: 16.0,
      cost: 8,
    },
  };

  // Stress-strain curves
  const stressStrainData = [
    { strain: 0, stress: 0 },
    { strain: 0.5, stress: 50 },
    { strain: 1.0, stress: 100 },
    { strain: 1.5, stress: 150 },
    { strain: 2.0, stress: 200 },
    { strain: 2.5, stress: 250 },
    { strain: 3.0, stress: 300 },
    { strain: 3.5, stress: 350 },
    { strain: 4.0, stress: 400 },
    { strain: 4.5, stress: 450 },
    { strain: 5.0, stress: 505 },
    { strain: 5.5, stress: 520 },
    { strain: 6.0, stress: 530 },
  ];

  // Temperature effects
  const temperatureEffects = [
    { temp: -50, strength: 580, modulus: 75 },
    { temp: 0, strength: 570, modulus: 72 },
    { temp: 50, strength: 550, modulus: 70 },
    { temp: 100, strength: 520, modulus: 68 },
    { temp: 150, strength: 480, modulus: 65 },
    { temp: 200, strength: 420, modulus: 60 },
    { temp: 250, strength: 350, modulus: 55 },
  ];

  // Fatigue data
  const fatigueData = [
    { cycles: 1000, stress: 400 },
    { cycles: 10000, stress: 350 },
    { cycles: 100000, stress: 280 },
    { cycles: 1000000, stress: 200 },
    { cycles: 10000000, stress: 150 },
  ];

  // Material comparison radar
  const comparisonData = [
    { category: 'Strength', aluminum: 80, titanium: 95, composite: 100, steel: 70 },
    { category: 'Weight', aluminum: 70, titanium: 50, composite: 95, steel: 30 },
    { category: 'Cost', aluminum: 90, titanium: 40, composite: 30, steel: 95 },
    { category: 'Stiffness', aluminum: 75, titanium: 85, composite: 95, steel: 100 },
    { category: 'Thermal', aluminum: 85, titanium: 40, composite: 50, steel: 70 },
  ];

  const currentMaterial = materials[selectedMaterial as keyof typeof materials];

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
          <h1 className="text-5xl font-bold mb-4 text-aerospace-blue">Materials Laboratory</h1>
          <p className="text-xl text-secondary-foreground">
            Advanced material characterization and selection tools
          </p>
        </motion.div>

        {/* Control Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        >
          <Card className="bg-primary border-aerospace-blue/20 p-6">
            <label className="block text-sm font-semibold mb-3">Material Selection</label>
            <select
              value={selectedMaterial}
              onChange={(e) => setSelectedMaterial(e.target.value)}
              className="w-full bg-aerospace-dark border border-aerospace-blue/30 rounded px-3 py-2 text-foreground"
            >
              <option value="aluminum">Aluminum 7075-T6</option>
              <option value="titanium">Titanium Ti-6Al-4V</option>
              <option value="composite">Carbon Fiber Composite</option>
              <option value="steel">Stainless Steel 304</option>
            </select>
          </Card>

          <Card className="bg-primary border-aerospace-blue/20 p-6">
            <label className="block text-sm font-semibold mb-3">Temperature: {temperature}°C</label>
            <input
              type="range"
              min="-50"
              max="250"
              step="10"
              value={temperature}
              onChange={(e) => setTemperature(parseInt(e.target.value))}
              className="w-full"
            />
          </Card>
        </motion.div>

        {/* Key Properties */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12"
        >
          <Card className="bg-primary border-aerospace-blue/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-foreground">Yield Strength</p>
                <p className="text-3xl font-bold text-aerospace-blue">{currentMaterial.yield} MPa</p>
              </div>
              <TrendingUp className="w-8 h-8 text-aerospace-accent opacity-50" />
            </div>
          </Card>

          <Card className="bg-primary border-aerospace-blue/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-foreground">Density</p>
                <p className="text-3xl font-bold text-aerospace-blue">{currentMaterial.density} g/cm³</p>
              </div>
              <Layers className="w-8 h-8 text-aerospace-warning opacity-50" />
            </div>
          </Card>

          <Card className="bg-primary border-aerospace-blue/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-foreground">Young's Modulus</p>
                <p className="text-3xl font-bold text-aerospace-blue">{currentMaterial.modulus} GPa</p>
              </div>
              <Gauge className="w-8 h-8 text-aerospace-success opacity-50" />
            </div>
          </Card>

          <Card className="bg-primary border-aerospace-blue/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-foreground">Cost Index</p>
                <p className="text-3xl font-bold text-aerospace-blue">${currentMaterial.cost}/kg</p>
              </div>
              <Zap className="w-8 h-8 text-aerospace-warning opacity-50" />
            </div>
          </Card>
        </motion.div>

        {/* Analysis Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Tabs defaultValue="stressstrain" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-primary border border-aerospace-blue/20">
              <TabsTrigger value="stressstrain">Stress-Strain</TabsTrigger>
              <TabsTrigger value="temperature">Temperature Effects</TabsTrigger>
              <TabsTrigger value="fatigue">Fatigue Life</TabsTrigger>
              <TabsTrigger value="comparison">Comparison</TabsTrigger>
            </TabsList>

            {/* Stress-Strain Curve */}
            <TabsContent value="stressstrain" className="mt-6">
              <Card className="bg-primary border-aerospace-blue/20 p-8">
                <h3 className="text-xl font-bold mb-6 text-aerospace-blue">Stress-Strain Curve</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={stressStrainData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(14, 165, 233, 0.1)" />
                    <XAxis dataKey="strain" stroke="rgba(226, 232, 240, 0.5)" label={{ value: 'Strain (%)', position: 'insideBottomRight', offset: -5 }} />
                    <YAxis stroke="rgba(226, 232, 240, 0.5)" label={{ value: 'Stress (MPa)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #0EA5E9' }}
                      labelStyle={{ color: '#E2E8F0' }}
                    />
                    <Line type="monotone" dataKey="stress" stroke="#0EA5E9" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="bg-aerospace-dark p-4 rounded border border-aerospace-blue/20">
                    <p className="text-sm text-secondary-foreground">Ultimate Strength</p>
                    <p className="text-2xl font-bold text-aerospace-blue">{currentMaterial.ultimate} MPa</p>
                  </div>
                  <div className="bg-aerospace-dark p-4 rounded border border-aerospace-blue/20">
                    <p className="text-sm text-secondary-foreground">Elongation at Break</p>
                    <p className="text-2xl font-bold text-aerospace-blue">6.2%</p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Temperature Effects */}
            <TabsContent value="temperature" className="mt-6">
              <Card className="bg-primary border-aerospace-blue/20 p-8">
                <h3 className="text-xl font-bold mb-6 text-aerospace-blue">Temperature Dependence</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={temperatureEffects}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(14, 165, 233, 0.1)" />
                    <XAxis dataKey="temp" stroke="rgba(226, 232, 240, 0.5)" label={{ value: 'Temperature (°C)', position: 'insideBottomRight', offset: -5 }} />
                    <YAxis yAxisId="left" stroke="rgba(226, 232, 240, 0.5)" label={{ value: 'Strength (MPa)', angle: -90, position: 'insideLeft' }} />
                    <YAxis yAxisId="right" orientation="right" stroke="rgba(226, 232, 240, 0.5)" label={{ value: 'Modulus (GPa)', angle: 90, position: 'insideRight' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #0EA5E9' }}
                      labelStyle={{ color: '#E2E8F0' }}
                    />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="strength" stroke="#0EA5E9" strokeWidth={2} name="Strength" />
                    <Line yAxisId="right" type="monotone" dataKey="modulus" stroke="#06B6D4" strokeWidth={2} name="Modulus" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </TabsContent>

            {/* Fatigue Life */}
            <TabsContent value="fatigue" className="mt-6">
              <Card className="bg-primary border-aerospace-blue/20 p-8">
                <h3 className="text-xl font-bold mb-6 text-aerospace-blue">S-N Curve (Fatigue)</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={fatigueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(14, 165, 233, 0.1)" />
                    <XAxis dataKey="cycles" stroke="rgba(226, 232, 240, 0.5)" scale="log" label={{ value: 'Cycles to Failure (log scale)', position: 'insideBottomRight', offset: -5 }} />
                    <YAxis stroke="rgba(226, 232, 240, 0.5)" label={{ value: 'Stress (MPa)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #0EA5E9' }}
                      labelStyle={{ color: '#E2E8F0' }}
                    />
                    <Line type="monotone" dataKey="stress" stroke="#0EA5E9" strokeWidth={2} dot={{ fill: '#06B6D4' }} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </TabsContent>

            {/* Material Comparison */}
            <TabsContent value="comparison" className="mt-6">
              <Card className="bg-primary border-aerospace-blue/20 p-8">
                <h3 className="text-xl font-bold mb-6 text-aerospace-blue">Material Comparison Radar</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={comparisonData}>
                    <PolarGrid stroke="rgba(14, 165, 233, 0.2)" />
                    <PolarAngleAxis dataKey="category" stroke="rgba(226, 232, 240, 0.5)" />
                    <PolarRadiusAxis stroke="rgba(226, 232, 240, 0.5)" />
                    <Radar name="Aluminum" dataKey="aluminum" stroke="#0EA5E9" fill="#0EA5E9" fillOpacity={0.25} />
                    <Radar name="Titanium" dataKey="titanium" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.25} />
                    <Radar name="Composite" dataKey="composite" stroke="#10B981" fill="#10B981" fillOpacity={0.25} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default MaterialsLabPage;
