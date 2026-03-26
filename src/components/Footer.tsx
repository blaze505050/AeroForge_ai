import { Link } from 'react-router-dom';
import { Mail, Linkedin, Github, ExternalLink } from 'lucide-react';
import { Image } from '@/components/ui/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Platform',
      links: [
        { label: 'Compiler', path: '/compiler' },
        { label: 'Tools', path: '/tools' },
        { label: 'Optimization', path: '/optimization' },
        { label: 'Virtual Lab', path: '/virtual-lab' }
      ]
    },
    {
      title: 'Learn',
      links: [
        { label: 'Architecture', path: '/architecture' },
        { label: 'DSL Documentation', path: '/dsl-docs' },
        { label: 'API Reference', path: '/api' },
        { label: 'Results', path: '/results' }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About', external: true, href: '#' },
        { label: 'Blog', external: true, href: '#' },
        { label: 'Contact', external: true, href: 'mailto:info@aeroforge.ai' },
        { label: 'Status', external: true, href: '#' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy', external: true, href: '#' },
        { label: 'Terms', external: true, href: '#' },
        { label: 'Security', external: true, href: '#' },
        { label: 'Compliance', external: true, href: '#' }
      ]
    }
  ];

  return (
    <footer className="w-full bg-aerospace-dark border-t border-secondary/20 mt-auto">
      {/* Main Footer Content */}
      <div className="max-w-[120rem] mx-auto px-6 md:px-[8%] py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <Image 
                src="https://static.wixstatic.com/media/18a222_a061b26960ac4418850c196f62b8a14a~mv2.png"
                alt="AeroForge Logo"
                width={40}
                height={40}
                className="w-10 h-10 object-contain"
              />
              <div className="flex flex-col">
                <span className="font-heading text-lg font-bold text-aerospace-blue">AeroForge</span>
                <span className="font-mono text-xs text-aerospace-accent/70">Enterprise</span>
              </div>
            </Link>
            <p className="font-paragraph text-sm text-secondary-foreground leading-relaxed">
              Deterministic AI-powered design compiler for aerospace and manufacturing.
            </p>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-heading text-sm font-bold text-foreground mb-4 uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-paragraph text-sm text-secondary-foreground hover:text-aerospace-blue transition-colors flex items-center gap-2 group"
                      >
                        {link.label}
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    ) : (
                      <Link
                        to={link.path}
                        className="font-paragraph text-sm text-secondary-foreground hover:text-aerospace-blue transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-secondary/20 pt-8">
          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex flex-col gap-2">
              <p className="font-paragraph text-sm text-secondary-foreground">
                © {currentYear} AeroForge AI. All rights reserved.
              </p>
              <p className="font-mono text-xs text-aerospace-accent/60">
                ISO 9001:2015 Certified • Aerospace Grade • Enterprise Edition
              </p>
            </div>

            {/* Legal Links */}
            <div className="flex gap-6 text-sm">
              <a href="#" className="font-paragraph text-secondary-foreground hover:text-aerospace-blue transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="font-paragraph text-secondary-foreground hover:text-aerospace-blue transition-colors">
                Terms of Service
              </a>
              <a href="#" className="font-paragraph text-secondary-foreground hover:text-aerospace-blue transition-colors">
                Security
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
