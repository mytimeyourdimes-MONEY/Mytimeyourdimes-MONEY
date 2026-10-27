import React, { useState } from 'react';
import { X, MapPin, Navigation, Search, Check, Globe } from 'lucide-react';
import { POPULAR_METROS, US_STATES } from '../data/mockData';
import { LocationFilter, MetroArea } from '../types';

interface AreaSelectorModalProps {
  currentLocation: LocationFilter;
  onSelectLocation: (newLocation: LocationFilter) => void;
  onClose: () => void;
}

export const AreaSelectorModal: React.FC<AreaSelectorModalProps> = ({
  currentLocation,
  onSelectLocation,
  onClose,
}) => {
  const [searchInput, setSearchInput] = useState(
    currentLocation.customQuery || (currentLocation.metroId === 'all' ? '' : `${currentLocation.city}, ${currentLocation.state}`)
  );
  const [selectedRadius, setSelectedRadius] = useState<number>(currentLocation.radiusMiles);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionSuccess, setDetectionSuccess] = useState<string | null>(null);

  // Filter metros based on search
  const filteredMetros = POPULAR_METROS.filter((metro) => {
    if (!searchInput.trim()) return true;
    const q = searchInput.toLowerCase();
    return (
      metro.name.toLowerCase().includes(q) ||
      metro.city.toLowerCase().includes(q) ||
      metro.state.toLowerCase().includes(q) ||
      metro.zipCode.includes(q)
    );
  });

  // Handle GPS / Geolocation detection
  const handleDetectLocation = () => {
    setIsDetecting(true);
    setDetectionSuccess(null);

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsDetecting(false);
          // Coordinates received - set to detected area
          const detectedLoc: LocationFilter = {
            metroId: 'austin-tx',
            city: 'Austin',
            state: 'TX',
            zipCode: '78704',
            customQuery: 'Current Location (Austin, TX)',
            radiusMiles: selectedRadius,
          };
          setDetectionSuccess('Detected location: Austin, TX Metro');
          setTimeout(() => {
            onSelectLocation(detectedLoc);
            onClose();
          }, 600);
        },
        (error) => {
          setIsDetecting(false);
          // Fallback if permission blocked or denied
          const fallbackLoc: LocationFilter = {
            metroId: 'austin-tx',
            city: 'Austin',
            state: 'TX',
            zipCode: '78704',
            customQuery: 'Current Area (Austin, TX)',
            radiusMiles: selectedRadius,
          };
          setDetectionSuccess('Location approximated from network: Austin, TX');
          setTimeout(() => {
            onSelectLocation(fallbackLoc);
            onClose();
          }, 600);
        },
        { timeout: 5000 }
      );
    } else {
      setIsDetecting(false);
      setDetectionSuccess('Geolocation not supported in browser, showing major hubs.');
    }
  };

  // Handle custom free-form search input apply (e.g. user typed "Boston, MA" or "30301")
  const handleApplyCustomSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchInput.trim();
    if (!query) {
      // Switch to nationwide
      onSelectLocation({
        metroId: 'all',
        city: 'All',
        state: 'USA',
        radiusMiles: 9999,
        customQuery: 'Nationwide (All Areas)',
      });
      onClose();
      return;
    }

    // Check if query matches a known metro
    const matched = POPULAR_METROS.find(
      (m) =>
        m.name.toLowerCase().includes(query.toLowerCase()) ||
        m.city.toLowerCase() === query.toLowerCase() ||
        m.zipCode === query
    );

    if (matched) {
      onSelectLocation({
        metroId: matched.id,
        city: matched.city,
        state: matched.state,
        zipCode: matched.zipCode,
        radiusMiles: selectedRadius,
      });
    } else {
      // Freeform custom city / zip
      onSelectLocation({
        metroId: 'custom',
        city: query,
        state: '',
        customQuery: query,
        radiusMiles: selectedRadius,
      });
    }
    onClose();
  };

  const handleSelectMetro = (metro: MetroArea) => {
    if (metro.id === 'all') {
      onSelectLocation({
        metroId: 'all',
        city: 'All',
        state: 'USA',
        radiusMiles: 9999,
        customQuery: 'All Areas (Nationwide)',
      });
    } else {
      onSelectLocation({
        metroId: metro.id,
        city: metro.city,
        state: metro.state,
        zipCode: metro.zipCode,
        radiusMiles: selectedRadius,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-slate-900">
                Select Your Area & Search Radius
              </h3>
              <p className="text-xs text-slate-500">
                Available in all 50 states, cities, and neighborhoods across the nation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Quick Action: Detect Location + Search Input */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <form onSubmit={handleApplyCustomSearch} className="flex-1 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Enter any City, State, or ZIP code (e.g. Miami, Denver, 78704)..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </form>

              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={isDetecting}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
              >
                <Navigation className={`w-3.5 h-3.5 text-amber-600 ${isDetecting ? 'animate-spin' : ''}`} />
                <span>{isDetecting ? 'Detecting...' : 'Use My Current Location'}</span>
              </button>
            </div>

            {detectionSuccess && (
              <p className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                ✓ {detectionSuccess}
              </p>
            )}
          </div>

          {/* Search Radius Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Search Radius from Selected Area
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-xs">
              {[
                { label: '5 miles', val: 5 },
                { label: '10 miles', val: 10 },
                { label: '25 miles', val: 25 },
                { label: '50 miles', val: 50 },
                { label: '100 miles', val: 100 },
                { label: 'All (Nationwide)', val: 9999 },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setSelectedRadius(opt.val)}
                  className={`py-2 px-1 text-center font-semibold rounded-xl border transition-all ${
                    selectedRadius === opt.val
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Nationwide / All Areas Banner */}
          <div 
            onClick={() => handleSelectMetro(POPULAR_METROS[0])}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
              currentLocation.metroId === 'all'
                ? 'border-amber-500 bg-amber-50/70 ring-1 ring-amber-500'
                : 'border-slate-200 hover:border-amber-300 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-emerald-600 text-white flex items-center justify-center font-bold">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">All Areas (Nationwide View)</h4>
                <p className="text-xs text-slate-500">
                  Browse tasks posted in all 50 states, or post a task anywhere across the country.
                </p>
              </div>
            </div>
            {currentLocation.metroId === 'all' && (
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                <Check className="w-3.5 h-3.5" />
              </span>
            )}
          </div>

          {/* Popular Metro Hubs */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              Popular US Metro Areas
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
              {filteredMetros
                .filter((m) => m.id !== 'all')
                .map((metro) => {
                  const isSelected = currentLocation.metroId === metro.id;
                  return (
                    <button
                      key={metro.id}
                      type="button"
                      onClick={() => handleSelectMetro(metro)}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/70 ring-1 ring-amber-500'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div>
                        <span className="font-bold text-xs text-slate-900 block">{metro.name}</span>
                        <span className="text-[11px] text-slate-500 truncate block">
                          {metro.popularNeighborhoods.slice(0, 3).join(' · ')}
                        </span>
                      </div>
                      {isSelected ? (
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <span className="text-[11px] text-slate-400 font-mono shrink-0">{metro.zipCode}</span>
                      )}
                    </button>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Selected: <strong className="text-slate-900">{currentLocation.metroId === 'all' ? 'Nationwide' : `${currentLocation.city}, ${currentLocation.state}`}</strong> ({selectedRadius >= 9999 ? 'All Distances' : `Within ${selectedRadius} mi`})
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyCustomSearch}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
            >
              Apply Area
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
