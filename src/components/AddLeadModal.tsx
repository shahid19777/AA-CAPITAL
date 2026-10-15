import React, { useState } from 'react';
import { X, Building, PlusCircle, Target, TrendingUp, ShieldCheck } from 'lucide-react';
import { Lead } from '../types';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLead: (lead: Lead) => void;
}

export const AddLeadModal: React.FC<AddLeadModalProps> = ({
  isOpen,
  onClose,
  onAddLead,
}) => {
  if (!isOpen) return null;

  const [leadName, setLeadName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState<'buyer' | 'investor'>('buyer');
  const [companyType, setCompanyType] = useState('');
  const [targetBuilding, setTargetBuilding] = useState('Technocity / BFC Prime Corridor');
  const [requiredArea, setRequiredArea] = useState('2,500 - 4,000 sq.ft.');
  const [budgetPKR, setBudgetPKR] = useState('PKR 6 Crore - 9 Crore');
  const [budgetUSD, setBudgetUSD] = useState('$215,000 - $320,000');
  const [intentUrgency, setIntentUrgency] = useState('Immediate (Next 30 days)');
  const [purpose, setPurpose] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !contactPerson) return;

    const newLead: Lead = {
      id: `lead-custom-${Date.now()}`,
      type,
      leadName,
      contactPerson,
      phone: phone || '+92-300-0000000',
      email: email || 'contact@client.pk',
      companyType: companyType || (type === 'investor' ? 'Private Wealth Syndicate' : 'Corporate Enterprise'),
      targetBuilding,
      requiredArea,
      budgetPKR,
      budgetUSD,
      intentUrgency,
      purpose: purpose || (type === 'investor' ? 'Rental yield commercial investment' : 'Corporate office ownership'),
      specialRequirements: specialRequirements || '100% generator backup, dedicated parking',
      source: 'Direct Client Inquiry / Portal Intake',
      tags: ['Custom Lead', type === 'investor' ? 'Investor' : 'Direct Buyer'],
      verifiedDate: new Date().toISOString().split('T')[0],
      status: 'Active Pipeline',
      notes,
    };

    onAddLead(newLead);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-6">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Add New Commercial Lead / Investor</h3>
              <p className="text-xs text-slate-400">Log an active buyer inquiry for I.I. Chundrigar Road, Karachi</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Lead Type */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setType('buyer')}
              className={`p-3 rounded-xl border flex items-center gap-2 font-semibold transition ${
                type === 'buyer'
                  ? 'bg-blue-500/15 text-blue-400 border-blue-500/40'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <Building className="w-4 h-4" />
              <span>Office Buyer (Corporate User)</span>
            </button>

            <button
              type="button"
              onClick={() => setType('investor')}
              className={`p-3 rounded-xl border flex items-center gap-2 font-semibold transition ${
                type === 'investor'
                  ? 'bg-amber-500/15 text-amber-400 border-amber-500/40'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Yield Investor (HNI / Overseas)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-medium block mb-1">Company / Entity Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Al-Hamd Shipping & Logistics"
                value={leadName}
                onChange={(e) => setLeadName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">Contact Person & Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Asad Malik (Director Procurement)"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-medium block mb-1">Phone / WhatsApp *</label>
              <input
                type="text"
                placeholder="+92-300-1234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">Email Address</label>
              <input
                type="email"
                placeholder="contact@company.pk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-slate-300 font-medium block mb-1">Target Building</label>
              <input
                type="text"
                placeholder="e.g. Technocity / BFC"
                value={targetBuilding}
                onChange={(e) => setTargetBuilding(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">Required Area</label>
              <input
                type="text"
                placeholder="e.g. 3,000 sq.ft."
                value={requiredArea}
                onChange={(e) => setRequiredArea(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">Budget (PKR)</label>
              <input
                type="text"
                placeholder="e.g. PKR 7.5 Crore"
                value={budgetPKR}
                onChange={(e) => setBudgetPKR(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-medium block mb-1">Intended Purpose & Timeline</label>
            <input
              type="text"
              placeholder="e.g. Owner-occupied software development centre; ready to purchase in 30 days"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-slate-300 font-medium block mb-1">Special Requirements</label>
            <input
              type="text"
              placeholder="e.g. 100% generator backup, 2 reserved parking slots, ready mutation"
              value={specialRequirements}
              onChange={(e) => setSpecialRequirements(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-slate-300 font-medium block mb-1">Internal Broker Notes</label>
            <textarea
              rows={2}
              placeholder="Private notes about the decision maker, financing status, etc."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold shadow-lg shadow-emerald-900/30 transition"
            >
              Save Lead to Dealroom
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
