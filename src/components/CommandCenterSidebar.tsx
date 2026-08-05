import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  FolderOpen,
  BookOpen,
  Microscope,
  Zap,
  Brain,
  ShoppingCart,
  ChevronDown,
  Menu,
  X,
  Settings,
  LogOut,
  Cpu,
  Lightbulb,
  Wind,
  Layers,
  Gauge,
  Workflow,
  Rocket,
  Thermometer,
  Wrench,
  GitBranch,
  Radar,
  Cpu as ComputeIcon,
} from 'lucide-react';
import { useProjectStore } from '@/stores/projectStore';
import { useLabStore } from '@/stores/labStore';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  children?: NavItem[];
  badge?: string;
}

const MAIN_NAV: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <Home className="w-5 h-5" />, path: '/dashboard' },
  { id: 'projects', label: 'Projects', icon: <FolderOpen className="w-5 h-5" />, path: '/projects' },
  { id: 'research', label: 'Research', icon: <BookOpen className="w-5 h-5" />, path: '/research' },
  {
    id: 'labs',
    label: 'Labs',
    icon: <Microscope className="w-5 h-5" />,
    children: [
      { id: 'aerodynamics', label: 'Aerodynamics', icon: <Wind className="w-4 h-4" />, path: '/labs/aerodynamics' },
      { id: 'structures', label: 'Structures', icon: <Layers className="w-4 h-4" />, path: '/labs/structures' },
      { id: 'propulsion', label: 'Propulsion', icon: <Rocket className="w-4 h-4" />, path: '/labs/propulsion' },
      { id: 'thermal', label: 'Thermal', icon: <Thermometer className="w-4 h-4" />, path: '/labs/thermal' },
      { id: 'materials', label: 'Materials', icon: <Wrench className="w-4 h-4" />, path: '/labs/materials' },
      { id: 'orbital', label: 'Orbital Mechanics', icon: <Radar className="w-4 h-4" />, path: '/labs/orbital' },
      { id: 'manufacturing', label: 'Manufacturing', icon: <Gauge className="w-4 h-4" />, path: '/labs/manufacturing' },
      { id: 'systems', label: 'Systems', icon: <Workflow className="w-4 h-4" />, path: '/labs/systems' },
    ],
  },
  { id: 'compute', label: 'Compute', icon: <ComputeIcon className="w-5 h-5" />, path: '/compute', badge: '0' },
  { id: 'knowledge', label: 'Knowledge', icon: <Lightbulb className="w-5 h-5" />, path: '/knowledge' },
  { id: 'marketplace', label: 'Marketplace', icon: <ShoppingCart className="w-5 h-5" />, path: '/marketplace' },
];

interface CommandCenterSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function CommandCenterSidebar({ isOpen = true, onClose }: CommandCenterSidebarProps) {
  const location = useLocation();
  const { currentProject } = useProjectStore();
  const { activeLab } = useLabStore();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['labs']));
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isActive = (path?: string) => path && location.pathname === path;

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const renderNavItem = (item: NavItem, depth = 0) => {
    const isExpanded = expandedItems.has(item.id);
    const hasChildren = item.children && item.children.length > 0;
    const active = isActive(item.path);

    return (
      <div key={item.id}>
        {hasChildren ? (
          <button
            onClick={() => toggleExpanded(item.id)}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-all ${
              isExpanded ? 'bg-aerospace-blue/10 text-aerospace-blue' : 'text-secondary-foreground hover:bg-primary/50'
            }`}
          >
            <div className="flex items-center gap-3">
              {item.icon}
              <span className="font-medium text-sm">{item.label}</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            />
          </button>
        ) : (
          <Link
            to={item.path || '#'}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
              active
                ? 'bg-aerospace-blue text-white'
                : 'text-secondary-foreground hover:bg-primary/50 hover:text-foreground'
            }`}
          >
            {item.icon}
            <span className="font-medium text-sm">{item.label}</span>
            {item.badge && (
              <span className="ml-auto text-xs bg-aerospace-warning text-primary px-2 py-0.5 rounded">
                {item.badge}
              </span>
            )}
          </Link>
        )}

        {hasChildren && isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="ml-2 mt-1 space-y-1 border-l border-secondary/20 pl-2"
          >
            {item.children.map((child) => renderNavItem(child, depth + 1))}
          </motion.div>
        )}
      </div>
    );
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-primary border-r border-secondary/20">
      {/* Header */}
      <div className="p-4 border-b border-secondary/20">
        <h1 className="text-lg font-bold text-aerospace-blue font-heading">AeroForge OS</h1>
        <p className="text-xs text-secondary-foreground mt-1">Engineering Operating System</p>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {MAIN_NAV.map((item) => renderNavItem(item))}
      </div>

      {/* Current Project Context */}
      {currentProject && (
        <div className="p-4 border-t border-secondary/20 bg-aerospace-dark/50">
          <p className="text-xs text-secondary-foreground uppercase tracking-wider mb-2">Current Project</p>
          <div className="bg-primary/50 rounded-lg p-3 border border-aerospace-blue/20">
            <p className="font-medium text-sm text-foreground truncate">{currentProject.name}</p>
            <p className="text-xs text-secondary-foreground mt-1">
              {currentProject.status === 'active' && (
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 bg-aerospace-success rounded-full" />
                  Active
                </span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* AI Copilot Quick Access */}
      <div className="p-4 border-t border-secondary/20">
        <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg bg-aerospace-blue/10 hover:bg-aerospace-blue/20 text-aerospace-blue transition-all">
          <Brain className="w-5 h-5" />
          <span className="font-medium text-sm">AI Copilot</span>
        </button>
      </div>

      {/* Settings & Logout */}
      <div className="p-4 border-t border-secondary/20 space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-secondary-foreground hover:bg-primary/50 transition-all">
          <Settings className="w-5 h-5" />
          <span className="font-medium text-sm">Settings</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-secondary-foreground hover:bg-primary/50 transition-all">
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 fixed left-0 top-0 h-screen z-40">
        {sidebarContent}
      </div>

      {/* Mobile Toggle */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-3 rounded-full bg-aerospace-blue text-white shadow-lg hover:bg-aerospace-accent transition-colors"
        >
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          exit={{ x: -300 }}
          className="lg:hidden fixed left-0 top-0 w-64 h-screen z-40"
        >
          {sidebarContent}
        </motion.div>
      )}

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}
