import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Home, Compass } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full blur-xl opacity-20"
              />
              <AlertTriangle className="w-20 h-20 text-blue-500 relative" />
            </div>
          </div>

          <h1 className="text-5xl font-bold text-white mb-2">404</h1>
          <p className="text-2xl font-bold text-slate-300 mb-4">Page Not Found</p>
          <p className="text-slate-400 mb-8">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/">
              <Button className="bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2 w-full sm:w-auto">
                <Home className="w-4 h-4" />
                Return to Home
              </Button>
            </Link>
            <Link to="/astrolab/explorer">
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 flex items-center justify-center gap-2 w-full sm:w-auto">
                <Compass className="w-4 h-4" />
                Explore ASTROLAB
              </Button>
            </Link>
          </div>

          <div className="mt-12 p-6 bg-slate-800 border border-slate-700 rounded-lg">
            <p className="text-sm text-slate-400 mb-3">
              <strong>Quick Navigation:</strong>
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Link to="/astrolab/simulations" className="text-blue-400 hover:text-blue-300">
                → Simulations
              </Link>
              <Link to="/my-lab" className="text-blue-400 hover:text-blue-300">
                → My Lab
              </Link>
              <Link to="/space-problems" className="text-blue-400 hover:text-blue-300">
                → Space Problems
              </Link>
              <Link to="/astrolab/reports" className="text-blue-400 hover:text-blue-300">
                → Reports
              </Link>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
