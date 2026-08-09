/**
 * SPACE PROBLEMS PAGE
 * Challenge board for interactive learning
 */

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SpaceProblemsBoard from '@/components/SpaceProblemsBoard';

export default function SpaceProblemsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <SpaceProblemsBoard />
      </main>
      <Footer />
    </div>
  );
}
