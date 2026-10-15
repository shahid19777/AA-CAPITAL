import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  TrendingUp, 
  Users, 
  Coins, 
  ShieldCheck, 
  Sparkles, 
  Download, 
  PlusCircle, 
  MapPin, 
  CheckCircle2,
  PhoneCall,
  Briefcase,
  Layers,
  ArrowUpDown,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Car,
  ArrowUp,
  Sun,
  Volume2
} from 'lucide-react';
import { Header } from './components/Header';
import { LeadCard } from './components/LeadCard';
import { LeadDetailModal } from './components/LeadDetailModal';
import { LiveWebScout } from './components/LiveWebScout';
import { BuildingMatrix } from './components/BuildingMatrix';
import { DealCalculator } from './components/DealCalculator';
import { AddLeadModal } from './components/AddLeadModal';
import { GitHubSyncModal } from './components/GitHubSyncModal';
import { CinematicVideoExperience } from './components/CinematicVideoExperience';
import { CanvasVideoPlayer } from './components/CanvasVideoPlayer';
import { INITIAL_LEADS, CHUNDRIGAR_BUILDINGS } from './data/leadsData';
import { Lead } from './types';

export default function App() {
  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('chundrigar_leads');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 100) {
          return parsed;
        }
      } catch (e) {
        return INITIAL_LEADS;
      }
    }
    return INITIAL_LEADS;
  });

  const [activeTab, setActiveTab] = useState<
    'all' | 'buyers' | 'investors' | 'scout' | 'buildings' | 'calculator' | 'cinema'
  >('all');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBuildingFilter, setSelectedBuildingFilter] = useState('all');
  const [selectedUrgencyFilter, setSelectedUrgencyFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'budget'>('date');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [leadsPerPage, setLeadsPerPage] = useState<number | 'all'>(24);
  const [showInlineVideo, setShowInlineVideo] = useState(true);

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('chundrigar_leads', JSON.stringify(leads));
  }, [leads]);

  // Lead counters
  const buyerCount = leads.filter((l) => l.type === 'buyer').length;
  const investorCount = leads.filter((l) => l.type === 'investor').length;

  // Filter leads
  const filteredLeads = leads
    .filter((lead) => {
      // Tab filter
      if (activeTab === 'buyers' && lead.type !== 'buyer') return false;
      if (activeTab === 'investors' && lead.type !== 'investor') return false;

      // Text search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matches =
          lead.leadName.toLowerCase().includes(query) ||
          lead.contactPerson.toLowerCase().includes(query) ||
          lead.companyType.toLowerCase().includes(query) ||
          lead.targetBuilding.toLowerCase().includes(query) ||
          lead.purpose.toLowerCase().includes(query) ||
          lead.tags.some((t) => t.toLowerCase().includes(query));
        if (!matches) return false;
      }

      // Building filter
      if (selectedBuildingFilter !== 'all') {
        if (!lead.targetBuilding.toLowerCase().includes(selectedBuildingFilter.toLowerCase())) {
          return false;
        }
      }

      // Urgency filter
      if (selectedUrgencyFilter !== 'all') {
        if (!lead.intentUrgency.toLowerCase().includes(selectedUrgencyFilter.toLowerCase())) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.verifiedDate).getTime() - new Date(a.verifiedDate).getTime();
      }
      return 0;
    });

  // Calculate paginated slice
  const totalFiltered = filteredLeads.length;
  const effectivePerPage = leadsPerPage === 'all' ? totalFiltered : leadsPerPage;
  const totalPages = Math.ceil(totalFiltered / (effectivePerPage || 1)) || 1;
  const startIndex = (currentPage - 1) * (effectivePerPage || 1);
  const paginatedLeads = leadsPerPage === 'all' 
    ? filteredLeads 
    : filteredLeads.slice(startIndex, startIndex + effectivePerPage);

  const handleAddLead = (newLead: Lead) => {
    setLeads([newLead, ...leads]);
  };

  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Type',
      'Company Name',
      'Contact Person',
      'Phone',
      'Email',
      'Target Building',
      'Required Area',
      'Budget PKR',
      'Budget USD',
      'Urgency',
      'Purpose',
      'Source',
      'Status',
    ];

    const rows = leads.map((l) => [
      l.id,
      l.type,
      `"${l.leadName.replace(/"/g, '""')}"`,
      `"${l.contactPerson.replace(/"/g, '""')}"`,
      `"${l.phone}"`,
      `"${l.email}"`,
      `"${l.targetBuilding.replace(/"/g, '""')}"`,
      `"${l.requiredArea.replace(/"/g, '""')}"`,
      `"${l.budgetPKR}"`,
      `"${l.budgetUSD}"`,
      `"${l.intentUrgency}"`,
      `"${l.purpose.replace(/"/g, '""')}"`,
      `"${l.source}"`,
      l.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Chundrigar_105_Commercial_Leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenGitHubModal={() => setIsGitHubModalOpen(true)}
        onExportData={handleExportCSV}
        totalLeadsCount={leads.length}
        buyerCount={buyerCount}
        investorCount={investorCount}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1">
        {/* Render Tabs: Leads (All, Buyers, Investors) */}
        {(activeTab === 'all' || activeTab === 'buyers' || activeTab === 'investors') && (
          <div className="space-y-6">
            {/* FEATURED VIDEO SPOTLIGHT HERO BANNER */}
            <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-slate-900 border-2 border-amber-500/40 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-400 text-slate-950 uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                      <Sparkles className="w-3.5 h-3.5 fill-current" />
                      <span>OFFICIAL CINEMATIC PROMO VIDEO</span>
                    </span>
                    <span className="text-xs text-amber-300/90 font-medium">
                      AA Central (Ground + 34 Future Business Hub)
                    </span>
                  </div>

                  <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
                    A Man Comes in the Car → Lift to Floor 28 → Furnished Office → Staff at Work
                  </h2>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Watch the complete visual narrative you requested: Executive arrival in luxury sedan at AA Central, ascending via 6 panoramic high-speed glass lifts, entering the well-furnished executive suite, thriving team at work, rooftop pool & padel club, and the 66-month payment plan announcement with full voiceover and background music!
                  </p>

                  {/* Scene Pills */}
                  <div className="flex items-center gap-2 flex-wrap pt-1 text-[11px]">
                    <span className="px-2 py-0.5 rounded-md bg-slate-950/80 border border-slate-800 text-slate-300 flex items-center gap-1">
                      <Car className="w-3 h-3 text-amber-400" />
                      <span>1. Car Arrival</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-950/80 border border-slate-800 text-slate-300 flex items-center gap-1">
                      <ArrowUp className="w-3 h-3 text-blue-400" />
                      <span>2. High-Speed Lift</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-950/80 border border-slate-800 text-slate-300 flex items-center gap-1">
                      <Briefcase className="w-3 h-3 text-emerald-400" />
                      <span>3. Furnished Office</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-950/80 border border-slate-800 text-slate-300 flex items-center gap-1">
                      <Users className="w-3 h-3 text-teal-400" />
                      <span>4. Staff Working</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-950/80 border border-slate-800 text-slate-300 flex items-center gap-1">
                      <Sun className="w-3 h-3 text-purple-400" />
                      <span>5. Rooftop Pool</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-950/80 border border-slate-800 text-slate-300 flex items-center gap-1">
                      <Coins className="w-3 h-3 text-rose-400" />
                      <span>6. 66-Mo Plan</span>
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                  <button
                    onClick={() => setShowInlineVideo(!showInlineVideo)}
                    className="flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-xl text-xs font-black shadow-xl shadow-amber-950/50 transition transform hover:scale-[1.02] cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>{showInlineVideo ? 'HIDE VIDEO PLAYER' : 'WATCH PROMO VIDEO HERE'}</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('cinema')}
                    className="flex items-center justify-center gap-2 px-4 py-3.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold transition"
                  >
                    <Maximize2 className="w-4 h-4 text-amber-400" />
                    <span>Cinema Theatre Tab</span>
                  </button>

                  <button
                    onClick={handleExportCSV}
                    className="flex items-center justify-center gap-1.5 px-4 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition"
                  >
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span>Download 105 Leads (CSV)</span>
                  </button>
                </div>
              </div>

              {/* Embedded Interactive 60-FPS Video Player */}
              {showInlineVideo && (
                <div className="mt-5 pt-5 border-t border-amber-500/30">
                  <CanvasVideoPlayer
                    autoPlay={false}
                    onOpenBookingModal={() => setIsAddModalOpen(true)}
                  />
                </div>
              )}
            </div>

            {/* Top Stats Banner */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg shadow-black/20">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Total Verified Leads
                </span>
                <span className="text-xl md:text-2xl font-black text-emerald-400 mt-1 block">
                  {leads.length} Active Leads
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>55 Buyers • 50 Investors</span>
                </span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg shadow-black/20">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Corporate Office Buyers
                </span>
                <span className="text-xl md:text-2xl font-black text-blue-400 mt-1 block">
                  {buyerCount} Companies
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <span>PSX, FinTech, Shipping, Law</span>
                </span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg shadow-black/20">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Yield Investors & Funds
                </span>
                <span className="text-xl md:text-2xl font-black text-amber-400 mt-1 block">
                  {investorCount} Syndicates
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <span>Dubai, UK, US, Faisalabad Exporters</span>
                </span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg shadow-black/20">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Tracked Capital Appetite
                </span>
                <span className="text-xl md:text-2xl font-black text-white mt-1 block">
                  PKR 980+ Crore
                </span>
                <span className="text-[11px] text-teal-400 flex items-center gap-1 mt-0.5">
                  <span>Ready for Allocation</span>
                </span>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search 105 leads by company, decision maker, tower (AA Central, BFC, Technocity), budget or tag..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none transition"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={selectedBuildingFilter}
                  onChange={(e) => {
                    setSelectedBuildingFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
                >
                  <option value="all">All Towers</option>
                  <option value="AA Central">AA Central (Future Hub)</option>
                  <option value="BFC">Business & Finance Centre</option>
                  <option value="Technocity">Technocity Tower</option>
                  <option value="Uni">Uni Tower</option>
                  <option value="Shaheen">Shaheen Complex</option>
                  <option value="Muhammadi">Muhammadi House</option>
                </select>

                <select
                  value={selectedUrgencyFilter}
                  onChange={(e) => {
                    setSelectedUrgencyFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
                >
                  <option value="all">All Timelines</option>
                  <option value="immediate">Immediate / 30 Days</option>
                  <option value="active">Active Buying</option>
                  <option value="66-Month">66-Month Installment</option>
                  <option value="closing">Closing Q4</option>
                </select>

                <select
                  value={leadsPerPage}
                  onChange={(e) => {
                    setLeadsPerPage(e.target.value === 'all' ? 'all' : Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
                >
                  <option value={12}>12 per page</option>
                  <option value={24}>24 per page</option>
                  <option value={48}>48 per page</option>
                  <option value="all">Show All 105 Leads</option>
                </select>
              </div>
            </div>

            {/* Results Header with Count & Pagination bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">
                  Showing {totalFiltered === 0 ? 0 : startIndex + 1} - {Math.min(startIndex + (effectivePerPage || 1), totalFiltered)}
                </span>
                <span>of</span>
                <span className="font-bold text-emerald-400">{totalFiltered} Matching Leads</span>
                <span className="text-slate-600">|</span>
                <span className="text-slate-400">Total in Database: <strong>{leads.length} Leads</strong></span>
              </div>

              {/* Pagination controls */}
              {leadsPerPage !== 'all' && totalPages > 1 && (
                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>

                  <span className="px-2 text-xs font-semibold text-slate-200">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Leads Grid */}
            {filteredLeads.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
                <Users className="w-10 h-10 text-slate-600 mx-auto" />
                <h3 className="text-base font-bold text-white">No Matching Leads Found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Try clearing your search query or filters to display all 105 active commercial leads.
                </p>
                <div className="flex justify-center gap-2 pt-2">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedBuildingFilter('all');
                      setSelectedUrgencyFilter('all');
                      setCurrentPage(1);
                    }}
                    className="px-3.5 py-1.5 bg-slate-800 text-slate-200 text-xs rounded-lg hover:bg-slate-700 transition"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedLeads.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    onSelectLead={(l) => setSelectedLead(l)}
                    onOpenPitch={(l) => {
                      setSelectedLead(l);
                    }}
                    onOpenOutreach={(l) => {
                      setSelectedLead(l);
                    }}
                  />
                ))}
              </div>
            )}

            {/* Bottom Pagination Bar */}
            {leadsPerPage !== 'all' && totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-800 pt-4 text-xs">
                <span className="text-slate-400">
                  Displaying Page {currentPage} of {totalPages} ({effectivePerPage} leads per page)
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 text-slate-300 transition"
                  >
                    Previous Page
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                      const pageNum = idx + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-7 h-7 rounded-lg text-xs font-bold transition ${
                            currentPage === pageNum
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 text-slate-300 transition"
                  >
                    Next Page
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: AA Central Video Story (Cinema Mode) */}
        {activeTab === 'cinema' && <CinematicVideoExperience />}

        {/* Tab 3: Live Web Scout */}
        {activeTab === 'scout' && (
          <LiveWebScout
            onSaveLeadFromWeb={(leadData) => {
              handleAddLead(leadData);
              setActiveTab('all');
            }}
          />
        )}

        {/* Tab 4: Building Price Matrix */}
        {activeTab === 'buildings' && (
          <BuildingMatrix
            buildings={CHUNDRIGAR_BUILDINGS}
            onSelectBuildingForSearch={(bName) => {
              setSelectedBuildingFilter(bName.split(' ')[0]);
              setActiveTab('all');
            }}
          />
        )}

        {/* Tab 5: Commercial ROI & Yield Calculator */}
        {activeTab === 'calculator' && <DealCalculator />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">Chundrigar LeadMatrix</span>
            <span>•</span>
            <span>105 Verified Commercial Leads & Investor Terminal</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>AA Central • Zameen • Graana • OLX • KCCI</span>
            <span>Ground + 34 | 66-Month Payment Plan</span>
          </div>
        </div>
      </footer>

      {/* Lead Detail / AI Pitch / Outreach Modal */}
      <LeadDetailModal lead={selectedLead} onClose={() => setSelectedLead(null)} />

      {/* Add Custom Lead Modal */}
      <AddLeadModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddLead={handleAddLead}
      />

      {/* GitHub Push / Sync Modal */}
      <GitHubSyncModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
      />
    </div>
  );
}
