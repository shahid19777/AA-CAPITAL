import React from 'react';
import { 
  Building2, 
  Search, 
  TrendingUp, 
  Users, 
  Calculator, 
  PlusCircle, 
  Globe, 
  Download,
  Building,
  Sparkles,
  Github
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'all' | 'buyers' | 'investors' | 'scout' | 'buildings' | 'calculator' | 'cinema';
  setActiveTab: (tab: 'all' | 'buyers' | 'investors' | 'scout' | 'buildings' | 'calculator' | 'cinema') => void;
  onOpenAddModal: () => void;
  onExportData: () => void;
  onOpenGitHubModal: () => void;
  totalLeadsCount: number;
  buyerCount: number;
  investorCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  onExportData,
  onOpenGitHubModal,
  totalLeadsCount,
  buyerCount,
  investorCount,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
      {/* Top Corporate Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-lg shadow-emerald-500/20">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  CHUNDRIGAR <span className="text-emerald-400">LEADMATRIX</span>
                </h1>
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                  LIVE DEALROOM
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span>Karachi Financial Corridor (I.I. Chundrigar Rd)</span>
                <span className="text-slate-600">•</span>
                <span className="text-amber-400 font-medium">Avg Office Yield: 12.5% - 15.0%</span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400">Rate: PKR 16k - 26k/sq.ft</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onOpenGitHubModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 transition shadow-sm"
              title="Push all code to GitHub (shahid19777/AA-CAPITAL)"
            >
              <Github className="w-3.5 h-3.5 text-emerald-400" />
              <span>Push to GitHub</span>
            </button>

            <button
              onClick={onExportData}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition shadow-sm"
              title="Export leads to CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-900/30 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Custom Lead</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 scrollbar-none border-t border-slate-800/80 pt-3">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>All Leads ({totalLeadsCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('buyers')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition whitespace-nowrap ${
              activeTab === 'buyers'
                ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Office Buyers ({buyerCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('investors')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition whitespace-nowrap ${
              activeTab === 'investors'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Yield Investors ({investorCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('scout')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition whitespace-nowrap ${
              activeTab === 'scout'
                ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-sm'
                : 'text-slate-400 hover:text-purple-300 hover:bg-slate-800/60'
            }`}
          >
            <Globe className="w-4 h-4 text-purple-400" />
            <span>Live Web Scout (Zameen/OLX/Graana)</span>
            <span className="px-1.5 py-0.2 bg-purple-500/20 text-purple-300 text-[10px] rounded font-bold">
              AI LIVE
            </span>
          </button>

          <button
            onClick={() => setActiveTab('buildings')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition whitespace-nowrap ${
              activeTab === 'buildings'
                ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                : 'text-slate-400 hover:text-teal-300 hover:bg-slate-800/60'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Building Price Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition whitespace-nowrap ${
              activeTab === 'calculator'
                ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-400 hover:text-indigo-300 hover:bg-slate-800/60'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Commercial ROI & Yield Calculator</span>
          </button>
          <button
            onClick={() => setActiveTab('cinema')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'cinema'
                ? 'bg-gradient-to-r from-amber-500/25 to-amber-600/25 text-amber-300 border border-amber-500/50 shadow-md shadow-amber-950/40'
                : 'text-amber-400/90 hover:text-amber-200 hover:bg-amber-500/10 border border-amber-500/20'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>AA Central Video Story (Voice + Music)</span>
            <span className="px-1.5 py-0.2 bg-amber-400 text-slate-950 text-[10px] rounded font-extrabold uppercase">
              NEW
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
