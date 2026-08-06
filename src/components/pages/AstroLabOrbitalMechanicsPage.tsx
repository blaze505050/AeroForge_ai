import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Copy, Calculator } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface OrbitalElements {
  a: number; // Semi-major axis (km)
  e: number; // Eccentricity
  i: number; // Inclination (degrees)
  raan: number; // Right Ascension of Ascending Node (degrees)
  aop: number; // Argument of Perigee (degrees)
  ma: number; // Mean Anomaly (degrees)
}

export default function AstroLabOrbitalMechanicsPage() {
  const navigate = useNavigate();
  const [elements, setElements] = useState<OrbitalElements>({
    a: 6678, // ISS altitude
    e: 0.0006,
    i: 51.6,
    raan: 0,
    aop: 0,
    ma: 0,
  });

  const mu = 398600.4418; // Earth's gravitational parameter (km^3/s^2)

  // Calculate orbital parameters
  const calculateOrbitalParams = () => {
    const { a, e, i, raan, aop, ma } = elements;

    // Perigee and Apogee
    const rp = a * (1 - e);
    const ra = a * (1 + e);

    // Orbital period (seconds)
    const period = 2 * Math.PI * Math.sqrt(Math.pow(a, 3) / mu);
    const periodMinutes = period / 60;
    const periodHours = periodMinutes / 60;

    // Mean motion (revolutions per day)
    const meanMotion = 86400 / period;

    // Orbital velocity at perigee and apogee
    const vp = Math.sqrt(mu * (2 / rp - 1 / a));
    const va = Math.sqrt(mu * (2 / ra - 1 / a));

    // Escape velocity at surface
    const escapeVelocity = Math.sqrt(2 * mu / rp);

    // Semi-latus rectum
    const p = a * (1 - e * e);

    // Specific orbital energy
    const energy = -mu / (2 * a);

    return {
      rp: rp - 6371, // Subtract Earth radius for altitude
      ra: ra - 6371,
      period: periodMinutes,
      periodHours,
      meanMotion,
      vp,
      va,
      escapeVelocity,
      p,
      energy,
    };
  };

  const params = calculateOrbitalParams();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-aerospace-dark text-foreground font-paragraph flex flex-col">
      <Header />

      <main className="flex-1 w-full flex flex-col">
        {/* Header */}
        <section className="w-full bg-primary border-b border-secondary/20 py-8">
          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-aerospace-blue hover:text-aerospace-accent transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </button>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
                  Orbital Mechanics Calculator
                </h1>
                <p className="font-paragraph text-lg text-secondary-foreground max-w-3xl">
                  Comprehensive orbital element calculations. Analyze Kepler elements, trajectory analysis, and orbital decay.
                </p>
              </div>
              <Calculator className="w-12 h-12 text-aerospace-blue hidden lg:block" />
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="flex-1 w-full bg-aerospace-dark py-12">
          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="bg-gradient-to-br from-aerospace-dark/60 to-aerospace-dark/40 border border-aerospace-blue/20 rounded-lg p-6">
                  <h3 className="font-heading text-lg font-bold text-foreground mb-6">Keplerian Elements</h3>
                  <div className="space-y-4">
                    {/* Semi-major Axis */}
                    <div>
                      <label className="text-xs text-foreground/60 mb-2 block">
                        Semi-major Axis (a) - km
                      </label>
                      <input
                        type="number"
                        value={elements.a}
                        onChange={(e) => setElements({ ...elements, a: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 bg-primary/40 border border-aerospace-blue/20 rounded-lg text-foreground focus:outline-none focus:border-aerospace-blue"
                      />
                      <p className="text-xs text-foreground/40 mt-1">Altitude: {(elements.a - 6371).toFixed(0)} km</p>
                    </div>

                    {/* Eccentricity */}
                    <div>
                      <label className="text-xs text-foreground/60 mb-2 block">
                        Eccentricity (e)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="1"
                        step="0.0001"
                        value={elements.e}
                        onChange={(e) => setElements({ ...elements, e: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 bg-primary/40 border border-aerospace-blue/20 rounded-lg text-foreground focus:outline-none focus:border-aerospace-blue"
                      />
                    </div>

                    {/* Inclination */}
                    <div>
                      <label className="text-xs text-foreground/60 mb-2 block">
                        Inclination (i) - degrees
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="180"
                        value={elements.i}
                        onChange={(e) => setElements({ ...elements, i: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 bg-primary/40 border border-aerospace-blue/20 rounded-lg text-foreground focus:outline-none focus:border-aerospace-blue"
                      />
                    </div>

                    {/* RAAN */}
                    <div>
                      <label className="text-xs text-foreground/60 mb-2 block">
                        RAAN (Ω) - degrees
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="360"
                        value={elements.raan}
                        onChange={(e) => setElements({ ...elements, raan: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 bg-primary/40 border border-aerospace-blue/20 rounded-lg text-foreground focus:outline-none focus:border-aerospace-blue"
                      />
                    </div>

                    {/* Argument of Perigee */}
                    <div>
                      <label className="text-xs text-foreground/60 mb-2 block">
                        Argument of Perigee (ω) - degrees
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="360"
                        value={elements.aop}
                        onChange={(e) => setElements({ ...elements, aop: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 bg-primary/40 border border-aerospace-blue/20 rounded-lg text-foreground focus:outline-none focus:border-aerospace-blue"
                      />
                    </div>

                    {/* Mean Anomaly */}
                    <div>
                      <label className="text-xs text-foreground/60 mb-2 block">
                        Mean Anomaly (M) - degrees
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="360"
                        value={elements.ma}
                        onChange={(e) => setElements({ ...elements, ma: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 bg-primary/40 border border-aerospace-blue/20 rounded-lg text-foreground focus:outline-none focus:border-aerospace-blue"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Output Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-6"
              >
                {/* Orbital Parameters */}
                <div className="bg-gradient-to-br from-aerospace-blue/20 to-aerospace-accent/20 border border-aerospace-blue/50 rounded-lg p-6">
                  <h3 className="font-heading text-lg font-bold text-foreground mb-4">Orbital Parameters</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Perigee Altitude', value: params.rp.toFixed(2), unit: 'km' },
                      { label: 'Apogee Altitude', value: params.ra.toFixed(2), unit: 'km' },
                      { label: 'Orbital Period', value: params.period.toFixed(2), unit: 'min' },
                      { label: 'Period (Hours)', value: params.periodHours.toFixed(4), unit: 'h' },
                      { label: 'Mean Motion', value: params.meanMotion.toFixed(4), unit: 'rev/day' },
                    ].map((item, idx) => (
                      <div key={idx} className="p-3 bg-primary/40 border border-aerospace-blue/20 rounded-lg">
                        <p className="text-xs text-foreground/60">{item.label}</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="font-mono text-aerospace-blue font-bold">
                            {item.value} <span className="text-xs">{item.unit}</span>
                          </p>
                          <button
                            onClick={() => copyToClipboard(item.value)}
                            className="p-1 hover:bg-aerospace-blue/20 rounded transition-colors"
                          >
                            <Copy className="w-3 h-3 text-aerospace-blue" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Velocity Parameters */}
                <div className="bg-gradient-to-br from-aerospace-accent/20 to-aerospace-blue/20 border border-aerospace-accent/50 rounded-lg p-6">
                  <h3 className="font-heading text-lg font-bold text-foreground mb-4">Velocity Parameters</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Velocity at Perigee', value: params.vp.toFixed(3), unit: 'km/s' },
                      { label: 'Velocity at Apogee', value: params.va.toFixed(3), unit: 'km/s' },
                      { label: 'Escape Velocity', value: params.escapeVelocity.toFixed(3), unit: 'km/s' },
                    ].map((item, idx) => (
                      <div key={idx} className="p-3 bg-primary/40 border border-aerospace-blue/20 rounded-lg">
                        <p className="text-xs text-foreground/60">{item.label}</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="font-mono text-aerospace-accent font-bold">
                            {item.value} <span className="text-xs">{item.unit}</span>
                          </p>
                          <button
                            onClick={() => copyToClipboard(item.value)}
                            className="p-1 hover:bg-aerospace-blue/20 rounded transition-colors"
                          >
                            <Copy className="w-3 h-3 text-aerospace-accent" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Energy & Other */}
                <div className="bg-primary/40 border border-aerospace-blue/20 rounded-lg p-6">
                  <h3 className="font-heading text-lg font-bold text-foreground mb-4">Energy & Geometry</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Specific Orbital Energy', value: params.energy.toFixed(2), unit: 'km²/s²' },
                      { label: 'Semi-latus Rectum', value: params.p.toFixed(2), unit: 'km' },
                    ].map((item, idx) => (
                      <div key={idx} className="p-3 bg-primary/40 border border-aerospace-blue/20 rounded-lg">
                        <p className="text-xs text-foreground/60">{item.label}</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="font-mono text-aerospace-blue font-bold">
                            {item.value} <span className="text-xs">{item.unit}</span>
                          </p>
                          <button
                            onClick={() => copyToClipboard(item.value)}
                            className="p-1 hover:bg-aerospace-blue/20 rounded transition-colors"
                          >
                            <Copy className="w-3 h-3 text-aerospace-blue" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
