import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Copy, RotateCw, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface CoordinateData {
  ra: number;
  dec: number;
  alt: number;
  az: number;
  epoch: string;
  distance?: number;
}

export default function AstroLabCelestialCoordinatePage() {
  const navigate = useNavigate();
  const [raHours, setRaHours] = useState(12);
  const [raMinutes, setRaMinutes] = useState(30);
  const [raSeconds, setRaSeconds] = useState(45);
  const [decDegrees, setDecDegrees] = useState(45);
  const [decMinutes, setDecMinutes] = useState(15);
  const [decSeconds, setDecSeconds] = useState(30);
  const [epoch, setEpoch] = useState('J2000');
  const [latitude, setLatitude] = useState(40);
  const [longitude, setLongitude] = useState(-74);
  const [jd, setJd] = useState(2460000);

  // Convert RA/Dec to decimal degrees
  const raDecimal = raHours + raMinutes / 60 + raSeconds / 3600;
  const decDecimal = decDegrees + decMinutes / 60 + decSeconds / 3600;

  // Simple horizontal coordinate conversion (simplified)
  const calculateHorizontal = () => {
    const ha = (jd * 360 / 365.25 - raDecimal * 15) % 360;
    const alt = Math.asin(
      Math.sin(decDecimal * Math.PI / 180) * Math.sin(latitude * Math.PI / 180) +
      Math.cos(decDecimal * Math.PI / 180) * Math.cos(latitude * Math.PI / 180) * Math.cos(ha * Math.PI / 180)
    ) * 180 / Math.PI;

    const az = Math.atan2(
      Math.sin(ha * Math.PI / 180),
      Math.cos(ha * Math.PI / 180) * Math.sin(latitude * Math.PI / 180) -
      Math.tan(decDecimal * Math.PI / 180) * Math.cos(latitude * Math.PI / 180)
    ) * 180 / Math.PI + 180;

    return { alt, az: (az + 360) % 360 };
  };

  const horizontal = calculateHorizontal();

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
                  Celestial Coordinate System & Ephemeris
                </h1>
                <p className="font-paragraph text-lg text-secondary-foreground max-w-3xl">
                  Advanced coordinate transformations and ephemeris calculations. Convert between RA/Dec and Alt/Az coordinates.
                </p>
              </div>
              <Compass className="w-12 h-12 text-aerospace-blue hidden lg:block" />
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
                {/* RA Input */}
                <div className="bg-gradient-to-br from-aerospace-dark/60 to-aerospace-dark/40 border border-aerospace-blue/20 rounded-lg p-6">
                  <h3 className="font-heading text-lg font-bold text-foreground mb-4">Right Ascension (RA)</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs text-foreground/60">Hours</label>
                        <input
                          type="number"
                          min="0"
                          max="23"
                          value={raHours}
                          onChange={(e) => setRaHours(parseFloat(e.target.value))}
                          className="w-full px-3 py-2 bg-primary/40 border border-aerospace-blue/20 rounded-lg text-foreground focus:outline-none focus:border-aerospace-blue"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-foreground/60">Minutes</label>
                        <input
                          type="number"
                          min="0"
                          max="59"
                          value={raMinutes}
                          onChange={(e) => setRaMinutes(parseFloat(e.target.value))}
                          className="w-full px-3 py-2 bg-primary/40 border border-aerospace-blue/20 rounded-lg text-foreground focus:outline-none focus:border-aerospace-blue"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-foreground/60">Seconds</label>
                        <input
                          type="number"
                          min="0"
                          max="59"
                          value={raSeconds}
                          onChange={(e) => setRaSeconds(parseFloat(e.target.value))}
                          className="w-full px-3 py-2 bg-primary/40 border border-aerospace-blue/20 rounded-lg text-foreground focus:outline-none focus:border-aerospace-blue"
                        />
                      </div>
                    </div>
                    <div className="p-3 bg-primary/40 border border-aerospace-blue/20 rounded-lg">
                      <p className="text-xs text-foreground/60">Decimal</p>
                      <p className="font-mono text-aerospace-blue font-bold">{raDecimal.toFixed(6)}°</p>
                    </div>
                  </div>
                </div>

                {/* Dec Input */}
                <div className="bg-gradient-to-br from-aerospace-dark/60 to-aerospace-dark/40 border border-aerospace-blue/20 rounded-lg p-6">
                  <h3 className="font-heading text-lg font-bold text-foreground mb-4">Declination (Dec)</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs text-foreground/60">Degrees</label>
                        <input
                          type="number"
                          min="-90"
                          max="90"
                          value={decDegrees}
                          onChange={(e) => setDecDegrees(parseFloat(e.target.value))}
                          className="w-full px-3 py-2 bg-primary/40 border border-aerospace-blue/20 rounded-lg text-foreground focus:outline-none focus:border-aerospace-blue"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-foreground/60">Minutes</label>
                        <input
                          type="number"
                          min="0"
                          max="59"
                          value={decMinutes}
                          onChange={(e) => setDecMinutes(parseFloat(e.target.value))}
                          className="w-full px-3 py-2 bg-primary/40 border border-aerospace-blue/20 rounded-lg text-foreground focus:outline-none focus:border-aerospace-blue"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-foreground/60">Seconds</label>
                        <input
                          type="number"
                          min="0"
                          max="59"
                          value={decSeconds}
                          onChange={(e) => setDecSeconds(parseFloat(e.target.value))}
                          className="w-full px-3 py-2 bg-primary/40 border border-aerospace-blue/20 rounded-lg text-foreground focus:outline-none focus:border-aerospace-blue"
                        />
                      </div>
                    </div>
                    <div className="p-3 bg-primary/40 border border-aerospace-blue/20 rounded-lg">
                      <p className="text-xs text-foreground/60">Decimal</p>
                      <p className="font-mono text-aerospace-blue font-bold">{decDecimal.toFixed(6)}°</p>
                    </div>
                  </div>
                </div>

                {/* Observer Location */}
                <div className="bg-gradient-to-br from-aerospace-dark/60 to-aerospace-dark/40 border border-aerospace-blue/20 rounded-lg p-6">
                  <h3 className="font-heading text-lg font-bold text-foreground mb-4">Observer Location</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-foreground/60">Latitude</label>
                      <input
                        type="number"
                        min="-90"
                        max="90"
                        value={latitude}
                        onChange={(e) => setLatitude(parseFloat(e.target.value))}
                        className="w-full px-3 py-2 bg-primary/40 border border-aerospace-blue/20 rounded-lg text-foreground focus:outline-none focus:border-aerospace-blue"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-foreground/60">Longitude</label>
                      <input
                        type="number"
                        min="-180"
                        max="180"
                        value={longitude}
                        onChange={(e) => setLongitude(parseFloat(e.target.value))}
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
                {/* Horizontal Coordinates */}
                <div className="bg-gradient-to-br from-aerospace-blue/20 to-aerospace-accent/20 border border-aerospace-blue/50 rounded-lg p-6">
                  <h3 className="font-heading text-lg font-bold text-foreground mb-4">Horizontal Coordinates</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-primary/40 border border-aerospace-blue/20 rounded-lg">
                      <p className="text-xs text-foreground/60 mb-2">Altitude (Alt)</p>
                      <div className="flex items-center justify-between">
                        <p className="font-mono text-2xl text-aerospace-blue font-bold">
                          {horizontal.alt.toFixed(2)}°
                        </p>
                        <button
                          onClick={() => copyToClipboard(horizontal.alt.toFixed(2))}
                          className="p-2 hover:bg-aerospace-blue/20 rounded-lg transition-colors"
                        >
                          <Copy className="w-4 h-4 text-aerospace-blue" />
                        </button>
                      </div>
                    </div>

                    <div className="p-4 bg-primary/40 border border-aerospace-blue/20 rounded-lg">
                      <p className="text-xs text-foreground/60 mb-2">Azimuth (Az)</p>
                      <div className="flex items-center justify-between">
                        <p className="font-mono text-2xl text-aerospace-blue font-bold">
                          {horizontal.az.toFixed(2)}°
                        </p>
                        <button
                          onClick={() => copyToClipboard(horizontal.az.toFixed(2))}
                          className="p-2 hover:bg-aerospace-blue/20 rounded-lg transition-colors"
                        >
                          <Copy className="w-4 h-4 text-aerospace-blue" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Equatorial Coordinates */}
                <div className="bg-gradient-to-br from-aerospace-accent/20 to-aerospace-blue/20 border border-aerospace-accent/50 rounded-lg p-6">
                  <h3 className="font-heading text-lg font-bold text-foreground mb-4">Equatorial Coordinates</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-primary/40 border border-aerospace-blue/20 rounded-lg">
                      <p className="text-xs text-foreground/60 mb-2">RA (Decimal)</p>
                      <div className="flex items-center justify-between">
                        <p className="font-mono text-lg text-aerospace-accent font-bold">
                          {raDecimal.toFixed(6)}°
                        </p>
                        <button
                          onClick={() => copyToClipboard(raDecimal.toFixed(6))}
                          className="p-2 hover:bg-aerospace-blue/20 rounded-lg transition-colors"
                        >
                          <Copy className="w-4 h-4 text-aerospace-accent" />
                        </button>
                      </div>
                    </div>

                    <div className="p-4 bg-primary/40 border border-aerospace-blue/20 rounded-lg">
                      <p className="text-xs text-foreground/60 mb-2">Dec (Decimal)</p>
                      <div className="flex items-center justify-between">
                        <p className="font-mono text-lg text-aerospace-accent font-bold">
                          {decDecimal.toFixed(6)}°
                        </p>
                        <button
                          onClick={() => copyToClipboard(decDecimal.toFixed(6))}
                          className="p-2 hover:bg-aerospace-blue/20 rounded-lg transition-colors"
                        >
                          <Copy className="w-4 h-4 text-aerospace-accent" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Epoch Info */}
                <div className="bg-primary/40 border border-aerospace-blue/20 rounded-lg p-6">
                  <h3 className="font-heading text-lg font-bold text-foreground mb-4">Epoch & Reference</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-foreground/60">Epoch</p>
                      <p className="font-mono text-aerospace-blue">{epoch}</p>
                    </div>
                    <div>
                      <p className="text-foreground/60">Julian Date</p>
                      <p className="font-mono text-aerospace-blue">{jd}</p>
                    </div>
                    <div>
                      <p className="text-foreground/60">Observer Lat/Lon</p>
                      <p className="font-mono text-aerospace-blue">{latitude.toFixed(2)}° / {longitude.toFixed(2)}°</p>
                    </div>
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
