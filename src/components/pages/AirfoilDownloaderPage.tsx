import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Search, Filter, Copy, Check } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface AirfoilData {
  id: string;
  name: string;
  type: string;
  thickness: number;
  camber: number;
  reynolds: number;
  description: string;
  coordinates: string;
}

const mockAirfoils: AirfoilData[] = [
  {
    id: '1',
    name: 'NACA 2412',
    type: 'General Aviation',
    thickness: 12,
    camber: 2,
    reynolds: 9000000,
    description: 'Popular general aviation airfoil with good lift characteristics',
    coordinates: 'x,y\n0.0,0.0\n0.00625,0.02128\n0.0125,0.02969\n0.025,0.04184\n0.05,0.05743',
  },
  {
    id: '2',
    name: 'NACA 0012',
    type: 'Symmetric',
    thickness: 12,
    camber: 0,
    reynolds: 6000000,
    description: 'Symmetric airfoil for aerobatic and high-speed applications',
    coordinates: 'x,y\n0.0,0.0\n0.00625,0.01269\n0.0125,0.01793\n0.025,0.02532\n0.05,0.03581',
  },
  {
    id: '3',
    name: 'NACA 4415',
    type: 'High Lift',
    thickness: 15,
    camber: 4,
    reynolds: 9000000,
    description: 'High-lift airfoil for low-speed aircraft and drones',
    coordinates: 'x,y\n0.0,0.0\n0.00625,0.02847\n0.0125,0.03987\n0.025,0.05612\n0.05,0.07743',
  },
  {
    id: '4',
    name: 'NACA 23012',
    type: 'Laminar Flow',
    thickness: 12,
    camber: 2.3,
    reynolds: 6000000,
    description: 'Laminar flow airfoil for reduced drag and improved efficiency',
    coordinates: 'x,y\n0.0,0.0\n0.00625,0.02456\n0.0125,0.03421\n0.025,0.04823\n0.05,0.06654',
  },
  {
    id: '5',
    name: 'NACA 63-206',
    type: 'Supercritical',
    thickness: 6,
    camber: 2,
    reynolds: 40000000,
    description: 'Supercritical airfoil for transonic flight regimes',
    coordinates: 'x,y\n0.0,0.0\n0.00625,0.01234\n0.0125,0.01743\n0.025,0.02456\n0.05,0.03421',
  },
  {
    id: '6',
    name: 'NACA 9015',
    type: 'Rotor Blade',
    thickness: 15,
    camber: 9,
    reynolds: 3000000,
    description: 'Rotor blade airfoil for helicopter and wind turbine applications',
    coordinates: 'x,y\n0.0,0.0\n0.00625,0.03456\n0.0125,0.04821\n0.025,0.06789\n0.05,0.09345',
  },
];

export default function AirfoilDownloaderPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedAirfoil, setSelectedAirfoil] = useState<AirfoilData | null>(null);

  const types = Array.from(new Set(mockAirfoils.map(a => a.type)));
  
  const filteredAirfoils = mockAirfoils.filter(airfoil => {
    const matchesSearch = airfoil.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         airfoil.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !selectedType || airfoil.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleDownloadCSV = (airfoil: AirfoilData) => {
    const blob = new Blob([airfoil.coordinates], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${airfoil.name.replace(/\s+/g, '_')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleCopyCoordinates = (airfoil: AirfoilData) => {
    navigator.clipboard.writeText(airfoil.coordinates);
    setCopiedId(airfoil.id);
    setTimeout(() => setCopiedId(null), 2000);
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
            Airfoil Data Downloader
          </h1>
          <p className="font-paragraph text-slate-400 mb-8">
            Search and download airfoil coordinate data in CSV format. Use natural language to find the perfect profile.
          </p>

          {/* Search and Filter */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Search Bar */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search airfoils (e.g., 'high lift', 'laminar', 'NACA 2412')..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-paragraph"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <select
                value={selectedType || ''}
                onChange={(e) => setSelectedType(e.target.value || null)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 font-paragraph"
              >
                <option value="">All Types</option>
                {types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <p className="font-paragraph text-slate-400 mb-6">
            Found {filteredAirfoils.length} airfoil{filteredAirfoils.length !== 1 ? 's' : ''}
          </p>

          {/* Airfoils Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            {filteredAirfoils.map((airfoil, index) => (
              <motion.div
                key={airfoil.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-blue-500 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-blue-500/20"
                onClick={() => setSelectedAirfoil(airfoil)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-heading text-2xl font-bold text-white">
                      {airfoil.name}
                    </h3>
                    <span className="inline-block mt-2 px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-sm font-paragraph font-medium">
                      {airfoil.type}
                    </span>
                  </div>
                </div>

                <p className="font-paragraph text-slate-400 mb-4">
                  {airfoil.description}
                </p>

                {/* Specs */}
                <div className="grid grid-cols-3 gap-4 mb-6 py-4 border-y border-slate-700">
                  <div>
                    <p className="font-paragraph text-xs text-slate-500 mb-1">Thickness</p>
                    <p className="font-heading font-bold text-white">{airfoil.thickness}%</p>
                  </div>
                  <div>
                    <p className="font-paragraph text-xs text-slate-500 mb-1">Camber</p>
                    <p className="font-heading font-bold text-white">{airfoil.camber}%</p>
                  </div>
                  <div>
                    <p className="font-paragraph text-xs text-slate-500 mb-1">Reynolds</p>
                    <p className="font-heading font-bold text-white">{(airfoil.reynolds / 1000000).toFixed(1)}M</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadCSV(airfoil);
                    }}
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-paragraph font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyCoordinates(airfoil);
                    }}
                    className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-paragraph font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    {copiedId === airfoil.id ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Detail View */}
          {selectedAirfoil && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-slate-800 rounded-xl p-8 border border-slate-700 mb-12"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-3xl font-bold text-white">
                  {selectedAirfoil.name} - Detailed View
                </h2>
                <button
                  onClick={() => setSelectedAirfoil(null)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Info */}
                <div>
                  <h3 className="font-heading text-xl font-bold text-white mb-4">
                    Specifications
                  </h3>
                  <div className="space-y-4 font-paragraph text-slate-300">
                    <div>
                      <p className="text-slate-500 text-sm mb-1">Profile Type</p>
                      <p className="text-white font-semibold">{selectedAirfoil.type}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-sm mb-1">Maximum Thickness</p>
                      <p className="text-white font-semibold">{selectedAirfoil.thickness}% of chord</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-sm mb-1">Maximum Camber</p>
                      <p className="text-white font-semibold">{selectedAirfoil.camber}% of chord</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-sm mb-1">Design Reynolds Number</p>
                      <p className="text-white font-semibold">{selectedAirfoil.reynolds.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-sm mb-1">Description</p>
                      <p className="text-white">{selectedAirfoil.description}</p>
                    </div>
                  </div>
                </div>

                {/* Coordinates Preview */}
                <div>
                  <h3 className="font-heading text-xl font-bold text-white mb-4">
                    Coordinate Data Preview
                  </h3>
                  <div className="bg-slate-900 rounded-lg p-4 border border-slate-700 max-h-64 overflow-y-auto">
                    <pre className="font-mono text-xs text-slate-300 whitespace-pre-wrap break-words">
                      {selectedAirfoil.coordinates.split('\n').slice(0, 15).join('\n')}
                      {selectedAirfoil.coordinates.split('\n').length > 15 && '\n... (more data)'}
                    </pre>
                  </div>
                  <button
                    onClick={() => handleDownloadCSV(selectedAirfoil)}
                    className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-paragraph font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Download Full CSV
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              {
                title: 'Natural Language Search',
                description: 'Find airfoils using descriptive terms like "high lift" or "laminar flow"',
              },
              {
                title: 'CSV Export',
                description: 'Download coordinate data in standard CSV format for any tool',
              },
              {
                title: 'Comprehensive Database',
                description: 'Access a curated collection of proven airfoil profiles',
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
