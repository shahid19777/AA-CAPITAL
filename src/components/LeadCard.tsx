import React from 'react';
import { 
  Building, 
  Phone, 
  Mail, 
  MessageSquare, 
  Clock, 
  Target, 
  ShieldCheck, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { Lead } from '../types';

interface LeadCardProps {
  lead: Lead;
  onSelectLead: (lead: Lead) => void;
  onOpenPitch: (lead: Lead) => void;
  onOpenOutreach: (lead: Lead) => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({
  lead,
  onSelectLead,
  onOpenPitch,
  onOpenOutreach,
}) => {
  // Format WhatsApp Link
  const cleanPhone = lead.phone.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Assalam-o-Alaikum ${lead.contactPerson}, I am reaching out regarding your requirement for commercial office space in I.I. Chundrigar Road (${lead.targetBuilding}). We have prime verified inventory matching your budget ${lead.budgetPKR}. Would you be available for a brief call?`
  )}`;

  const isInvestor = lead.type === 'investor';

  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-xl p-5 shadow-lg shadow-black/20 transition-all duration-200 flex flex-col justify-between group hover:shadow-emerald-950/20">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`px-2.5 py-0.5 text-xs font-semibold rounded-md border flex items-center gap-1 ${
                isInvestor
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                  : 'bg-blue-500/10 text-blue-300 border-blue-500/30'
              }`}
            >
              {isInvestor ? <TrendingUp className="w-3 h-3" /> : <Building className="w-3 h-3" />}
              <span>{isInvestor ? 'Capital Investor' : 'Corporate Buyer'}</span>
            </span>

            <span className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>{lead.status}</span>
            </span>
          </div>

          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{lead.verifiedDate}</span>
          </span>
        </div>

        {/* Lead Title & Company */}
        <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition mb-0.5">
          {lead.leadName}
        </h3>
        <p className="text-xs text-slate-400 mb-3 flex items-center gap-1.5">
          <span className="font-medium text-slate-300">{lead.contactPerson}</span>
          <span>•</span>
          <span>{lead.companyType}</span>
        </p>

        {/* Key Requirements Grid */}
        <div className="grid grid-cols-2 gap-2 p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 mb-3 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-semibold">
              Budget (PKR / USD)
            </span>
            <span className="text-emerald-400 font-bold block truncate" title={lead.budgetPKR}>
              {lead.budgetPKR}
            </span>
            <span className="text-[10px] text-slate-400">{lead.budgetUSD}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-semibold">
              Required Area
            </span>
            <span className="text-white font-medium block truncate">
              {lead.requiredArea}
            </span>
            <span className="text-[10px] text-slate-400">Commercial Space</span>
          </div>
        </div>

        {/* Target Building & Intent */}
        <div className="space-y-1.5 mb-3 text-xs">
          <div className="flex items-start gap-1.5 text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
            <span className="line-clamp-1" title={lead.targetBuilding}>
              <strong className="text-slate-200">Building:</strong> {lead.targetBuilding}
            </span>
          </div>
          <div className="flex items-start gap-1.5 text-slate-300">
            <Target className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span className="line-clamp-2 text-slate-400" title={lead.purpose}>
              <strong className="text-slate-300">Purpose:</strong> {lead.purpose}
            </span>
          </div>
        </div>

        {/* Source citation */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/60 pt-2 mb-3">
          <span className="truncate max-w-[200px]" title={lead.source}>
            Source: <span className="text-slate-300">{lead.source}</span>
          </span>
          {lead.sourceUrl && (
            <a
              href={lead.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 text-emerald-400 hover:text-emerald-300 underline underline-offset-2 ml-1"
            >
              <span>Verify</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}
        </div>
      </div>

      {/* Action Row */}
      <div className="space-y-2 pt-2 border-t border-slate-800">
        <div className="grid grid-cols-2 gap-2">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-semibold transition"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span>WhatsApp</span>
          </a>

          <button
            onClick={() => onOpenPitch(lead)}
            className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-semibold transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Pitch Match</span>
          </button>
        </div>

        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => onOpenOutreach(lead)}
            className="text-[11px] text-slate-400 hover:text-white transition underline underline-offset-2"
          >
            Draft Roman Urdu / English
          </button>

          <button
            onClick={() => onSelectLead(lead)}
            className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition"
          >
            <span>View Intel</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
