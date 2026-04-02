import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-aerospace-dark text-foreground font-paragraph flex flex-col">
      <Header />

      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="w-full py-16 bg-primary border-b border-secondary/20">
          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-3">
                Tools
              </h1>
              <p className="font-paragraph text-base text-secondary-foreground max-w-2xl mx-auto">
                Explore our comprehensive suite of engineering tools and resources.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content Section */}
        <section className="w-full py-16 bg-aerospace-dark">
          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <p className="text-foreground/60 text-base">Tools section coming soon...</p>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
