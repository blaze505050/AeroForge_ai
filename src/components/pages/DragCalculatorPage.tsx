import { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Download, Wind } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface DragSpecs {
  referenceArea: number;
  velocity: number;
  airDensity: number;
  dragCoefficient: number;
  machNumber: number;
  reynoldsNumber: number;
  surfaceRoughness: string;
}

interface DragResults {
  dynamicPressure: number;
  dragForce: number;
  dragPower: number;
  dragPerUnitArea: number;
  skinFrictionDrag: number;
  pressureDrag: number;
  inducedDrag: number;
  totalDrag: number;
}

export default function DragCalculatorPage() {
  const [specs, setSpecs] = useState<DragSpecs>({
    referenceArea: 122.6,
    velocity: 100,
    airDensity: 1.225,
    dragCoefficient: 0.025,
    machNumber: 0.3,
    reynoldsNumber: 40000000,
    surfaceRoughness: 'smooth',
  });

  const [results, setResults] = useState<DragResults | null>(null);

  const calculateDrag = () => {
    const dynamicPressure = 0.5 * specs.airDensity * specs.velocity * specs.velocity;
    const dragForce = dynamicPressure * specs.referenceArea * specs.dragCoefficient;
    const dragPower = dragForce * specs.velocity;

    // More accurate drag component estimation using physics-based models
    // Skin friction drag using Blasius equation for turbulent flow
    let skinFrictionCoefficient = 0.074 / Math.pow(specs.reynoldsNumber, 0.2);
    if (specs.surfaceRoughness === 'rough') {
      skinFrictionCoefficient *= 1.15;
    }
    let skinFrictionDrag = dynamicPressure * specs.referenceArea * skinFrictionCoefficient;

    // Pressure drag (form drag) - typically 20-30% of total for streamlined bodies
    let pressureDrag = dragForce * 0.25;

    // Induced drag - depends on lift coefficient and aspect ratio
    let inducedDrag = dragForce * 0.08;

    // Compressibility effects (Prandtl-Mach correction)
    if (specs.machNumber > 0.3) {
      const machFactor = 1 / Math.sqrt(1 - specs.machNumber * specs.machNumber);
      pressureDrag *= (machFactor - 1) * 0.3 + 1; // Gradual increase
      inducedDrag *= machFactor;
    }

    // Reynolds number effects on skin friction
    if (specs.reynoldsNumber < 1000000) {
      skinFrictionDrag *= 1.25;
    } else if (specs.reynoldsNumber > 100000000) {
      skinFrictionDrag *= 0.95;
    }

    const dragPerUnitArea = dragForce / specs.referenceArea;
    const totalDrag = skinFrictionDrag + pressureDrag + inducedDrag;

    setResults({
      dynamicPressure: dynamicPressure,
      dragForce: dragForce,
      dragPower: dragPower,
      dragPerUnitArea: dragPerUnitArea,
      skinFrictionDrag: skinFrictionDrag,
      pressureDrag: pressureDrag,
      inducedDrag: inducedDrag,
      totalDrag: totalDrag,
    });
  };

  const handleReset = () => {
    setSpecs({
      referenceArea: 122.6,
      velocity: 100,
      airDensity: 1.225,
      dragCoefficient: 0.025,
      machNumber: 0.3,
      reynoldsNumber: 40000000,
      surfaceRoughness: 'smooth',
    });
    setResults(null);
  };

  const handleDownloadResults = () => {
    if (!results) return;

    const csv = `Drag Calculator Results
Configuration
Reference Area,${specs.referenceArea.toFixed(2)} m²
Velocity,${specs.velocity.toFixed(2)} m/s
Air Density,${specs.airDensity.toFixed(4)} kg/m³
Drag Coefficient,${specs.dragCoefficient.toFixed(4)}
Mach Number,${specs.machNumber.toFixed(2)}
Reynolds Number,${specs.reynoldsNumber.toLocaleString()}

Calculated Results
Dynamic Pressure,${results.dynamicPressure.toFixed(2)} Pa
Total Drag Force,${results.dragForce.toFixed(2)} N
Drag Power,${results.dragPower.toFixed(2)} W
Drag per Unit Area,${results.dragPerUnitArea.toFixed(4)} N/m²
Skin Friction Drag,${results.skinFrictionDrag.toFixed(2)} N
Pressure Drag,${results.pressureDrag.toFixed(2)} N
Induced Drag,${results.inducedDrag.toFixed(2)} N`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'drag_calculations.csv';
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
            Drag Calculator
          </h1>
          <p className="font-paragraph text-slate-400 mb-8">
            Analyze aerodynamic drag forces and components for aircraft design
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Panel */}
            <div className="lg:col-span-1">
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 sticky top-24">
                <h2 className="font-heading text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Wind className="w-5 h-5" />
                  Drag Parameters
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="font-paragraph text-sm font-semibold text-slate-300 block mb-2">
                      Reference Area: {specs.referenceArea.toFixed(2)} m²
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="500"
                      step="1"
                      value={specs.referenceArea}
                      onChange={(e) => setSpecs({ ...specs, referenceArea: parseFloat(e.target.value) })}
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
                      Air Density: {specs.airDensity.toFixed(4)} kg/m³
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="1.5"
                      step="0.01"
                      value={specs.airDensity}
                      onChange={(e) => setSpecs({ ...specs, airDensity: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="font-paragraph text-sm font-semibold text-slate-300 block mb-2">
                      Drag Coefficient: {specs.dragCoefficient.toFixed(4)}
                    </label>
                    <input
                      type="range"
                      min="0.01"
                      max="0.5"
                      step="0.001"
                      value={specs.dragCoefficient}
                      onChange={(e) => setSpecs({ ...specs, dragCoefficient: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="font-paragraph text-sm font-semibold text-slate-300 block mb-2">
                      Mach Number: {specs.machNumber.toFixed(2)}
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="2"
                      step="0.05"
                      value={specs.machNumber}
                      onChange={(e) => setSpecs({ ...specs, machNumber: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="font-paragraph text-sm font-semibold text-slate-300 block mb-2">
                      Surface Roughness
                    </label>
                    <select
                      value={specs.surfaceRoughness}
                      onChange={(e) => setSpecs({ ...specs, surfaceRoughness: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white font-paragraph"
                    >
                      <option value="smooth">Smooth</option>
                      <option value="moderate">Moderate</option>
                      <option value="rough">Rough</option>
                    </select>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-slate-700">
                    <button
                      onClick={calculateDrag}
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
                        { label: 'Dynamic Pressure', value: results.dynamicPressure.toFixed(2), unit: 'Pa' },
                        { label: 'Total Drag Force', value: results.dragForce.toFixed(2), unit: 'N' },
                        { label: 'Drag Power', value: (results.dragPower / 1000).toFixed(2), unit: 'kW' },
                        { label: 'Drag per Unit Area', value: results.dragPerUnitArea.toFixed(4), unit: 'N/m²' },
                        { label: 'Skin Friction Drag', value: results.skinFrictionDrag.toFixed(2), unit: 'N' },
                        { label: 'Pressure Drag', value: results.pressureDrag.toFixed(2), unit: 'N' },
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
                title: 'Drag Components',
                description: 'Analyze skin friction, pressure, and induced drag separately',
              },
              {
                title: 'Compressibility Effects',
                description: 'Account for Mach number effects on drag characteristics',
              },
              {
                title: 'Performance Analysis',
                description: 'Calculate drag power and efficiency metrics',
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
