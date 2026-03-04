import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { Wind, Zap, TrendingUp, Settings, Download, Play } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AerodynamicsLabPage = () => {
  const [machNumber, setMachNumber] = useState(0.5);
  const [angleOfAttack, setAngleOfAttack] = useState(5);
  const [reynoldsNumber, setReynoldsNumber] = useState(5000000);

  // Aerodynamic coefficient data
  const polarData = [
    { aoa: -10, cl: -0.5, cd: 0.015, cm: -0.02 },
    { aoa: -5, cl: -0.2, cd: 0.008, cm: -0.01 },
    { aoa: 0, cl: 0.0, cd: 0.005, cm: 0.0 },
    { aoa: 5, cl: 0.45, cd: 0.008, cm: 0.02 },
    { aoa: 10, cl: 0.95, cd: 0.015, cm: 0.05 },
    { aoa: 15, cl: 1.35, cd: 0.028, cm: 0.08 },
    { aoa: 20, cl: 1.55, cd: 0.045, cm: 0.10 },
  ];

  const machEffectData = [
    { mach: 0.2, cl: 0.45, cd: 0.008 },
    { mach: 0.4, cl: 0.46, cd: 0.009 },
    { mach: 0.6, cl: 0.48, cd: 0.011 },
    { mach: 0.8, cl: 0.52, cd: 0.018 },
    { mach: 0.95, cl: 0.58, cd: 0.035 },
  ];

  const pressureDistribution = [
    { position: 0, cp: -2.5 },
    { position: 10, cp: -2.2 },
    { position: 20, cp: -1.8 },
    { position: 30, cp: -1.2 },
    { position: 40, cp: -0.8 },
    { position: 50, cp: -0.3 },
    { position: 60, cp: 0.2 },
    { position: 70, cp: 0.5 },
    { position: 80, cp: 0.6 },
    { position: 90, cp: 0.4 },
    { position: 100, cp: 0.1 },
  ];

  const boundaryLayerData = [
    { distance: 0, velocity: 0 },
    { distance: 0.1, velocity: 2.5 },
    { distance: 0.2, velocity: 5.0 },
    { distance: 0.3, velocity: 7.2 },
    { distance: 0.4, velocity: 8.8 },
    { distance: 0.5, velocity: 9.5 },
    { distance: 0.6, velocity: 9.8 },
    { distance: 0.7, velocity: 10.0 },
  ];

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
          <h1 className="text-5xl font-bold mb-4 text-aerospace-blue">Aerodynamics Laboratory</h1>
          <p className="text-xl text-secondary-foreground">
            Advanced CFD analysis and aerodynamic coefficient prediction
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
            <label className="block text-sm font-semibold mb-3">Mach Number: {machNumber.toFixed(2)}</label>
            <input
              type="range"
              min="0.1"
              max="2.0"
              step="0.1"
              value={machNumber}
              onChange={(e) => setMachNumber(parseFloat(e.target.value))}
              className="w-full"
            />
          </Card>

          <Card className="bg-primary border-aerospace-blue/20 p-6">
            <label className="block text-sm font-semibold mb-3">Angle of Attack: {angleOfAttack}°</label>
            <input
              type="range"
              min="-10"
              max="25"
              step="1"
              value={angleOfAttack}
              onChange={(e) => setAngleOfAttack(parseInt(e.target.value))}
              className="w-full"
            />
          </Card>

          <Card className="bg-primary border-aerospace-blue/20 p-6">
            <label className="block text-sm font-semibold mb-3">Reynolds Number</label>
            <select
              value={reynoldsNumber}
              onChange={(e) => setReynoldsNumber(parseInt(e.target.value))}
              className="w-full bg-aerospace-dark border border-aerospace-blue/30 rounded px-3 py-2 text-foreground"
            >
              <option value={1000000}>1M (Low Speed)</option>
              <option value={5000000}>5M (Subsonic)</option>
              <option value={10000000}>10M (Transonic)</option>
              <option value={50000000}>50M (Supersonic)</option>
            </select>
          </Card>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12"
        >
          <Card className="bg-primary border-aerospace-blue/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-foreground">Lift Coefficient</p>
                <p className="text-3xl font-bold text-aerospace-blue">0.45</p>
              </div>
              <Wind className="w-8 h-8 text-aerospace-accent opacity-50" />
            </div>
          </Card>

          <Card className="bg-primary border-aerospace-blue/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-foreground">Drag Coefficient</p>
                <p className="text-3xl font-bold text-aerospace-blue">0.008</p>
              </div>
              <TrendingUp className="w-8 h-8 text-aerospace-warning opacity-50" />
            </div>
          </Card>

          <Card className="bg-primary border-aerospace-blue/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-foreground">L/D Ratio</p>
                <p className="text-3xl font-bold text-aerospace-blue">56.3</p>
              </div>
              <Zap className="w-8 h-8 text-aerospace-success opacity-50" />
            </div>
          </Card>

          <Card className="bg-primary border-aerospace-blue/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-foreground">Stall Angle</p>
                <p className="text-3xl font-bold text-aerospace-blue">18.5°</p>
              </div>
              <Settings className="w-8 h-8 text-aerospace-warning opacity-50" />
            </div>
          </Card>
        </motion.div>

        {/* Analysis Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Tabs defaultValue="polar" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-primary border border-aerospace-blue/20">
              <TabsTrigger value="polar">Polar Curve</TabsTrigger>
              <TabsTrigger value="pressure">Pressure Distribution</TabsTrigger>
              <TabsTrigger value="boundary">Boundary Layer</TabsTrigger>
              <TabsTrigger value="mach">Mach Effects</TabsTrigger>
            </TabsList>

            {/* Polar Curve */}
            <TabsContent value="polar" className="mt-6">
              <Card className="bg-primary border-aerospace-blue/20 p-8">
                <h3 className="text-xl font-bold mb-6 text-aerospace-blue">Aerodynamic Polar (CL vs CD)</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(14, 165, 233, 0.1)" />
                    <XAxis dataKey="cd" stroke="rgba(226, 232, 240, 0.5)" label={{ value: 'Drag Coefficient (CD)', position: 'insideBottomRight', offset: -5 }} />
                    <YAxis stroke="rgba(226, 232, 240, 0.5)" label={{ value: 'Lift Coefficient (CL)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #0EA5E9' }}
                      labelStyle={{ color: '#E2E8F0' }}
                      cursor={{ strokeDasharray: '3 3' }}
                    />
                    <Scatter name="Polar Curve" data={polarData} fill="#0EA5E9" />
                  </ScatterChart>
                </ResponsiveContainer>
                <div className="mt-6 p-4 bg-aerospace-dark border border-aerospace-blue/20 rounded">
                  <p className="text-sm text-secondary-foreground">
                    <span className="font-semibold">Current Operating Point:</span> AOA = {angleOfAttack}°, CL = 0.45, CD = 0.008
                  </p>
                </div>
              </Card>
            </TabsContent>

            {/* Pressure Distribution */}
            <TabsContent value="pressure" className="mt-6">
              <Card className="bg-primary border-aerospace-blue/20 p-8">
                <h3 className="text-xl font-bold mb-6 text-aerospace-blue">Pressure Coefficient Distribution</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={pressureDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(14, 165, 233, 0.1)" />
                    <XAxis dataKey="position" stroke="rgba(226, 232, 240, 0.5)" label={{ value: 'Chord Position (%)', position: 'insideBottomRight', offset: -5 }} />
                    <YAxis stroke="rgba(226, 232, 240, 0.5)" label={{ value: 'Pressure Coefficient (CP)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #0EA5E9' }}
                      labelStyle={{ color: '#E2E8F0' }}
                    />
                    <Line type="monotone" dataKey="cp" stroke="#0EA5E9" strokeWidth={2} dot={{ fill: '#06B6D4' }} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </TabsContent>

            {/* Boundary Layer */}
            <TabsContent value="boundary" className="mt-6">
              <Card className="bg-primary border-aerospace-blue/20 p-8">
                <h3 className="text-xl font-bold mb-6 text-aerospace-blue">Boundary Layer Velocity Profile</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={boundaryLayerData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(14, 165, 233, 0.1)" />
                    <XAxis dataKey="distance" stroke="rgba(226, 232, 240, 0.5)" label={{ value: 'Distance from Surface (mm)', position: 'insideBottomRight', offset: -5 }} />
                    <YAxis stroke="rgba(226, 232, 240, 0.5)" label={{ value: 'Velocity (m/s)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #0EA5E9' }}
                      labelStyle={{ color: '#E2E8F0' }}
                    />
                    <Line type="monotone" dataKey="velocity" stroke="#06B6D4" strokeWidth={2} dot={{ fill: '#0EA5E9' }} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </TabsContent>

            {/* Mach Effects */}
            <TabsContent value="mach" className="mt-6">
              <Card className="bg-primary border-aerospace-blue/20 p-8">
                <h3 className="text-xl font-bold mb-6 text-aerospace-blue">Compressibility Effects</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={machEffectData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(14, 165, 233, 0.1)" />
                    <XAxis dataKey="mach" stroke="rgba(226, 232, 240, 0.5)" label={{ value: 'Mach Number', position: 'insideBottomRight', offset: -5 }} />
                    <YAxis yAxisId="left" stroke="rgba(226, 232, 240, 0.5)" label={{ value: 'Lift Coefficient', angle: -90, position: 'insideLeft' }} />
                    <YAxis yAxisId="right" orientation="right" stroke="rgba(226, 232, 240, 0.5)" label={{ value: 'Drag Coefficient', angle: 90, position: 'insideRight' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #0EA5E9' }}
                      labelStyle={{ color: '#E2E8F0' }}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="cl" fill="#0EA5E9" name="CL" />
                    <Bar yAxisId="right" dataKey="cd" fill="#06B6D4" name="CD" />
                  </BarChart>
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

export default AerodynamicsLabPage;
