import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Download, Telescope, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface DeepSkyObject {
  name: string;
  label: string;
  ra: string;
  dec: string;
  distance: number;
  magnitude: number;
  type: string;
  brightness: number;
}

export default function AstroLabDeepSpaceObservationPage() {
  const navigate = useNavigate();
  const [selectedObject, setSelectedObject] = useState<DeepSkyObject | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const deepSkyObjects: DeepSkyObject[] = [
    { name: 'M31', label: 'Andromeda Galaxy', ra: '00:42:44', dec: '+41:16:09', distance: 2.5, magnitude: 3.4, type: 'Galaxy', brightness: 0.8 },
    { name: 'M42', label: 'Orion Nebula', ra: '05:35:24', dec: '-05:23:14', distance: 1.3, magnitude: 4.0, type: 'Nebula', brightness: 0.6 },
    { name: 'M1', label: 'Crab Nebula', ra: '05:34:31', dec: '+22:00:52', distance: 6.5, magnitude: 8.4, type: 'Nebula', brightness: 0.4 },
    { name: 'M16', label: 'Pillars of Creation', ra: '18:18:47', dec: '-13:47:00', distance: 7.0, magnitude: 6.0, type: 'Nebula', brightness: 0.5 },
    { name: 'M104', label: 'Sombrero Galaxy', ra: '12:39:59', dec: '-11:37:23', distance: 29.3, magnitude: 8.0, type: 'Galaxy', brightness: 0.7 },
    { name: 'M51', label: 'Whirlpool Galaxy', ra: '13:29:52', dec: '+47:11:43', distance: 23.0, magnitude: 8.4, type: 'Galaxy', brightness: 0.65 },
    { name: 'M57', label: 'Ring Nebula', ra: '18:53:35', dec: '+33:01:45', distance: 2.3, magnitude: 8.8, type: 'Nebula', brightness: 0.45 },
    { name: 'Cen A', label: 'Centaurus A', ra: '13:25:28', dec: '-43:01:09', distance: 13.7, magnitude: 6.84, type: 'Galaxy', brightness: 0.75 },
  ];

  const filtered = deepSkyObjects.filter(obj => {
    const matchesSearch = obj.label.toLowerCase().includes(searchTerm.toLowerCase()) || obj.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || obj.type === filterType;
    return matchesSearch && matchesType;
  });

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
                <h1 className="text-4xl font-bold text-[#00F0FF] font-mono">Deep-Space Observation</h1>
                <p className="text-secondary-foreground text-sm">Catalog of celestial objects & deep-sky mapping</p>
              </div>
            </div>
            <button className="p-2 hover:bg-[#131924] rounded-lg transition">
              <Download size={20} className="text-[#00F0FF]" />
            </button>
          </div>

          {/* Search & Filter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-3 text-[#00F0FF]" />
              <input
                type="text"
                placeholder="Search objects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#131924] border border-[#00F0FF33] rounded-lg text-foreground font-mono text-sm focus:border-[#00F0FF] outline-none transition"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 bg-[#131924] border border-[#00F0FF33] rounded-lg text-foreground font-mono text-sm focus:border-[#00F0FF] outline-none transition"
            >
              <option value="all">All Types</option>
              <option value="Galaxy">Galaxies</option>
              <option value="Nebula">Nebulae</option>
            </select>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sky Map */}
            <div className="lg:col-span-2 bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-6">
              <div className="aspect-square bg-gradient-to-br from-[#0B0E14] to-[#1a1f2e] rounded-lg border border-[#00F0FF33] flex items-center justify-center relative overflow-hidden">
                {/* RA/Dec Grid */}
                <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.2 }}>
                  {Array.from({ length: 24 }).map((_, i) => (
                    <line key={`ra-${i}`} x1={`${(i / 24) * 100}%`} y1="0" x2={`${(i / 24) * 100}%`} y2="100%" stroke="#00F0FF" strokeWidth="1" />
                  ))}
                  {Array.from({ length: 18 }).map((_, i) => (
                    <line key={`dec-${i}`} x1="0" y1={`${(i / 18) * 100}%`} x2="100%" y2={`${(i / 18) * 100}%`} stroke="#00F0FF" strokeWidth="1" />
                  ))}
                </svg>

                {/* Deep Sky Objects */}
                <div className="absolute inset-0">
                  {filtered.map((obj) => {
                    const raPercent = (parseInt(obj.ra.split(':')[0]) / 24) * 100;
                    const decPercent = ((parseFloat(obj.dec.split(':')[0]) + 90) / 180) * 100;
                    return (
                      <motion.button
                        key={obj.name}
                        onClick={() => setSelectedObject(obj)}
                        whileHover={{ scale: 1.3 }}
                        className={`absolute w-4 h-4 rounded-full transition-all ${
                          selectedObject?.name === obj.name
                            ? 'bg-[#FF007A] scale-150 shadow-lg shadow-[#FF007A]'
                            : 'bg-[#00F0FF] hover:scale-125'
                        }`}
                        style={{ left: `${raPercent}%`, top: `${decPercent}%`, transform: 'translate(-50%, -50%)' }}
                        title={obj.label}
                      />
                    );
                  })}
                </div>

                <div className="absolute bottom-4 left-4 text-xs font-mono text-secondary-foreground">
                  RA: 0h - 24h | Dec: -90° - +90°
                </div>
              </div>
            </div>

            {/* Inspector Card */}
            <div className="space-y-4">
              <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-6">
                <h3 className="text-lg font-bold text-[#00F0FF] font-mono mb-4 flex items-center gap-2">
                  <Telescope size={18} />
                  Object Inspector
                </h3>
                {selectedObject ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 text-sm font-mono">
                    <div>
                      <span className="text-[#FF007A]">Name:</span>
                      <div className="text-[#00F0FF] text-lg font-bold">{selectedObject.label}</div>
                    </div>
                    <div>
                      <span className="text-[#FF007A]">Catalog ID:</span>
                      <div className="text-[#00F0FF]">{selectedObject.name}</div>
                    </div>
                    <div>
                      <span className="text-[#FF007A]">Type:</span>
                      <div className="text-[#00F0FF]">{selectedObject.type}</div>
                    </div>
                    <div>
                      <span className="text-[#FF007A]">RA:</span>
                      <div className="text-[#00F0FF]">{selectedObject.ra}</div>
                    </div>
                    <div>
                      <span className="text-[#FF007A]">Dec:</span>
                      <div className="text-[#00F0FF]">{selectedObject.dec}</div>
                    </div>
                    <div>
                      <span className="text-[#FF007A]">Distance:</span>
                      <div className="text-[#00F0FF]">{selectedObject.distance} Mly</div>
                    </div>
                    <div>
                      <span className="text-[#FF007A]">Magnitude:</span>
                      <div className="text-[#00F0FF]">{selectedObject.magnitude}</div>
                    </div>
                    <div>
                      <span className="text-[#FF007A]">Brightness:</span>
                      <div className="w-full bg-[#0B0E14] rounded-full h-2 mt-1">
                        <div
                          className="bg-gradient-to-r from-[#00F0FF] to-[#FF007A] h-2 rounded-full"
                          style={{ width: `${selectedObject.brightness * 100}%` }}
                        />
                      </div>
                    </div>
                    <button className="w-full mt-4 px-4 py-2 bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF] rounded-lg font-mono text-xs hover:bg-[#00F0FF]/30 transition-all flex items-center justify-center gap-2">
                      <Zap size={14} />
                      Observe
                    </button>
                  </motion.div>
                ) : (
                  <p className="text-secondary-foreground text-sm">Select an object to view details</p>
                )}
              </div>

              {/* Stats */}
              <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-4">
                <h3 className="text-sm font-bold text-[#00F0FF] font-mono mb-3">Catalog Stats</h3>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-[#FF007A]">Total Objects:</span>
                    <span className="text-[#00F0FF]">{deepSkyObjects.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#FF007A]">Filtered:</span>
                    <span className="text-[#00F0FF]">{filtered.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#FF007A]">Avg Distance:</span>
                    <span className="text-[#00F0FF]">{(deepSkyObjects.reduce((a, b) => a + b.distance, 0) / deepSkyObjects.length).toFixed(1)} Mly</span>
                  </div>
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
