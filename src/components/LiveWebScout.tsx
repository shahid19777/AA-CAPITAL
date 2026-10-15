import React, { useState } from 'react';
import { 
  Globe, 
  Search, 
  Loader2, 
  ExternalLink, 
  Sparkles, 
  Building2, 
  TrendingUp, 
  ShieldAlert, 
  RefreshCw,
  Compass,
  CheckCircle2,
  BookmarkPlus
} from 'lucide-react';
import { GroundingSource } from '../types';

interface LiveWebScoutProps {
  onSaveLeadFromWeb?: (leadData: any) => void;
}

export const LiveWebScout: React.FC<LiveWebScoutProps> = ({ onSaveLeadFromWeb }) => {
  const [query, setQuery] = useState(
    'commercial office buyers and high-yield investors "I.I. Chundrigar Road" Karachi commercial real estate Zameen Graana OLX requirements'
  );
  const [scope, setScope] = useState<'all' | 'buyers' | 'investors'>('all');
  const [building, setBuilding] = useState('All Prime Buildings (BFC, Technocity, Uni Tower)');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lastSearched, setLastSearched] = useState<string | null>(null);

  const quickPresets = [
    {
      title: 'Zameen Commercial Office Buyers',
      query: 'Zameen Karachi I.I. Chundrigar Road commercial office buyers required wanted corporate floor',
      scope: 'buyers' as const,
    },
    {
      title: 'High Net Worth Yield Investors',
      query: 'investors willing to invest commercial office rental income I.I. Chundrigar Road Karachi 12% yield',
      scope: 'investors' as const,
    },
    {
      title: 'Technocity Corporate & IT Buyers',
      query: 'Technocity Karachi office space buyer requirements IT exporters software house',
      scope: 'buyers' as const,
    },
    {
      title: 'Graana & OLX Corporate Floor Inquiries',
      query: 'Graana OLX Karachi commercial office wanted buy I.I. Chundrigar Road floor for sale',
      scope: 'all' as const,
    },
    {
      title: 'Overseas Pakistani Property Syndicates',
      query: 'overseas Pakistani investors commercial real estate Karachi Chundrigar Road office investment',
      scope: 'investors' as const,
    },
  ];

  const handleSearch = async (customQuery?: string, customScope?: 'all' | 'buyers' | 'investors') => {
    const q = customQuery || query;
    const s = customScope || scope;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/search-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          searchScope: s,
          building: building,
          intentType: s,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setReport(data.text);
        setSources(data.sources || []);
        setLastSearched(new Date().toLocaleTimeString());
      } else {
        setError(data.error || 'Failed to complete web search');
      }
    } catch (err: any) {
      setError(err.message || 'Network error while contacting search engine');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-950/80 via-slate-900 to-slate-900 border border-purple-800/40 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Globe className="w-48 h-48 text-purple-400" />
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>LIVE GOOGLE SEARCH GROUNDING</span>
            </span>
            <span className="text-xs text-slate-400">
              Scrapes & synthesizes active portals: Zameen, Graana, OLX & Estate Circles
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
            Real-Time Commercial Office & Investor Web Scout
          </h2>
          <p className="text-sm text-slate-300 mb-4 leading-relaxed">
            Scan Pakistani real estate portals, commercial estate networks, and corporate investor syndicates for active buyers & high-net-worth investors looking to acquire office space on <strong>I.I. Chundrigar Road, Karachi</strong>.
          </p>

          {/* Quick Presets */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" />
              <span>Quick Scouts:</span>
            </span>
            {quickPresets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuery(preset.query);
                  setScope(preset.scope);
                  handleSearch(preset.query, preset.scope);
                }}
                className="text-xs bg-slate-800/90 hover:bg-purple-900/40 text-slate-300 hover:text-purple-200 border border-slate-700 hover:border-purple-500/40 px-3 py-1.5 rounded-lg transition"
              >
                {preset.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-3">
          <div className="md:col-span-7 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search intent e.g., 'commercial office buyers I.I. Chundrigar Road Karachi Zameen'"
              className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={scope}
              onChange={(e: any) => setScope(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl px-3 py-2.5 text-xs text-slate-200 outline-none"
            >
              <option value="all">Target: All (Buyers & Investors)</option>
              <option value="buyers">Target: Corporate Office Buyers</option>
              <option value="investors">Target: Capital Yield Investors</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <button
              onClick={() => handleSearch()}
              disabled={loading}
              className="w-full h-full min-h-[38px] flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-lg shadow-purple-900/30 transition"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Scouting...</span>
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4" />
                  <span>Run Web Scout</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Grounded with Google Search in Pakistan domain</span>
            </span>
            <span>Targeting: Zameen.com, Graana, OLX Pakistan, KCCI, Corporate Networks</span>
          </div>
          {lastSearched && <span>Last scouted at {lastSearched}</span>}
        </div>
      </div>

      {/* Loading State Animation */}
      {loading && (
        <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-8 text-center space-y-4">
          <div className="inline-flex p-4 rounded-2xl bg-purple-500/10 text-purple-400">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white mb-1">
              Live Web Search & Lead Extraction in Progress
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Scanning real estate portals, commercial estate pages, corporate relocation feeds, and investor requirements for I.I. Chundrigar Road Karachi...
            </p>
          </div>
          <div className="flex justify-center gap-2 text-[11px] text-purple-300">
            <span className="px-2.5 py-1 bg-slate-950 rounded-md border border-slate-800">Checking Zameen.com</span>
            <span className="px-2.5 py-1 bg-slate-950 rounded-md border border-slate-800">Checking Graana</span>
            <span className="px-2.5 py-1 bg-slate-950 rounded-md border border-slate-800">Checking OLX Pakistan</span>
            <span className="px-2.5 py-1 bg-slate-950 rounded-md border border-slate-800">Checking Corporate Brokers</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 text-xs text-rose-300 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold mb-1">Live Search Note:</p>
            <p>{error}</p>
            <p className="mt-1 text-slate-400">
              Note: You can still browse our verified local database of active Chundrigar Road buyers and investors in the &quot;All Leads&quot; tab.
            </p>
          </div>
        </div>
      )}

      {/* Search Results Report */}
      {report && !loading && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Scout Intelligence Report */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                  <Building2 className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-white">Live Real Estate Intelligence Report</h3>
                  <p className="text-xs text-slate-400">Synthesized directly from live web search</p>
                </div>
              </div>
            </div>

            <div className="prose prose-invert prose-xs max-w-none space-y-4 text-slate-300 leading-relaxed font-sans whitespace-pre-line text-xs">
              {report}
            </div>
          </div>

          {/* Sources & Citations Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>Web Sources & Grounding Citations</span>
              </h4>

              {sources.length === 0 ? (
                <p className="text-xs text-slate-400">
                  Grounded live with Google Search Pakistan real estate index.
                </p>
              ) : (
                <div className="space-y-2">
                  {sources.map((source, index) => (
                    <a
                      key={index}
                      href={source.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block p-2.5 bg-slate-950 hover:bg-slate-800/80 rounded-xl border border-slate-800 hover:border-slate-700 transition"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-200 group-hover:text-emerald-400 transition line-clamp-1">
                          {source.title}
                        </span>
                        <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-emerald-400 shrink-0" />
                      </div>
                      <span className="text-[10px] text-slate-400 truncate block mt-0.5">
                        {source.uri}
                      </span>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Tips for Chundrigar Road Commercial Deals */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 text-xs space-y-3">
              <h4 className="font-semibold text-slate-200 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                <span>Closing Strategy on Chundrigar Road</span>
              </h4>
              <ul className="space-y-2 text-slate-400">
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Power Redundancy:</strong> Buyers and tenants ask first about generator backup. Highlight zero-load shedding.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Parking Allocation:</strong> Dedicated basement parking adds 15%-20% premium over street-parking units.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>FBR Section 7E:</strong> Ensure you have the latest tax exemption or paid certificates ready to expedite registration.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
