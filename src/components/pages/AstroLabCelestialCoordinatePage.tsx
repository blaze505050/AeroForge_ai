import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Settings, Copy, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AstroLabCelestialCoordinatePage() {
  const navigate = useNavigate();
  const [ra, setRA] = useState('12:00:00');
  const [dec, setDec] = useState('45:00:00');
  const [lat, setLat] = useState('40.7128');
  const [lon, setLon] = useState('-74.0060');
  const [jd, setJD] = useState(2460000);
  const [copied, setCopied] = useState(false);

  const calculateAltAz = () => {
    // Simplified calculation for demonstration
    const raHours = parseInt(ra.split(':')[0]);
    const decDeg = parseFloat(dec.split(':')[0]);
    const latDeg = parseFloat(lat);
    
    const alt = Math.asin(Math.sin(decDeg * Math.PI / 180) * Math.sin(latDeg * Math.PI / 180) +
                         Math.cos(decDeg * Math.PI / 180) * Math.cos(latDeg * Math.PI / 180) * 
                         Math.cos((raHours - 12) * 15 * Math.PI / 180)) * 180 / Math.PI;
    const az = Math.atan2(Math.sin((raHours - 12) * 15 * Math.PI / 180),
                         Math.cos((raHours - 12) * 15 * Math.PI / 180) * Math.sin(latDeg * Math.PI / 180) -
                         Math.tan(decDeg * Math.PI / 180) * Math.cos(latDeg * Math.PI / 180)) * 180 / Math.PI + 180;
    
    return { alt: alt.toFixed(2), az: (az % 360).toFixed(2) };
  };

  const calculateGMST = () => {
    const jd2000 = 2451545.0;
    const T = (jd - jd2000) / 36525;
    const gmst = 18.697374558 + 24110.54841 * T + 0.093104 * T * T - 6.2e-6 * T * T * T;
    const gmstHours = (gmst / 3600) % 24;
    const hours = Math.floor(gmstHours);
    const minutes = Math.floor((gmstHours - hours) * 60);
    const seconds = ((gmstHours - hours) * 60 - minutes) * 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).toFixed(0).padStart(2, '0')}`;
  };

  const { alt, az } = calculateAltAz();
  const gmst = calculateGMST();

  const copyToClipboard = () => {
    const data = `RA: ${ra}\nDec: ${dec}\nLat: ${lat}\nLon: ${lon}\nAlt: ${alt}°\nAz: ${az}°\nJD: ${jd}\nGMST: ${gmst}`;
    navigator.clipboard.writeText(data);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-foreground flex flex-col">
      <Header />
      
      <main className="flex-1 w-full max-w-[120rem] mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/astrolab')} className="p-2 hover:bg-[#131924] rounded-lg transition">
                <ArrowLeft size={20} className="text-[#00F0FF]" />
              </button>
              <div>
                <h1 className="text-4xl font-bold text-[#00F0FF] font-mono">Celestial Coordinate System</h1>
                <p className="text-secondary-foreground text-sm">Ephemeris calculations & coordinate transformations</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-[#131924] rounded-lg transition">
                <Download size={20} className="text-[#00F0FF]" />
              </button>
              <button className="p-2 hover:bg-[#131924] rounded-lg transition">
                <Settings size={20} className="text-[#00F0FF]" />
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Controls */}
            <div className="space-y-4">
              <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-6">
                <h3 className="text-lg font-bold text-[#00F0FF] font-mono mb-4">Observer Location</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-mono text-[#FF007A]">Latitude (°)</label>
                    <input
                      type="text"
                      value={lat}
                      onChange={(e) => setLat(e.target.value)}
                      className="w-full mt-2 px-3 py-2 bg-[#0B0E14] border border-[#00F0FF33] rounded text-[#00F0FF] font-mono text-sm focus:border-[#00F0FF] outline-none transition"
                    />
                    <div className="text-xs text-secondary-foreground mt-1">Range: -90 to +90</div>
                  </div>
                  <div>
                    <label className="text-xs font-mono text-[#FF007A]">Longitude (°)</label>
                    <input
                      type="text"
                      value={lon}
                      onChange={(e) => setLon(e.target.value)}
                      className="w-full mt-2 px-3 py-2 bg-[#0B0E14] border border-[#00F0FF33] rounded text-[#00F0FF] font-mono text-sm focus:border-[#00F0FF] outline-none transition"
                    />
                    <div className="text-xs text-secondary-foreground mt-1">Range: -180 to +180</div>
                  </div>
                  <div>
                    <label className="text-xs font-mono text-[#FF007A]">Julian Date</label>
                    <input
                      type="number"
                      value={jd}
                      onChange={(e) => setJD(parseFloat(e.target.value))}
                      className="w-full mt-2 px-3 py-2 bg-[#0B0E14] border border-[#00F0FF33] rounded text-[#00F0FF] font-mono text-sm focus:border-[#00F0FF] outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* Target Coordinates */}
              <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-6">
                <h3 className="text-lg font-bold text-[#00F0FF] font-mono mb-4">Target Coordinates</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-mono text-[#FF007A]">RA (HH:MM:SS)</label>
                    <input
                      type="text"
                      value={ra}
                      onChange={(e) => setRA(e.target.value)}
                      placeholder="HH:MM:SS"
                      className="w-full mt-2 px-3 py-2 bg-[#0B0E14] border border-[#00F0FF33] rounded text-[#00F0FF] font-mono text-sm focus:border-[#00F0FF] outline-none transition"
                    />
                    <div className="text-xs text-secondary-foreground mt-1">Range: 0h to 24h</div>
                  </div>
                  <div>
                    <label className="text-xs font-mono text-[#FF007A]">Dec (DD:MM:SS)</label>
                    <input
                      type="text"
                      value={dec}
                      onChange={(e) => setDec(e.target.value)}
                      placeholder="DD:MM:SS"
                      className="w-full mt-2 px-3 py-2 bg-[#0B0E14] border border-[#00F0FF33] rounded text-[#00F0FF] font-mono text-sm focus:border-[#00F0FF] outline-none transition"
                    />
                    <div className="text-xs text-secondary-foreground mt-1">Range: -90° to +90°</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-4">
              {/* Horizontal Coordinates */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-6"
              >
                <h3 className="text-lg font-bold text-[#00F0FF] font-mono mb-4">Horizontal Coordinates</h3>
                <div className="space-y-4">
                  <div className="bg-[#0B0E14] p-4 rounded border border-[#00F0FF33]">
                    <div className="text-xs font-mono text-[#FF007A] mb-1">Altitude</div>
                    <div className="text-3xl font-bold text-[#00F0FF] font-mono">{alt}°</div>
                    <div className="text-xs text-secondary-foreground mt-1">Above horizon</div>
                  </div>
                  <div className="bg-[#0B0E14] p-4 rounded border border-[#00F0FF33]">
                    <div className="text-xs font-mono text-[#FF007A] mb-1">Azimuth</div>
                    <div className="text-3xl font-bold text-[#00F0FF] font-mono">{az}°</div>
                    <div className="text-xs text-secondary-foreground mt-1">From North</div>
                  </div>
                </div>
              </motion.div>

              {/* Time Systems */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-6"
              >
                <h3 className="text-lg font-bold text-[#00F0FF] font-mono mb-4">Time Systems</h3>
                <div className="space-y-3 text-sm font-mono">
                  <div className="bg-[#0B0E14] p-3 rounded border border-[#00F0FF33]">
                    <span className="text-[#FF007A]">JD:</span>
                    <span className="text-[#00F0FF] ml-2">{jd}</span>
                  </div>
                  <div className="bg-[#0B0E14] p-3 rounded border border-[#00F0FF33]">
                    <span className="text-[#FF007A]">GMST:</span>
                    <span className="text-[#00F0FF] ml-2">{gmst}</span>
                  </div>
                </div>
                <button
                  onClick={copyToClipboard}
                  className={`w-full mt-4 px-3 py-2 rounded-lg font-mono text-xs transition-all flex items-center justify-center gap-2 ${
                    copied
                      ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]'
                      : 'bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF] hover:bg-[#00F0FF]/30'
                  }`}
                >
                  <Copy size={14} />
                  {copied ? 'Copied!' : 'Copy All'}
                </button>
              </motion.div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-6">
            <h3 className="text-lg font-bold text-[#00F0FF] font-mono mb-3 flex items-center gap-2">
              <Zap size={18} />
              Coordinate Systems
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-semibold text-foreground mb-2">Equatorial</div>
                <div className="text-secondary-foreground text-xs">
                  Right Ascension (RA) and Declination (Dec) - fixed to celestial sphere
                </div>
              </div>
              <div>
                <div className="font-semibold text-foreground mb-2">Horizontal</div>
                <div className="text-secondary-foreground text-xs">
                  Altitude and Azimuth - relative to observer's horizon
                </div>
              </div>
              <div>
                <div className="font-semibold text-foreground mb-2">Time</div>
                <div className="text-secondary-foreground text-xs">
                  Julian Date (JD) and Greenwich Mean Sidereal Time (GMST)
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
