import React, { useState } from 'react';
import { 
  X, 
  Building, 
  Phone, 
  Mail, 
  MessageSquare, 
  Target, 
  Sparkles, 
  ShieldCheck, 
  Check, 
  Copy, 
  Loader2, 
  TrendingUp, 
  Coins, 
  Clock, 
  HelpCircle,
  Briefcase
} from 'lucide-react';
import { Lead, QualificationResult, OutreachContent } from '../types';

interface LeadDetailModalProps {
  lead: Lead | null;
  onClose: () => void;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({ lead, onClose }) => {
  if (!lead) return null;

  const [activeTab, setActiveTab] = useState<'profile' | 'matchmaker' | 'outreach'>('profile');

  // Property Offering state for AI qualification
  const [propertyBuilding, setPropertyBuilding] = useState(lead.targetBuilding || 'Technocity Corporate Tower');
  const [propertyArea, setPropertyArea] = useState(lead.requiredArea || '3,000 sq.ft.');
  const [propertyPrice, setPropertyPrice] = useState(lead.budgetPKR || 'PKR 8.5 Crore');
  const [propertyRent, setPropertyRent] = useState('PKR 550,000 / month');
  const [propertyAmenities, setPropertyAmenities] = useState('100% full generator backup, 2 executive parking bays, fiber optic ready, ready title');

  // AI states
  const [qualifying, setQualifying] = useState(false);
  const [qualification, setQualification] = useState<QualificationResult | null>(null);

  const [generatingOutreach, setGeneratingOutreach] = useState(false);
  const [outreach, setOutreach] = useState<OutreachContent | null>(null);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const cleanPhone = lead.phone.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Assalam-o-Alaikum ${lead.contactPerson}, I am contacting you from Karachi Commercial Real Estate regarding your office requirement in I.I. Chundrigar Road (${lead.targetBuilding}). We have prime verified inventory matching your budget ${lead.budgetPKR}. Would you be available for a brief call?`
  )}`;

  const handleRunQualification = async () => {
    setQualifying(true);
    try {
      const response = await fetch('/api/qualify-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadData: lead,
          propertyOffering: {
            building: propertyBuilding,
            area: propertyArea,
            pricePKR: propertyPrice,
            monthlyRentPKR: propertyRent,
            amenities: propertyAmenities,
          },
        }),
      });

      const data = await response.json();
      if (data.success && data.qualification) {
        setQualification(data.qualification);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setQualifying(false);
    }
  };

  const handleGenerateOutreach = async () => {
    setGeneratingOutreach(true);
    try {
      const response = await fetch('/api/generate-outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead: lead,
          property: {
            building: propertyBuilding,
            area: propertyArea,
            pricePKR: propertyPrice,
            monthlyRentPKR: propertyRent,
          },
          tone: 'Professional Karachi Commercial Executive',
        }),
      });

      const data = await response.json();
      if (data.success && data.outreach) {
        setOutreach(data.outreach);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingOutreach(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{lead.leadName}</h3>
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
                  {lead.type === 'investor' ? 'Capital Yield Investor' : 'Corporate Office Buyer'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {lead.contactPerson} ({lead.companyType})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs inside modal */}
        <div className="flex border-b border-slate-800 bg-slate-950 px-6 gap-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Lead Dossier & Contact</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('matchmaker');
              if (!qualification) handleRunQualification();
            }}
            className={`py-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'matchmaker'
                ? 'border-indigo-400 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>AI Matchmaker & Deal Pitch</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('outreach');
              if (!outreach) handleGenerateOutreach();
            }}
            className={`py-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'outreach'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>Outreach Studio (Urdu & English)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Quick Contact Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-950 rounded-xl border border-slate-800">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Direct Communication</span>
                  <div className="flex items-center gap-4 text-xs text-white">
                    <span className="flex items-center gap-1 font-mono">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      {lead.phone}
                    </span>
                    <span className="flex items-center gap-1 text-slate-300">
                      <Mail className="w-3.5 h-3.5 text-blue-400" />
                      {lead.email}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-md transition"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Open WhatsApp</span>
                  </a>

                  <a
                    href={`tel:${cleanPhone}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Direct</span>
                  </a>
                </div>
              </div>

              {/* Requirement Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-emerald-400" />
                    <span>Commercial Parameters</span>
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-800/80">
                      <span className="text-slate-400">Budget Range:</span>
                      <span className="text-emerald-400 font-bold">{lead.budgetPKR} ({lead.budgetUSD})</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/80">
                      <span className="text-slate-400">Required Floor Area:</span>
                      <span className="text-white font-medium">{lead.requiredArea}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/80">
                      <span className="text-slate-400">Preferred Location:</span>
                      <span className="text-white font-medium">{lead.targetBuilding}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/80">
                      <span className="text-slate-400">Timeline / Urgency:</span>
                      <span className="text-amber-400 font-medium">{lead.intentUrgency}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">Status:</span>
                      <span className="text-emerald-400 font-medium">{lead.status}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                    <span>Intent & Special Clauses</span>
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px] mb-0.5">Stated Purpose:</span>
                      <p className="text-slate-200 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                        {lead.purpose}
                      </p>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px] mb-0.5">Critical Requirements:</span>
                      <p className="text-slate-300 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                        {lead.specialRequirements}
                      </p>
                    </div>

                    {lead.notes && (
                      <div>
                        <span className="text-slate-400 block text-[11px] mb-0.5">Broker Intel Notes:</span>
                        <p className="text-amber-300/90 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20 text-[11px]">
                          {lead.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Source Verification Badge */}
              <div className="flex items-center justify-between text-xs text-slate-400 p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Lead Authenticity verified via: <strong>{lead.source}</strong></span>
                </span>
                <span className="text-slate-400">Recorded: {lead.verifiedDate}</span>
              </div>
            </div>
          )}

          {activeTab === 'matchmaker' && (
            <div className="space-y-6">
              {/* Property Pitch Input Form */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span>Match Lead With Your Office Inventory</span>
                  </h4>
                  <button
                    onClick={handleRunQualification}
                    disabled={qualifying}
                    className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow transition disabled:opacity-50"
                  >
                    {qualifying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    <span>{qualifying ? 'Analyzing Match...' : 'Recalculate AI Match'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400 block text-[10px] mb-1">Building</label>
                    <input
                      type="text"
                      value={propertyBuilding}
                      onChange={(e) => setPropertyBuilding(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block text-[10px] mb-1">Area (sq.ft.)</label>
                    <input
                      type="text"
                      value={propertyArea}
                      onChange={(e) => setPropertyArea(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block text-[10px] mb-1">Asking Price (PKR)</label>
                    <input
                      type="text"
                      value={propertyPrice}
                      onChange={(e) => setPropertyPrice(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block text-[10px] mb-1">Monthly Rent Yield</label>
                    <input
                      type="text"
                      value={propertyRent}
                      onChange={(e) => setPropertyRent(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* AI Qualification Output */}
              {qualifying && (
                <div className="p-8 text-center bg-slate-950 rounded-xl border border-indigo-500/30 space-y-2">
                  <Loader2 className="w-7 h-7 animate-spin text-indigo-400 mx-auto" />
                  <p className="text-xs font-semibold text-white">AI Dealroom analyzing financial compatibility...</p>
                  <p className="text-[11px] text-slate-400">Comparing budget, building specs, and buyer investment profile.</p>
                </div>
              )}

              {qualification && !qualifying && (
                <div className="space-y-4">
                  {/* Top Match Score & Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-center">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Deal Match Score</span>
                      <span className="text-2xl font-black text-emerald-400">
                        {qualification.matchScore}%
                      </span>
                      <span className="text-[10px] text-emerald-400/80 block font-medium mt-0.5">
                        {qualification.recommendation}
                      </span>
                    </div>

                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-center">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Gross Rental Yield</span>
                      <span className="text-2xl font-black text-amber-400">
                        {qualification.rentalYieldGross}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Per Annum</span>
                    </div>

                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-center">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Payback Horizon</span>
                      <span className="text-2xl font-black text-blue-400">
                        {qualification.paybackPeriodYears} Yrs
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Full Capital Recovery</span>
                    </div>

                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-center">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Section 7E Risk</span>
                      <span className="text-lg font-bold text-slate-200 mt-1 block">Low / Excluded</span>
                      <span className="text-[10px] text-emerald-400 block mt-0.5">Commercial Tenanted</span>
                    </div>
                  </div>

                  {/* Pitch Deck Highlights */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                      <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4" />
                        <span>Key Selling Points To Emphasize</span>
                      </h5>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {qualification.keySellingPoints?.map((pt, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-emerald-400 font-bold">✓</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                      <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        <HelpCircle className="w-4 h-4" />
                        <span>Anticipated Objections & Rebuttal</span>
                      </h5>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {qualification.potentialObjections?.map((obj, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-amber-400 font-bold">⚠</span>
                            <span>{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Closing Strategy */}
                  <div className="p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-xs space-y-1">
                    <span className="font-bold text-emerald-300 block uppercase text-[10px] tracking-wider">
                      Recommended Immediate Closing Action
                    </span>
                    <p className="text-slate-200">{qualification.closingStrategy}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'outreach' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    High-Conversion Outreach Templates
                  </h4>
                  <p className="text-xs text-slate-400">
                    Specifically tailored for Karachi business executives, PSX members, and expatriate investors.
                  </p>
                </div>

                <button
                  onClick={handleGenerateOutreach}
                  disabled={generatingOutreach}
                  className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow transition disabled:opacity-50"
                >
                  {generatingOutreach ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  <span>{generatingOutreach ? 'Generating...' : 'Regenerate Messages'}</span>
                </button>
              </div>

              {generatingOutreach && (
                <div className="p-8 text-center bg-slate-950 rounded-xl border border-slate-800">
                  <Loader2 className="w-7 h-7 animate-spin text-emerald-400 mx-auto mb-2" />
                  <p className="text-xs text-white">Drafting personalized Karachi commercial real estate outreach...</p>
                </div>
              )}

              {outreach && !generatingOutreach && (
                <div className="space-y-4 text-xs">
                  {/* WhatsApp English */}
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                        <MessageSquare className="w-4 h-4" />
                        <span>WhatsApp (Direct English)</span>
                      </span>
                      <button
                        onClick={() => copyToClipboard(outreach.whatsappEnglish, 'wa-en')}
                        className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] transition"
                      >
                        {copiedType === 'wa-en' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedType === 'wa-en' ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                    <pre className="font-sans text-slate-300 bg-slate-900 p-3 rounded-lg border border-slate-800/80 whitespace-pre-wrap leading-relaxed">
                      {outreach.whatsappEnglish}
                    </pre>
                  </div>

                  {/* WhatsApp Roman Urdu */}
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-400 flex items-center gap-1.5">
                        <MessageSquare className="w-4 h-4" />
                        <span>WhatsApp (Corporate Roman Urdu - Highly Effective in Karachi)</span>
                      </span>
                      <button
                        onClick={() => copyToClipboard(outreach.whatsappRomanUrdu, 'wa-ur')}
                        className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] transition"
                      >
                        {copiedType === 'wa-ur' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedType === 'wa-ur' ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                    <pre className="font-sans text-slate-300 bg-slate-900 p-3 rounded-lg border border-slate-800/80 whitespace-pre-wrap leading-relaxed">
                      {outreach.whatsappRomanUrdu}
                    </pre>
                  </div>

                  {/* Formal Email */}
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-400 flex items-center gap-1.5">
                        <Mail className="w-4 h-4" />
                        <span>Formal Executive Email</span>
                      </span>
                      <button
                        onClick={() => copyToClipboard(outreach.formalEmail, 'email')}
                        className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] transition"
                      >
                        {copiedType === 'email' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedType === 'email' ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                    <pre className="font-sans text-slate-300 bg-slate-900 p-3 rounded-lg border border-slate-800/80 whitespace-pre-wrap leading-relaxed">
                      {outreach.formalEmail}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
