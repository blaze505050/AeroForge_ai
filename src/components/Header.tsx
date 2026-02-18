import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="w-full border-b border-secondary/20">
      <div className="max-w-[120rem] mx-auto px-[8%] py-6">
        <nav className="flex items-center justify-between">
          <Link to="/" className="font-heading text-2xl font-bold text-primary">
            AeroForge AI
          </Link>
          
          <div className="flex items-center gap-8">
            <Link 
              to="/" 
              className={`font-paragraph text-base transition-colors duration-200 ${
                isActive('/') ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/compiler" 
              className={`font-paragraph text-base transition-colors duration-200 ${
                isActive('/compiler') ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'
              }`}
            >
              Compiler
            </Link>
            <Link 
              to="/architecture" 
              className={`font-paragraph text-base transition-colors duration-200 ${
                isActive('/architecture') ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'
              }`}
            >
              Architecture
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
