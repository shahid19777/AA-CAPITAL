import React, { useState } from 'react';
import { 
  Building2, 
  TrendingUp, 
  Zap, 
  Car, 
  Users, 
  MapPin, 
  CheckCircle2, 
  ShieldCheck,
  Search
} from 'lucide-react';
import { BuildingInfo } from '../types';

interface BuildingMatrixProps {
  buildings: BuildingInfo[];
  onSelectBuildingForSearch?: (buildingName: string) => void;
}

export const BuildingMatrix: React.FC<BuildingMatrixProps> = ({
  buildings,
  onSelectBuildingForSearch,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');

  const filtered = buildings.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.keyTenants.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.highlights.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade === 'all' || b.grade.includes(selectedGrade);
    return matchesSearch && matchesGrade;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 bg-teal-500/10 text-teal-400 rounded-lg">
              <Building2 className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white">
              I.I. Chundrigar Road Commercial Building Price Matrix
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            Valuation benchmarks, rental yields, power backup infrastructure, and tenant demographics across prime towers on Karachi&apos;s Wall Street.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search building or tenant type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none w-56"
            />
          </div>

          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
          >
            <option value="all">All Grades</option>
            <option value="A">Grade A / A+</option>
            <option value="B">Grade B / B+</option>
          </select>
        </div>
      </div>

      {/* Buildings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filtered.map((b, idx) => (
          <div
            key={idx}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl hover:border-slate-700 transition flex flex-col justify-between"
          >
            <div>
              {/* Top Row */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-white">{b.name}</h3>
                    <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-teal-500/10 text-teal-400 border border-teal-500/20">
                      Grade {b.grade}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>{b.address}</span>
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Rental Yield</span>
                  <span className="text-base font-black text-amber-400">{b.rentalYieldEst}</span>
                </div>
              </div>

              {/* Pricing & Yield Metrics */}
              <div className="grid grid-cols-3 gap-3 p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 mb-4 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Avg Purchase Rate</span>
                  <span className="text-white font-bold text-sm">
                    PKR {b.avgPricePerSqftPKR.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400 block">/ sq.ft.</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Monthly Rental</span>
                  <span className="text-emerald-400 font-bold text-sm">
                    PKR {b.rentalPerSqftMonthPKR}
                  </span>
                  <span className="text-[10px] text-slate-400 block">/ sq.ft. / month</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Occupancy</span>
                  <span className="text-blue-400 font-bold text-sm">{b.occupancyRate}</span>
                  <span className="text-[10px] text-slate-400 block">Corporate Demand</span>
                </div>
              </div>

              {/* Core Amenities */}
              <div className="space-y-2 text-xs mb-4">
                <div className="flex items-start gap-2 text-slate-300">
                  <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-200">Power Redundancy:</strong> {b.backupPower}
                  </div>
                </div>

                <div className="flex items-start gap-2 text-slate-300">
                  <Car className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-200">Parking Capacity:</strong> {b.parking}
                  </div>
                </div>

                <div className="flex items-start gap-2 text-slate-300">
                  <Users className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-200">Key Tenant Profile:</strong> {b.keyTenants}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed mb-4">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold mb-1">
                  Location & Asset Highlights
                </span>
                {b.highlights}
              </div>
            </div>

            {/* Quick Action */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Avg 3,000 sq.ft Floor: ~PKR {((b.avgPricePerSqftPKR * 3000) / 10000000).toFixed(1)} Crore
              </span>

              {onSelectBuildingForSearch && (
                <button
                  onClick={() => onSelectBuildingForSearch(b.name)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-teal-300 rounded-lg text-xs font-semibold border border-slate-700 transition"
                >
                  Find Buyers in {b.name.split(' ')[0]}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
