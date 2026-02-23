import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path || (path === '/compiler' && location.pathname === '/compiler-classic');
  
  return (
    <header className="w-full border-b border-secondary/20 bg-primary">
      <div className="max-w-[120rem] mx-auto px-[8%] py-6">
        <nav className="flex items-center justify-between">
          <Link to="/" className="font-heading text-2xl font-bold text-aerospace-blue">
            AeroForge AI
          </Link>
          
          <div className="flex items-center gap-8">
            <Link 
              to="/" 
              className={`font-paragraph text-base transition-colors duration-200 ${
                isActive('/') ? 'text-aerospace-blue font-semibold' : 'text-foreground hover:text-aerospace-blue'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/aerospace-tools" 
              className={`font-paragraph text-base transition-colors duration-200 ${
                isActive('/aerospace-tools') ? 'text-aerospace-blue font-semibold' : 'text-foreground hover:text-aerospace-blue'
              }`}
            >
              Aerospace Tools
            </Link>
            <Link 
              to="/compiler" 
              className={`font-paragraph text-base transition-colors duration-200 ${
                isActive('/compiler') ? 'text-aerospace-blue font-semibold' : 'text-foreground hover:text-aerospace-blue'
              }`}
            >
              Compiler
            </Link>
            <Link 
              to="/dsl-docs" 
              className={`font-paragraph text-base transition-colors duration-200 ${
                isActive('/dsl-docs') ? 'text-aerospace-blue font-semibold' : 'text-foreground hover:text-aerospace-blue'
              }`}
            >
              DSL Docs
            </Link>
            <Link 
              to="/api" 
              className={`font-paragraph text-base transition-colors duration-200 ${
                isActive('/api') ? 'text-aerospace-blue font-semibold' : 'text-foreground hover:text-aerospace-blue'
              }`}
            >
              API
            </Link>
            <Link 
              to="/architecture" 
              className={`font-paragraph text-base transition-colors duration-200 ${
                isActive('/architecture') ? 'text-aerospace-blue font-semibold' : 'text-foreground hover:text-aerospace-blue'
              }`}
            >
              Architecture
            </Link>
            <Link 
              to="/templates" 
              className={`font-paragraph text-base transition-colors duration-200 ${
                isActive('/templates') ? 'text-aerospace-blue font-semibold' : 'text-foreground hover:text-aerospace-blue'
              }`}
            >
              Templates
            </Link>
            <Link 
              to="/cfd-datasets" 
              className={`font-paragraph text-base transition-colors duration-200 ${
                isActive('/cfd-datasets') ? 'text-aerospace-blue font-semibold' : 'text-foreground hover:text-aerospace-blue'
              }`}
            >
              CFD Datasets
            </Link>
            <Link 
              to="/robotics-templates" 
              className={`font-paragraph text-base transition-colors duration-200 ${
                isActive('/robotics-templates') ? 'text-aerospace-blue font-semibold' : 'text-foreground hover:text-aerospace-blue'
              }`}
            >
              Robotics
            </Link>
            <Link 
              to="/about-tools" 
              className={`font-paragraph text-base transition-colors duration-200 ${
                isActive('/about-tools') ? 'text-aerospace-blue font-semibold' : 'text-foreground hover:text-aerospace-blue'
              }`}
            >
              About Tools
            </Link>
            <Link 
              to="/cad-system" 
              className={`font-paragraph text-base transition-colors duration-200 ${
                isActive('/cad-system') ? 'text-aerospace-blue font-semibold' : 'text-foreground hover:text-aerospace-blue'
              }`}
            >
              CAD System
            </Link>
            <Link 
              to="/cad-editor" 
              className={`font-paragraph text-base transition-colors duration-200 ${
                isActive('/cad-editor') ? 'text-aerospace-blue font-semibold' : 'text-foreground hover:text-aerospace-blue'
              }`}
            >
              CAD Editor
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
