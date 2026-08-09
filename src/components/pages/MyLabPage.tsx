/**
 * MY LAB PAGE
 * Central hub for viewing and managing experiments
 */

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MyLabDashboard from '@/components/MyLabDashboard';

export default function MyLabPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <MyLabDashboard />
      </main>
      <Footer />
    </div>
  );
}
