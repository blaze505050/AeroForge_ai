import { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Download, Calculator } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface WingSpecs {
  wingArea: number;
  aspectRatio: number;
  wingSpan: number;
  meanChord: number;
  weight: number;
  velocity: number;
  density: number;
}

interface WingResults {
  wingArea: number;
  wingSpan: number;
  meanChord: number;
  wingLoading: number;
  dynamicPressure: number;
  liftRequired: number;
  stallSpeed: number;
  maxSpeed: number;
}

export default function WingCalculatorPage() {
  const [specs, setSpecs] = useState<WingSpecs>({
    wingArea: 122.6,
    aspectRatio: 8.5,
    wingSpan: 32.9,
    meanChord: 3.73,
    weight: 73500,
    velocity: 100,
    density: 1.225,
  });

  const [results, setResults] = useState<WingResults | null>(null);

  const calculateWing = () => {
    const wingSpan = Math.sqrt(specs.wingArea * specs.aspectRatio);
    const meanChord = specs.wingArea / wingSpan;
    const wingLoading = specs.weight / specs.wingArea;
    const dynamicPressure = 0.5 * specs.density * specs.velocity * specs.velocity;
    const liftRequired = specs.weight;
    const stallSpeed = Math.sqrt((2 * specs.weight) / (specs.density * specs.wingArea * 1.2));
    const maxSpeed = specs.velocity * 1.5;

    setResults({
      wingArea: specs.wingArea,
      wingSpan: wingSpan,
      meanChord: meanChord,
      wingLoading: wingLoading,
      dynamicPressure: dynamicPressure,
      liftRequired: liftRequired,
      stallSpeed: stallSpeed,
      maxSpeed: maxSpeed,
    });
  };

  const handleReset = () => {
    setSpecs({
      wingArea: 122.6,
      aspectRatio: 8.5,
      wingSpan: 32.9,
      meanChord: 3.73,
      weight: 73500,
      velocity: 100,
      density: 1.225,
    });
    setResults(null);
  };

  const handleDownloadResults = () => {
    if (!results) return;

    const csv = `Wing Calculator Results
Aircraft Specifications
Wing Area,${results.wingArea.toFixed(2)} m²
Wing Span,${results.wingSpan.toFixed(2)} m
Mean Chord,${results.meanChord.toFixed(2)} m
Wing Loading,${results.wingLoading.toFixed(2)} kg/m²
Dynamic Pressure,${results.dynamicPressure.toFixed(2)} Pa
Lift Required,${results.liftRequired.toFixed(2)} N
Stall Speed,${results.stallSpeed.toFixed(2)} m/s
Maximum Speed,${results.maxSpeed.toFixed(2)} m/s`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wing_calculations.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />

      <main className="w-full max-w-[120rem] mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-2">
            Wing Calculator
          </h1>
          <p className="font-paragraph text-slate-400 mb-8">
            Calculate wing performance metrics and aerodynamic characteristics
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Panel */}
            <div className="lg:col-span-1">
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 sticky top-24">
                <h2 className="font-heading text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Wing Parameters
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="font-paragraph text-sm font-semibold text-slate-300 block mb-2">
                      Wing Area: {specs.wingArea.toFixed(2)} m²
                    </label>
                    <input
                      type="range"
                      min="50"
                      max="500"
                      step="1"
                      value={specs.wingArea}
                      onChange={(e) => setSpecs({ ...specs, wingArea: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="font-paragraph text-sm font-semibold text-slate-300 block mb-2">
                      Aspect Ratio: {specs.aspectRatio.toFixed(2)}
                    </label>
                    <input
                      type="range"
                      min="2"
                      max="15"
                      step="0.1"
                      value={specs.aspectRatio}
                      onChange={(e) => setSpecs({ ...specs, aspectRatio: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="font-paragraph text-sm font-semibold text-slate-300 block mb-2">
                      Aircraft Weight: {specs.weight.toFixed(0)} kg
                    </label>
                    <input
                      type="range"
                      min="1000"
                      max="500000"
                      step="1000"
                      value={specs.weight}
                      onChange={(e) => setSpecs({ ...specs, weight: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="font-paragraph text-sm font-semibold text-slate-300 block mb-2">
                      Velocity: {specs.velocity.toFixed(2)} m/s
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="300"
                      step="1"
                      value={specs.velocity}
                      onChange={(e) => setSpecs({ ...specs, velocity: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="font-paragraph text-sm font-semibold text-slate-300 block mb-2">
                      Air Density: {specs.density.toFixed(4)} kg/m³
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="1.5"
                      step="0.01"
                      value={specs.density}
                      onChange={(e) => setSpecs({ ...specs, density: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-3 pt-4 border-t border-slate-700">
                    <button
                      onClick={calculateWing}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-paragraph font-semibold transition-colors"
                    >
                      Calculate
                    </button>
                    <button
                      onClick={handleReset}
                      className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-paragraph font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-2 space-y-6">
              {results ? (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-slate-800 rounded-xl p-8 border border-slate-700"
                  >
                    <h3 className="font-heading text-xl font-bold text-white mb-6">
                      Calculated Results
                    </h3>

                    <div className="grid grid-cols-2 gap-6">
                      {[
                        { label: 'Wing Span', value: results.wingSpan.toFixed(2), unit: 'm' },
                        { label: 'Mean Chord', value: results.meanChord.toFixed(2), unit: 'm' },
                        { label: 'Wing Loading', value: results.wingLoading.toFixed(2), unit: 'kg/m²' },
                        { label: 'Dynamic Pressure', value: results.dynamicPressure.toFixed(2), unit: 'Pa' },
                        { label: 'Stall Speed', value: results.stallSpeed.toFixed(2), unit: 'm/s' },
                        { label: 'Max Speed', value: results.maxSpeed.toFixed(2), unit: 'm/s' },
                      ].map((item, i) => (
                        <div key={i} className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                          <p className="font-paragraph text-sm text-slate-400 mb-2">
                            {item.label}
                          </p>
                          <div className="flex items-baseline gap-2">
                            <span className="font-heading text-2xl font-bold text-blue-400">
                              {item.value}
                            </span>
                            <span className="font-paragraph text-sm text-slate-500">
                              {item.unit}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  <button
                    onClick={handleDownloadResults}
                    className="w-full py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg font-paragraph font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Download Results
                  </button>
                </>
              ) : (
                <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 flex items-center justify-center h-96">
                  <p className="font-paragraph text-slate-400 text-center">
                    Adjust parameters and click Calculate to see results
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              {
                title: 'Wing Performance',
                description: 'Calculate wing span, chord, and loading characteristics',
              },
              {
                title: 'Speed Analysis',
                description: 'Determine stall speed and maximum flight velocity',
              },
              {
                title: 'Aerodynamic Data',
                description: 'Get dynamic pressure and lift requirements instantly',
              },
            ].map((feature, i) => (
              <div key={i} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <h3 className="font-heading text-lg font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="font-paragraph text-slate-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
