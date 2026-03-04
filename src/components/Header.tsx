import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X, Shield, Award, ChevronDown } from 'lucide-react';

export default function Header() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  const isActive = (path: string) => location.pathname === path || (path === '/compiler' && location.pathname === '/compiler-classic');
  
  // Reorganized navigation with main categories
  const navLinks = [
    { 
      category: 'Elite Suite',
      links: [
        { path: '/elite-multi-objective-optimization', label: 'Elite Multi-Objective' },
        { path: '/turbulence-modeling-research-lab', label: 'Turbulence Lab' },
        { path: '/aerospace-design-patterns-library', label: 'Design Patterns' },
        { path: '/ai-research-assistant', label: 'AI Assistant' },
        { path: '/collaborative-workspace', label: 'Collaboration' },
      ]
    },
    { 
      category: 'Products',
      links: [
        { path: '/mechanical-cad-suite', label: 'Mechanical CAD Suite' },
        { path: '/advanced-cfd', label: 'Advanced CFD' },
        { path: '/cfd-simulator', label: 'CFD Solver' },
        { path: '/compiler', label: 'Parametric Compiler' },
      ]
    },
    {
      category: 'Research',
      links: [
        { path: '/research-hub', label: 'Research Hub' },
        { path: '/knowledge-base', label: 'Knowledge Base' },
        { path: '/advanced-turbulence-modeling', label: 'Turbulence Modeling' },
        { path: '/multi-objective-optimization', label: 'Multi-Objective Optimization' },
        { path: '/batch-processing', label: 'Batch Processing' },
      ]
    },
    {
      category: 'Documentation',
      links: [
        { path: '/aerospace-tools', label: 'Aerospace Tools' },
        { path: '/templates', label: 'Templates' },
        { path: '/cfd-datasets', label: 'CFD Datasets' },
        { path: '/robotics-templates', label: 'Robotics Templates' },
        { path: '/about-tools', label: 'Documentation' },
      ]
    },
    {
      category: 'Enterprise',
      links: [
        { path: '/certifications', label: 'Certifications' },
        { path: '/case-studies', label: 'Case Studies' },
        { path: '/architecture', label: 'Architecture' },
        { path: '/api', label: 'API Reference' },
        { path: '/dsl-docs', label: 'DSL Documentation' },
      ]
    },
    {
      category: 'Virtual Lab',
      links: [
        { path: '/virtual-lab', label: 'Virtual Lab Hub' },
        { path: '/airfoil-designer', label: 'Airfoil Designer' },
        { path: '/cfd-simulator', label: 'CFD Simulator' },
        { path: '/wing-calculator', label: 'Wing Calculator' },
        { path: '/advanced-aerospace-suite', label: 'Aerospace Suite' },
      ]
    },
    {
      category: 'Advanced Modules',
      links: [
        { path: '/structural-analysis', label: 'Structural Analysis' },
        { path: '/propulsion-systems', label: 'Propulsion Systems' },
        { path: '/aerodynamics-lab', label: 'Aerodynamics Lab' },
        { path: '/materials-lab', label: 'Materials Lab' },
        { path: '/systems-integration', label: 'Systems Integration' },
      ]
    }
  ];
  
  return (
    <header className="w-full bg-primary sticky top-0 z-50 border-b border-secondary/20">
      {/* Trust Badges Bar */}
      <div className="w-full bg-aerospace-dark/50 border-b border-secondary/10 px-4 md:px-[8%] py-2.5">
        <div className="max-w-[120rem] mx-auto flex items-center justify-end gap-6 text-xs md:text-sm">
          <div className="flex items-center gap-2 text-aerospace-success">
            <Shield className="w-4 h-4" />
            <span className="font-mono">ISO 9001:2015 Certified</span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-aerospace-accent">
            <Award className="w-4 h-4" />
            <span className="font-mono">Aerospace Grade</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-[120rem] mx-auto px-4 md:px-[8%] py-4 md:py-5">
        <nav className="flex items-center justify-between">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
            <div className="relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-aerospace-blue to-aerospace-accent rounded-lg opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 font-heading font-bold text-white text-lg md:text-xl">AF</div>
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-lg md:text-xl font-bold text-aerospace-blue group-hover:text-aerospace-accent transition-colors">
                AeroForge
              </span>
              <span className="font-mono text-xs text-aerospace-accent/70">Enterprise Edition</span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((category) => (
              <div key={category.category} className="relative group">
                <button className="font-paragraph text-sm font-semibold text-foreground hover:text-aerospace-blue transition-colors py-2 px-4 rounded-md hover:bg-secondary/10 flex items-center gap-1.5">
                  {category.category}
                  <ChevronDown className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                </button>
                {/* Dropdown Menu */}
                <div className="absolute left-0 mt-0 w-56 bg-primary border border-secondary/20 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 z-50">
                  {category.links.map(link => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`block px-4 py-2.5 text-sm font-paragraph transition-colors ${
                        isActive(link.path) 
                          ? 'text-aerospace-blue bg-secondary/15 border-l-2 border-aerospace-blue' 
                          : 'text-foreground hover:text-aerospace-blue hover:bg-secondary/10'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-foreground hover:text-aerospace-blue transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-secondary/20 pt-4 max-h-[calc(100vh-200px)] overflow-y-auto">
            <div className="flex flex-col gap-2">
              {navLinks.map((category) => (
                <div key={category.category}>
                  <button
                    onClick={() => setOpenDropdown(openDropdown === category.category ? null : category.category)}
                    className="w-full px-3 py-2 font-mono text-xs uppercase tracking-widest text-aerospace-blue/70 font-semibold hover:text-aerospace-blue transition-colors flex items-center justify-between"
                  >
                    {category.category}
                    <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === category.category ? 'rotate-180' : ''}`} />
                  </button>
                  {openDropdown === category.category && (
                    <div className="pl-2 space-y-1">
                      {category.links.map(link => (
                        <Link 
                          key={link.path}
                          to={link.path}
                          onClick={() => setIsMenuOpen(false)}
                          className={`block px-4 py-2 text-sm font-paragraph rounded transition-colors ${
                            isActive(link.path) ? 'text-aerospace-blue font-semibold bg-slate-800' : 'text-foreground hover:text-aerospace-blue hover:bg-slate-800'
                          }`}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
