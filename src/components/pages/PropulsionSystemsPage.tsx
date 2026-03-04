import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';
import { Flame, Gauge, TrendingUp, Settings, Download, Zap } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const PropulsionSystemsPage = () => {
  const [engineType, setEngineType] = useState('turbofan');
  const [throttle, setThrottle] = useState(75);

  // Engine performance data
  const performanceData = [
    { altitude: 0, thrust: 450, fuelFlow: 8200, temp: 1200 },
    { altitude: 5000, thrust: 420, fuelFlow: 7800, temp: 1180 },
    { altitude: 10000, thrust: 380, fuelFlow: 7200, temp: 1150 },
    { altitude: 15000, thrust: 320, fuelFlow: 6400, temp: 1100 },
    { altitude: 20000, thrust: 250, fuelFlow: 5200, temp: 1050 },
    { altitude: 25000, thrust: 180, fuelFlow: 3800, temp: 980 },
    { altitude: 30000, thrust: 120, fuelFlow: 2400, temp: 900 },
  ];

  const throttleData = [
    { throttle: 0, thrust: 0, fuelFlow: 500 },
    { throttle: 25, thrust: 110, fuelFlow: 2100 },
    { throttle: 50, thrust: 225, fuelFlow: 4200 },
    { throttle: 75, thrust: 338, fuelFlow: 6300 },
    { throttle: 100, thrust: 450, fuelFlow: 8200 },
  ];

  const compressorData = [
    { stage: 'Fan', pressure: 1.5, temp: 320 },
    { stage: 'LPC', pressure: 3.2, temp: 450 },
    { stage: 'HPC', pressure: 12.5, temp: 850 },
    { stage: 'Combustor', pressure: 12.2, temp: 1650 },
    { stage: 'HPT', pressure: 4.2, temp: 1200 },
    { stage: 'LPT', pressure: 1.8, temp: 800 },
  ];

  const engineSpecs = {
    turbofan: { bypass: 9.5, pressure: 42, temp: 1650, efficiency: 0.38 },
    turboprop: { bypass: 0, pressure: 28, temp: 1450, efficiency: 0.42 },
    ramjet: { bypass: 0, pressure: 35, temp: 2200, efficiency: 0.28 },
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
          <h1 className="text-5xl font-bold mb-4 text-aerospace-blue">Propulsion Systems Module</h1>
          <p className="text-xl text-secondary-foreground">
            Advanced engine performance analysis and optimization tools
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
            <label className="block text-sm font-semibold mb-3">Engine Type</label>
            <select
              value={engineType}
              onChange={(e) => setEngineType(e.target.value)}
              className="w-full bg-aerospace-dark border border-aerospace-blue/30 rounded px-3 py-2 text-foreground"
            >
              <option value="turbofan">High-Bypass Turbofan</option>
              <option value="turboprop">Turboprop</option>
              <option value="ramjet">Ramjet</option>
            </select>
          </Card>

          <Card className="bg-primary border-aerospace-blue/20 p-6">
            <label className="block text-sm font-semibold mb-3">Throttle Setting: {throttle}%</label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={throttle}
              onChange={(e) => setThrottle(parseInt(e.target.value))}
              className="w-full"
            />
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
                <p className="text-sm text-secondary-foreground">Max Thrust</p>
                <p className="text-3xl font-bold text-aerospace-blue">450 kN</p>
              </div>
              <Flame className="w-8 h-8 text-aerospace-warning opacity-50" />
            </div>
          </Card>

          <Card className="bg-primary border-aerospace-blue/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-foreground">Bypass Ratio</p>
                <p className="text-3xl font-bold text-aerospace-blue">{engineSpecs[engineType as keyof typeof engineSpecs].bypass}</p>
              </div>
              <Gauge className="w-8 h-8 text-aerospace-accent opacity-50" />
            </div>
          </Card>

          <Card className="bg-primary border-aerospace-blue/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-foreground">Pressure Ratio</p>
                <p className="text-3xl font-bold text-aerospace-blue">{engineSpecs[engineType as keyof typeof engineSpecs].pressure}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-aerospace-success opacity-50" />
            </div>
          </Card>

          <Card className="bg-primary border-aerospace-blue/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-foreground">Thermal Efficiency</p>
                <p className="text-3xl font-bold text-aerospace-blue">{(engineSpecs[engineType as keyof typeof engineSpecs].efficiency * 100).toFixed(0)}%</p>
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
          <Tabs defaultValue="altitude" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-primary border border-aerospace-blue/20">
              <TabsTrigger value="altitude">Altitude Performance</TabsTrigger>
              <TabsTrigger value="throttle">Throttle Response</TabsTrigger>
              <TabsTrigger value="compressor">Compressor Map</TabsTrigger>
              <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
            </TabsList>

            {/* Altitude Performance */}
            <TabsContent value="altitude" className="mt-6">
              <Card className="bg-primary border-aerospace-blue/20 p-8">
                <h3 className="text-xl font-bold mb-6 text-aerospace-blue">Performance vs Altitude</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(14, 165, 233, 0.1)" />
                    <XAxis dataKey="altitude" stroke="rgba(226, 232, 240, 0.5)" label={{ value: 'Altitude (ft)', position: 'insideBottomRight', offset: -5 }} />
                    <YAxis yAxisId="left" stroke="rgba(226, 232, 240, 0.5)" label={{ value: 'Thrust (kN)', angle: -90, position: 'insideLeft' }} />
                    <YAxis yAxisId="right" orientation="right" stroke="rgba(226, 232, 240, 0.5)" label={{ value: 'Fuel Flow (kg/h)', angle: 90, position: 'insideRight' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #0EA5E9' }}
                      labelStyle={{ color: '#E2E8F0' }}
                    />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="thrust" stroke="#0EA5E9" strokeWidth={2} name="Thrust" />
                    <Line yAxisId="right" type="monotone" dataKey="fuelFlow" stroke="#06B6D4" strokeWidth={2} name="Fuel Flow" />
                  </ComposedChart>
                </ResponsiveContainer>
              </Card>
            </TabsContent>

            {/* Throttle Response */}
            <TabsContent value="throttle" className="mt-6">
              <Card className="bg-primary border-aerospace-blue/20 p-8">
                <h3 className="text-xl font-bold mb-6 text-aerospace-blue">Throttle Response Curve</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={throttleData}>
                    <defs>
                      <linearGradient id="colorThrust" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(14, 165, 233, 0.1)" />
                    <XAxis dataKey="throttle" stroke="rgba(226, 232, 240, 0.5)" label={{ value: 'Throttle (%)', position: 'insideBottomRight', offset: -5 }} />
                    <YAxis stroke="rgba(226, 232, 240, 0.5)" label={{ value: 'Thrust (kN)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #0EA5E9' }}
                      labelStyle={{ color: '#E2E8F0' }}
                    />
                    <Area type="monotone" dataKey="thrust" stroke="#0EA5E9" fillOpacity={1} fill="url(#colorThrust)" />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </TabsContent>

            {/* Compressor Map */}
            <TabsContent value="compressor" className="mt-6">
              <Card className="bg-primary border-aerospace-blue/20 p-8">
                <h3 className="text-xl font-bold mb-6 text-aerospace-blue">Compressor Stage Analysis</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={compressorData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(14, 165, 233, 0.1)" />
                    <XAxis dataKey="stage" stroke="rgba(226, 232, 240, 0.5)" />
                    <YAxis yAxisId="left" stroke="rgba(226, 232, 240, 0.5)" label={{ value: 'Pressure Ratio', angle: -90, position: 'insideLeft' }} />
                    <YAxis yAxisId="right" orientation="right" stroke="rgba(226, 232, 240, 0.5)" label={{ value: 'Temperature (K)', angle: 90, position: 'insideRight' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #0EA5E9' }}
                      labelStyle={{ color: '#E2E8F0' }}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="pressure" fill="#0EA5E9" name="Pressure Ratio" />
                    <Bar yAxisId="right" dataKey="temp" fill="#06B6D4" name="Temperature (K)" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </TabsContent>

            {/* Efficiency */}
            <TabsContent value="efficiency" className="mt-6">
              <Card className="bg-primary border-aerospace-blue/20 p-8">
                <h3 className="text-xl font-bold mb-6 text-aerospace-blue">Engine Efficiency Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-aerospace-dark p-6 rounded border border-aerospace-blue/20">
                    <p className="text-sm text-secondary-foreground mb-2">Thermal Efficiency</p>
                    <p className="text-3xl font-bold text-aerospace-blue">{(engineSpecs[engineType as keyof typeof engineSpecs].efficiency * 100).toFixed(1)}%</p>
                    <p className="text-xs text-secondary-foreground mt-2">Heat energy converted to work</p>
                  </div>
                  <div className="bg-aerospace-dark p-6 rounded border border-aerospace-blue/20">
                    <p className="text-sm text-secondary-foreground mb-2">Propulsive Efficiency</p>
                    <p className="text-3xl font-bold text-aerospace-blue">85%</p>
                    <p className="text-xs text-secondary-foreground mt-2">Kinetic energy to thrust</p>
                  </div>
                  <div className="bg-aerospace-dark p-6 rounded border border-aerospace-blue/20">
                    <p className="text-sm text-secondary-foreground mb-2">Overall Efficiency</p>
                    <p className="text-3xl font-bold text-aerospace-blue">32%</p>
                    <p className="text-xs text-secondary-foreground mt-2">Combined thermal & propulsive</p>
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

export default PropulsionSystemsPage;
