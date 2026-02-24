import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const isActive = (path: string) => location.pathname === path || (path === '/compiler' && location.pathname === '/compiler-classic');
  
  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/mechanical-cad-suite', label: 'CAD Suite' },
    { path: '/advanced-cfd', label: 'Advanced CFD' },
    { path: '/cfd-simulator', label: 'CFD Solver' },
    { path: '/aerospace-tools', label: 'Aerospace Tools' },
    { path: '/compiler', label: 'Compiler' },
    { path: '/templates', label: 'Templates' },
    { path: '/cfd-datasets', label: 'CFD Datasets' },
    { path: '/robotics-templates', label: 'Robotics' },
    { path: '/about-tools', label: 'Documentation' },
  ];
  
  return (
    <header className="w-full border-b border-secondary/20 bg-primary sticky top-0 z-50">
      <div className="max-w-[120rem] mx-auto px-4 md:px-[8%] py-4 md:py-6">
        <nav className="flex items-center justify-between">
          <Link to="/" className="font-heading text-xl md:text-2xl font-bold text-aerospace-blue flex-shrink-0">
            AeroForge AI
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-8">
            {navLinks.map(link => (
              <Link 
                key={link.path}
                to={link.path} 
                className={`font-paragraph text-sm xl:text-base transition-colors duration-200 whitespace-nowrap ${
                  isActive(link.path) ? 'text-aerospace-blue font-semibold' : 'text-foreground hover:text-aerospace-blue'
                }`}
              >
                {link.label}
              </Link>
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
          <div className="lg:hidden mt-4 pb-4 border-t border-secondary/20 pt-4">
            <div className="flex flex-col gap-3">
              {navLinks.map(link => (
                <Link 
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`font-paragraph text-sm py-2 px-3 rounded transition-colors duration-200 ${
                    isActive(link.path) ? 'text-aerospace-blue font-semibold bg-slate-800' : 'text-foreground hover:text-aerospace-blue hover:bg-slate-800'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
