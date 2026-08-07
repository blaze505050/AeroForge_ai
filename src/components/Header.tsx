import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X, Shield, Award, Crown, Zap } from 'lucide-react';
import { Image } from '@/components/ui/image';

export default function Header() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;
  
  // Simplified navigation - only core pages
  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/universe-viewer', label: 'Universe Viewer' },
    { path: '/virtual-lab', label: 'Virtual Lab' },
    { path: '/labs/aerodynamics', label: 'Aerodynamics Lab' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/projects', label: 'Projects' },
    { path: '/compiler', label: 'Compiler' },
    { path: '/documentation', label: 'Documentation' },
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
            <Image 
              src="https://static.wixstatic.com/media/18a222_a061b26960ac4418850c196f62b8a14a~mv2.png"
              alt="AeroForge Logo"
              width={48}
              height={48}
              className="w-10 h-10 md:w-12 md:h-12 object-contain"
            />
            <div className="flex flex-col">
              <span className="font-heading text-lg md:text-xl font-bold text-aerospace-blue group-hover:text-aerospace-accent transition-colors">
                AeroForge
              </span>
              <span className="font-mono text-xs text-aerospace-accent/70">Enterprise Edition</span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-paragraph text-sm font-semibold py-2 px-4 rounded-md transition-colors flex items-center gap-2 ${
                  isActive(link.path)
                    ? 'text-aerospace-blue bg-secondary/15'
                    : 'text-foreground hover:text-aerospace-blue hover:bg-secondary/10'
                } ${link.isPremium ? 'bg-gradient-to-r from-aerospace-blue/20 to-aerospace-accent/20 border border-aerospace-blue/40 hover:border-aerospace-blue/70' : ''}`}
              >
                {link.isPremium && <Crown className="w-4 h-4 text-aerospace-blue" />}
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
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-2.5 text-sm font-paragraph rounded transition-colors flex items-center gap-2 ${
                    isActive(link.path)
                      ? 'text-aerospace-blue font-semibold bg-secondary/15'
                      : 'text-foreground hover:text-aerospace-blue hover:bg-secondary/10'
                  } ${link.isPremium ? 'bg-gradient-to-r from-aerospace-blue/20 to-aerospace-accent/20 border border-aerospace-blue/40' : ''}`}
                >
                  {link.isPremium && <Crown className="w-4 h-4 text-aerospace-blue" />}
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
