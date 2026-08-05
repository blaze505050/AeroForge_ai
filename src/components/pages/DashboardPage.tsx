import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Cpu,
  Clock,
  CheckCircle2,
  AlertCircle,
  Zap,
  Brain,
  BarChart3,
  Activity,
  Rocket,
} from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { useProjectStore } from '@/stores/projectStore';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CommandCenterSidebar from '@/components/CommandCenterSidebar';

interface DashboardStats {
  activeProjects: number;
  runningSimulations: number;
  completedToday: number;
  computeHoursUsed: number;
}

interface RecentActivity {
  id: string;
  type: 'simulation' | 'project' | 'dataset' | 'validation';
  title: string;
  timestamp: Date;
  status: 'success' | 'running' | 'failed';
}

export default function DashboardPage() {
  const { projects } = useProjectStore();
  const [stats, setStats] = useState<DashboardStats>({
    activeProjects: 0,
    runningSimulations: 0,
    completedToday: 0,
    computeHoursUsed: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Simulate loading dashboard data
        // In production, this would fetch from CMS collections
        setStats({
          activeProjects: 3,
          runningSimulations: 2,
          completedToday: 5,
          computeHoursUsed: 12.5,
        });

        setRecentActivity([
          {
            id: '1',
            type: 'simulation',
            title: 'CFD Analysis - Wing Design v3',
            timestamp: new Date(Date.now() - 1000 * 60 * 5),
            status: 'success',
          },
          {
            id: '2',
            type: 'project',
            title: 'UAV Aerodynamics Study',
            timestamp: new Date(Date.now() - 1000 * 60 * 30),
            status: 'running',
          },
          {
            id: '3',
            type: 'dataset',
            title: 'Mesh Generation - Fuselage',
            timestamp: new Date(Date.now() - 1000 * 60 * 60),
            status: 'success',
          },
        ]);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const StatCard = ({
    icon: Icon,
    label,
    value,
    unit,
    trend,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    unit?: string;
    trend?: number;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-primary border border-secondary/20 rounded-lg p-6 hover:border-aerospace-blue/50 transition-all"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-secondary-foreground text-sm font-medium mb-2">{label}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground">{value}</span>
            {unit && <span className="text-secondary-foreground text-sm">{unit}</span>}
          </div>
          {trend !== undefined && (
            <div className={`text-xs mt-2 flex items-center gap-1 ${trend > 0 ? 'text-aerospace-success' : 'text-aerospace-warning'}`}>
              <TrendingUp className="w-3 h-3" />
              {trend > 0 ? '+' : ''}{trend}% from last week
            </div>
          )}
        </div>
        <div className="text-aerospace-blue opacity-50">{Icon}</div>
      </div>
    </motion.div>
  );

  const ActivityItem = ({ activity }: { activity: RecentActivity }) => {
    const statusColors = {
      success: 'bg-aerospace-success/10 text-aerospace-success',
      running: 'bg-aerospace-blue/10 text-aerospace-blue',
      failed: 'bg-aerospace-danger/10 text-aerospace-danger',
    };

    const typeIcons = {
      simulation: <Cpu className="w-4 h-4" />,
      project: <Rocket className="w-4 h-4" />,
      dataset: <BarChart3 className="w-4 h-4" />,
      validation: <CheckCircle2 className="w-4 h-4" />,
    };

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-4 p-4 bg-primary/50 border border-secondary/10 rounded-lg hover:border-secondary/30 transition-all"
      >
        <div className={`p-2 rounded-lg ${statusColors[activity.status]}`}>
          {typeIcons[activity.type]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-foreground font-medium truncate">{activity.title}</p>
          <p className="text-secondary-foreground text-xs">
            {Math.round((Date.now() - activity.timestamp.getTime()) / 60000)} minutes ago
          </p>
        </div>
        <div className={`px-3 py-1 rounded text-xs font-medium ${statusColors[activity.status]}`}>
          {activity.status === 'success' && 'Completed'}
          {activity.status === 'running' && 'Running'}
          {activity.status === 'failed' && 'Failed'}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-aerospace-dark flex flex-col">
      <Header />
      <div className="flex flex-1">
        <CommandCenterSidebar />
        <main className="flex-1 lg:ml-64">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-4xl font-bold text-foreground font-heading mb-2">
                Command Center
              </h1>
              <p className="text-secondary-foreground">
                Real-time overview of your engineering projects and compute resources
              </p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                icon={<Rocket className="w-8 h-8" />}
                label="Active Projects"
                value={stats.activeProjects}
                trend={12}
              />
              <StatCard
                icon={<Cpu className="w-8 h-8" />}
                label="Running Simulations"
                value={stats.runningSimulations}
                trend={5}
              />
              <StatCard
                icon={<CheckCircle2 className="w-8 h-8" />}
                label="Completed Today"
                value={stats.completedToday}
                trend={25}
              />
              <StatCard
                icon={<Zap className="w-8 h-8" />}
                label="Compute Hours"
                value={stats.computeHoursUsed}
                unit="hrs"
                trend={-8}
              />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-2"
              >
                <div className="bg-primary border border-secondary/20 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Activity className="w-5 h-5 text-aerospace-blue" />
                    <h2 className="text-lg font-bold text-foreground">Recent Activity</h2>
                  </div>
                  <div className="space-y-3">
                    {recentActivity.map((activity) => (
                      <ActivityItem key={activity.id} activity={activity} />
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="bg-primary border border-secondary/20 rounded-lg p-6">
                  <h2 className="text-lg font-bold text-foreground mb-4">Quick Actions</h2>
                  <div className="space-y-3">
                    <button className="w-full px-4 py-3 bg-aerospace-blue hover:bg-aerospace-accent text-white rounded-lg font-medium transition-colors">
                      + New Project
                    </button>
                    <button className="w-full px-4 py-3 bg-primary border border-aerospace-blue/50 hover:bg-primary/50 text-aerospace-blue rounded-lg font-medium transition-colors">
                      Run Simulation
                    </button>
                    <button className="w-full px-4 py-3 bg-primary border border-aerospace-blue/50 hover:bg-primary/50 text-aerospace-blue rounded-lg font-medium transition-colors">
                      Upload Dataset
                    </button>
                    <button className="w-full px-4 py-3 bg-primary border border-aerospace-blue/50 hover:bg-primary/50 text-aerospace-blue rounded-lg font-medium transition-colors">
                      View Reports
                    </button>
                  </div>
                </div>

                {/* AI Copilot Widget */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6 bg-gradient-to-br from-aerospace-blue/10 to-aerospace-accent/10 border border-aerospace-blue/30 rounded-lg p-6"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className="w-5 h-5 text-aerospace-blue" />
                    <h3 className="font-bold text-foreground">AI Copilot</h3>
                  </div>
                  <p className="text-secondary-foreground text-sm mb-4">
                    "Based on your recent simulations, I recommend optimizing the mesh resolution in the boundary layer region."
                  </p>
                  <button className="w-full px-4 py-2 bg-aerospace-blue/20 hover:bg-aerospace-blue/30 text-aerospace-blue rounded-lg text-sm font-medium transition-colors">
                    Ask Copilot
                  </button>
                </motion.div>
              </motion.div>
            </div>

            {/* System Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 bg-primary border border-secondary/20 rounded-lg p-6"
            >
              <h2 className="text-lg font-bold text-foreground mb-4">System Status</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-aerospace-success rounded-full" />
                  <div>
                    <p className="text-sm text-secondary-foreground">Compute Cluster</p>
                    <p className="text-foreground font-medium">Operational</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-aerospace-success rounded-full" />
                  <div>
                    <p className="text-sm text-secondary-foreground">Data Storage</p>
                    <p className="text-foreground font-medium">Healthy (2.3 TB / 5 TB)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-aerospace-success rounded-full" />
                  <div>
                    <p className="text-sm text-secondary-foreground">API Services</p>
                    <p className="text-foreground font-medium">All Systems Go</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
