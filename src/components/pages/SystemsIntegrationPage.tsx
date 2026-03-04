import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Zap, Layers, TrendingUp, Settings, Download, Play, AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SystemsIntegrationPage = () => {
  const [systemType, setSystemType] = useState('aircraft');
  const [isSimulating, setIsSimulating] = useState(false);

  // System architecture data
  const systemComponents = [
    { name: 'Propulsion', weight: 2500, cost: 450000, reliability: 0.998 },
    { name: 'Structures', weight: 3200, cost: 280000, reliability: 0.9995 },
    { name: 'Avionics', weight: 450, cost: 320000, reliability: 0.9999 },
    { name: 'Hydraulics', weight: 800, cost: 120000, reliability: 0.997 },
    { name: 'Electrical', weight: 600, cost: 180000, reliability: 0.9985 },
    { name: 'Environmental', weight: 350, cost: 95000, reliability: 0.996 },
  ];

  // Weight distribution
  const weightData = [
    { name: 'Structures', value: 35 },
    { name: 'Propulsion', value: 28 },
    { name: 'Systems', value: 18 },
    { name: 'Avionics', value: 12 },
    { name: 'Payload', value: 7 },
  ];

  // Performance metrics
  const performanceData = [
    { metric: 'Reliability', target: 0.9999, actual: 0.9997 },
    { metric: 'Maintainability', target: 0.95, actual: 0.92 },
    { metric: 'Availability', target: 0.98, actual: 0.96 },
    { metric: 'Safety', target: 0.99999, actual: 0.99998 },
  ];

  // Integration timeline
  const integrationTimeline = [
    { phase: 'Design', progress: 100, status: 'Complete' },
    { phase: 'Manufacturing', progress: 85, status: 'In Progress' },
    { phase: 'Assembly', progress: 60, status: 'In Progress' },
    { phase: 'Testing', progress: 40, status: 'Planned' },
    { phase: 'Certification', progress: 0, status: 'Planned' },
  ];

  // Cost breakdown
  const costData = [
    { category: 'Labor', amount: 2400000 },
    { category: 'Materials', amount: 1800000 },
    { category: 'Equipment', amount: 950000 },
    { category: 'Testing', amount: 650000 },
    { category: 'Certification', amount: 400000 },
  ];

  const COLORS = ['#0EA5E9', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];

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
          <h1 className="text-5xl font-bold mb-4 text-aerospace-blue">Systems Integration Module</h1>
          <p className="text-xl text-secondary-foreground">
            Comprehensive aircraft system design, integration, and lifecycle management
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
            <label className="block text-sm font-semibold mb-3">System Type</label>
            <select
              value={systemType}
              onChange={(e) => setSystemType(e.target.value)}
              className="w-full bg-aerospace-dark border border-aerospace-blue/30 rounded px-3 py-2 text-foreground"
            >
              <option value="aircraft">Commercial Aircraft</option>
              <option value="fighter">Fighter Jet</option>
              <option value="helicopter">Helicopter</option>
              <option value="uav">Unmanned Aerial Vehicle</option>
            </select>
          </Card>

          <div className="flex gap-4 items-end">
            <Button
              onClick={() => setIsSimulating(!isSimulating)}
              className="bg-aerospace-blue hover:bg-aerospace-accent text-primary-foreground flex-1"
            >
              <Play className="w-4 h-4 mr-2" />
              {isSimulating ? 'Stop Simulation' : 'Run Integration Check'}
            </Button>
            <Button variant="outline" className="border-aerospace-blue/30">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
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
                <p className="text-sm text-secondary-foreground">Total Weight</p>
                <p className="text-3xl font-bold text-aerospace-blue">7.3 tons</p>
              </div>
              <Layers className="w-8 h-8 text-aerospace-accent opacity-50" />
            </div>
          </Card>

          <Card className="bg-primary border-aerospace-blue/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-foreground">System Reliability</p>
                <p className="text-3xl font-bold text-aerospace-blue">99.97%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-aerospace-success opacity-50" />
            </div>
          </Card>

          <Card className="bg-primary border-aerospace-blue/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-foreground">Total Cost</p>
                <p className="text-3xl font-bold text-aerospace-blue">$6.2M</p>
              </div>
              <Zap className="w-8 h-8 text-aerospace-warning opacity-50" />
            </div>
          </Card>

          <Card className="bg-primary border-aerospace-blue/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-foreground">Integration Status</p>
                <p className="text-3xl font-bold text-aerospace-blue">72%</p>
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
          <Tabs defaultValue="components" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-primary border border-aerospace-blue/20">
              <TabsTrigger value="components">Components</TabsTrigger>
              <TabsTrigger value="weight">Weight Distribution</TabsTrigger>
              <TabsTrigger value="timeline">Integration Timeline</TabsTrigger>
              <TabsTrigger value="cost">Cost Analysis</TabsTrigger>
            </TabsList>

            {/* Components */}
            <TabsContent value="components" className="mt-6">
              <Card className="bg-primary border-aerospace-blue/20 p-8">
                <h3 className="text-xl font-bold mb-6 text-aerospace-blue">System Components</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-aerospace-blue/20">
                        <th className="text-left py-3 px-4 text-aerospace-blue">Component</th>
                        <th className="text-right py-3 px-4 text-aerospace-blue">Weight (kg)</th>
                        <th className="text-right py-3 px-4 text-aerospace-blue">Cost ($)</th>
                        <th className="text-right py-3 px-4 text-aerospace-blue">Reliability</th>
                      </tr>
                    </thead>
                    <tbody>
                      {systemComponents.map((comp, idx) => (
                        <tr key={idx} className="border-b border-aerospace-blue/10 hover:bg-aerospace-dark/50">
                          <td className="py-3 px-4">{comp.name}</td>
                          <td className="text-right py-3 px-4">{comp.weight}</td>
                          <td className="text-right py-3 px-4">${comp.cost.toLocaleString()}</td>
                          <td className="text-right py-3 px-4 text-aerospace-success">{(comp.reliability * 100).toFixed(2)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>

            {/* Weight Distribution */}
            <TabsContent value="weight" className="mt-6">
              <Card className="bg-primary border-aerospace-blue/20 p-8">
                <h3 className="text-xl font-bold mb-6 text-aerospace-blue">Weight Distribution</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={weightData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {weightData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #0EA5E9' }}
                        labelStyle={{ color: '#E2E8F0' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-3">
                    {weightData.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-aerospace-dark rounded border border-aerospace-blue/20">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS[idx] }}></div>
                          <span>{item.name}</span>
                        </div>
                        <span className="font-bold text-aerospace-blue">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Integration Timeline */}
            <TabsContent value="timeline" className="mt-6">
              <Card className="bg-primary border-aerospace-blue/20 p-8">
                <h3 className="text-xl font-bold mb-6 text-aerospace-blue">Integration Timeline</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={integrationTimeline}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(14, 165, 233, 0.1)" />
                    <XAxis dataKey="phase" stroke="rgba(226, 232, 240, 0.5)" />
                    <YAxis stroke="rgba(226, 232, 240, 0.5)" label={{ value: 'Progress (%)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #0EA5E9' }}
                      labelStyle={{ color: '#E2E8F0' }}
                    />
                    <Bar dataKey="progress" fill="#0EA5E9" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </TabsContent>

            {/* Cost Analysis */}
            <TabsContent value="cost" className="mt-6">
              <Card className="bg-primary border-aerospace-blue/20 p-8">
                <h3 className="text-xl font-bold mb-6 text-aerospace-blue">Cost Breakdown</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={costData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(14, 165, 233, 0.1)" />
                    <XAxis type="number" stroke="rgba(226, 232, 240, 0.5)" />
                    <YAxis dataKey="category" type="category" stroke="rgba(226, 232, 240, 0.5)" width={100} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #0EA5E9' }}
                      labelStyle={{ color: '#E2E8F0' }}
                      formatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                    />
                    <Bar dataKey="amount" fill="#0EA5E9" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Integration Warnings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 p-6 bg-aerospace-dark border border-aerospace-warning/30 rounded"
        >
          <div className="flex gap-4 items-start">
            <AlertCircle className="w-6 h-6 text-aerospace-warning flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold mb-2">Integration Alerts</h3>
              <ul className="text-sm text-secondary-foreground space-y-1">
                <li>• Hydraulic system pressure margin below 5% threshold</li>
                <li>• Avionics cooling capacity requires optimization</li>
                <li>• Structural load path verification pending</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default SystemsIntegrationPage;
