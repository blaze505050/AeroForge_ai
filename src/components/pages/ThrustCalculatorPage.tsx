import { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Download, Zap } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface ThrustSpecs {
  engineType: string;
  fuelFlow: number;
  specificImpulse: number;
  exhaustVelocity: number;
  propellerDiameter: number;
  rpmValue: number;
  airDensity: number;
  aircraftWeight: number;
}

interface ThrustResults {
  thrustGenerated: number;
  thrustToWeight: number;
  specificThrust: number;
  propellerTip: number;
  powerOutput: number;
  fuelConsumption: number;
  thrustMargin: number;
}

export default function ThrustCalculatorPage() {
  const [specs, setSpecs] = useState<ThrustSpecs>({
    engineType: 'jet',
    fuelFlow: 2.5,
    specificImpulse: 300,
    exhaustVelocity: 2940,
    propellerDiameter: 3.5,
    rpmValue: 2000,
    airDensity: 1.225,
    aircraftWeight: 73500,
  });

  const [results, setResults] = useState<ThrustResults | null>(null);

  const calculateThrust = () => {
    let thrustGenerated = 0;
    let powerOutput = 0;

    if (specs.engineType === 'jet') {
      // Jet engine: F = ṁ * Ve
      const massFlow = specs.fuelFlow * 3.6; // Convert to kg/s
      thrustGenerated = massFlow * specs.exhaustVelocity;
      powerOutput = 0.5 * massFlow * specs.exhaustVelocity * specs.exhaustVelocity;
    } else {
      // Piston engine: F = (ρ * A * V³ * Cp) / 2
      const area = Math.PI * (specs.propellerDiameter / 2) ** 2;
      const tipSpeed = (specs.propellerDiameter / 2) * specs.rpmValue * Math.PI / 30;
      const velocity = tipSpeed * 0.7; // Effective velocity
      thrustGenerated = (specs.airDensity * area * velocity * velocity * 0.8) / 2;
      powerOutput = thrustGenerated * velocity;
    }

    const thrustToWeight = thrustGenerated / (specs.aircraftWeight * 9.81);
    const specificThrust = thrustGenerated / specs.aircraftWeight;
    const propellerTip = (specs.propellerDiameter / 2) * specs.rpmValue * Math.PI / 30;
    const fuelConsumption = specs.fuelFlow * 3600;
    const thrustMargin = ((thrustGenerated / (specs.aircraftWeight * 9.81)) - 0.3) * 100;

    setResults({
      thrustGenerated: thrustGenerated,
      thrustToWeight: thrustToWeight,
      specificThrust: specificThrust,
      propellerTip: propellerTip,
      powerOutput: powerOutput,
      fuelConsumption: fuelConsumption,
      thrustMargin: Math.max(0, thrustMargin),
    });
  };

  const handleReset = () => {
    setSpecs({
      engineType: 'jet',
      fuelFlow: 2.5,
      specificImpulse: 300,
      exhaustVelocity: 2940,
      propellerDiameter: 3.5,
      rpmValue: 2000,
      airDensity: 1.225,
      aircraftWeight: 73500,
    });
    setResults(null);
  };

  const handleDownloadResults = () => {
    if (!results) return;

    const csv = `Thrust Calculator Results
Engine Configuration
Engine Type,${specs.engineType}
Fuel Flow,${specs.fuelFlow.toFixed(2)} kg/s
Specific Impulse,${specs.specificImpulse.toFixed(0)} s
Exhaust Velocity,${specs.exhaustVelocity.toFixed(0)} m/s

Calculated Results
Thrust Generated,${results.thrustGenerated.toFixed(2)} N
Thrust-to-Weight Ratio,${results.thrustToWeight.toFixed(3)}
Specific Thrust,${results.specificThrust.toFixed(4)} N/kg
Propeller Tip Speed,${results.propellerTip.toFixed(2)} m/s
Power Output,${results.powerOutput.toFixed(2)} W
Fuel Consumption,${results.fuelConsumption.toFixed(2)} kg/h
Thrust Margin,${results.thrustMargin.toFixed(2)}%`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'thrust_calculations.csv';
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
            Thrust Calculator
          </h1>
          <p className="font-paragraph text-slate-400 mb-8">
            Calculate engine thrust and performance metrics for jet and piston engines
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Panel */}
            <div className="lg:col-span-1">
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 sticky top-24">
                <h2 className="font-heading text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Engine Parameters
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="font-paragraph text-sm font-semibold text-slate-300 block mb-2">
                      Engine Type
                    </label>
                    <select
                      value={specs.engineType}
                      onChange={(e) => setSpecs({ ...specs, engineType: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white font-paragraph"
                    >
                      <option value="jet">Jet Engine</option>
                      <option value="piston">Piston Engine</option>
                    </select>
                  </div>

                  {specs.engineType === 'jet' ? (
                    <>
                      <div>
                        <label className="font-paragraph text-sm font-semibold text-slate-300 block mb-2">
                          Fuel Flow: {specs.fuelFlow.toFixed(2)} kg/s
                        </label>
                        <input
                          type="range"
                          min="0.5"
                          max="10"
                          step="0.1"
                          value={specs.fuelFlow}
                          onChange={(e) => setSpecs({ ...specs, fuelFlow: parseFloat(e.target.value) })}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="font-paragraph text-sm font-semibold text-slate-300 block mb-2">
                          Exhaust Velocity: {specs.exhaustVelocity.toFixed(0)} m/s
                        </label>
                        <input
                          type="range"
                          min="1000"
                          max="5000"
                          step="100"
                          value={specs.exhaustVelocity}
                          onChange={(e) => setSpecs({ ...specs, exhaustVelocity: parseFloat(e.target.value) })}
                          className="w-full"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="font-paragraph text-sm font-semibold text-slate-300 block mb-2">
                          Propeller Diameter: {specs.propellerDiameter.toFixed(2)} m
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          step="0.1"
                          value={specs.propellerDiameter}
                          onChange={(e) => setSpecs({ ...specs, propellerDiameter: parseFloat(e.target.value) })}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="font-paragraph text-sm font-semibold text-slate-300 block mb-2">
                          RPM: {specs.rpmValue.toFixed(0)}
                        </label>
                        <input
                          type="range"
                          min="500"
                          max="5000"
                          step="100"
                          value={specs.rpmValue}
                          onChange={(e) => setSpecs({ ...specs, rpmValue: parseFloat(e.target.value) })}
                          className="w-full"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="font-paragraph text-sm font-semibold text-slate-300 block mb-2">
                      Aircraft Weight: {specs.aircraftWeight.toFixed(0)} kg
                    </label>
                    <input
                      type="range"
                      min="1000"
                      max="500000"
                      step="1000"
                      value={specs.aircraftWeight}
                      onChange={(e) => setSpecs({ ...specs, aircraftWeight: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-3 pt-4 border-t border-slate-700">
                    <button
                      onClick={calculateThrust}
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
                        { label: 'Thrust Generated', value: results.thrustGenerated.toFixed(2), unit: 'N' },
                        { label: 'Thrust-to-Weight', value: results.thrustToWeight.toFixed(3), unit: 'ratio' },
                        { label: 'Specific Thrust', value: results.specificThrust.toFixed(4), unit: 'N/kg' },
                        { label: 'Propeller Tip Speed', value: results.propellerTip.toFixed(2), unit: 'm/s' },
                        { label: 'Power Output', value: (results.powerOutput / 1000).toFixed(2), unit: 'kW' },
                        { label: 'Fuel Consumption', value: results.fuelConsumption.toFixed(2), unit: 'kg/h' },
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
                title: 'Jet Engine Analysis',
                description: 'Calculate thrust from fuel flow and exhaust velocity',
              },
              {
                title: 'Piston Engine Analysis',
                description: 'Determine propeller thrust and power output',
              },
              {
                title: 'Performance Metrics',
                description: 'Get thrust-to-weight ratio and fuel consumption data',
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
