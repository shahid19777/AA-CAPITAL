import React, { useState } from 'react';
import { 
  Sparkles, 
  Building2, 
  Briefcase, 
  MessageSquare, 
  CheckCircle2, 
  Coins, 
  Car, 
  ArrowUp, 
  Users, 
  Sun 
} from 'lucide-react';
import { CanvasVideoPlayer } from './CanvasVideoPlayer';

export const CinematicVideoExperience: React.FC = () => {
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [enquiryName, setEnquiryName] = useState('');
  const [enquiryPhone, setEnquiryPhone] = useState('');
  const [enquiryType, setEnquiryType] = useState('Executive Office (Floors 11-34)');
  const [enquiryArea, setEnquiryArea] = useState('1,200 - 2,500 sq.ft.');
  const [enquirySubmitted, setEnquirySubmitted] = useState(false);

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnquirySubmitted(true);
    setTimeout(() => {
      setEnquirySubmitted(false);
      setIsEnquiryModalOpen(false);
    }, 2000);
  };

  // WhatsApp quick booking
  const waBookingUrl = `https://wa.me/923008241920?text=${encodeURIComponent(
    `Assalam-o-Alaikum, I am inquiring about AA CENTRAL (Ground + 34 Business Hub). I watched the promo video and want to reserve an Executive Office on the 66-month payment plan (PKR 26,000-28,000/sq.ft). Please share available floor plans.`
  )}`;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950/70 via-slate-900 to-slate-900 border border-amber-600/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>AA CENTRAL OFFICIAL CINEMATIC PROMO</span>
              </span>
              <span className="text-xs text-slate-400">Ground + 34 Commercial Masterpiece</span>
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              A Day in the Life: <span className="text-amber-400">The Executive Journey</span>
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Experience the full story in motion: Arrival in luxury sedan, 10-floor private parking, ascending via 6 panoramic high-speed glass lifts, entering the well-furnished executive office suite, productive team at work, rooftop pool & padel club, and 66-month payment plan.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEnquiryModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-xl text-xs font-bold shadow-lg shadow-amber-950/40 transition"
            >
              <Briefcase className="w-4 h-4" />
              <span>Book Pre-Launch Office</span>
            </button>

            <a
              href={waBookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-md transition"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Sales</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Video Player Container (60 FPS Animated Canvas Video Player) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
        <CanvasVideoPlayer
          autoPlay={true}
          onOpenBookingModal={() => setIsEnquiryModalOpen(true)}
        />
      </div>

      {/* Architectural & Engineering Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>Tower Infrastructure</span>
          </div>
          <h4 className="text-base font-bold text-white">Ground + 34 Storey High-Rise</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            1 Basement + 10 Dedicated Parking Floors, providing hassle-free parking for executives and clients. 6 Smart Passenger Lifts + 1 Fire-Safety Lift + 1 Cargo Lift.
          </p>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <Briefcase className="w-4 h-4" />
            <span>Corporate Inventory</span>
          </div>
          <h4 className="text-base font-bold text-white">600 Executive Offices</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Spanning Floors 11 to 34. Panoramic floor-to-ceiling glass, acoustic insulation, 100% heavy-duty generator backup substation, and tier-1 fiber-optic ring.
          </p>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
            <Coins className="w-4 h-4" />
            <span>Financial Terms</span>
          </div>
          <h4 className="text-base font-bold text-white">66-Month Flexible Plan</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Pre-launch rate of PKR 26,000 – 28,000 per sq. ft. Designed for owner-occupiers and high-yield investors targeting 14.5%+ commercial returns.
          </p>
        </div>
      </div>

      {/* Pre-Launch Booking Modal */}
      {isEnquiryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
                  <Building2 className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-white">AA Central Pre-Launch Enquiry</h3>
                  <p className="text-xs text-slate-400">Ground + 34 | 66-Month Flexible Payment Plan</p>
                </div>
              </div>
              <button
                onClick={() => setIsEnquiryModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded"
              >
                ✕
              </button>
            </div>

            {enquirySubmitted ? (
              <div className="p-8 text-center space-y-2 bg-slate-950 rounded-xl border border-emerald-500/30">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-white">Enquiry Registered Successfully</h4>
                <p className="text-xs text-slate-300">
                  Our corporate leasing desk will contact you via WhatsApp with floor plans and booking vouchers.
                </p>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Asim Raza"
                    value={enquiryName}
                    onChange={(e) => setEnquiryName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-medium block mb-1">Phone / WhatsApp Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="+92-300-1234567"
                    value={enquiryPhone}
                    onChange={(e) => setEnquiryPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 font-medium block mb-1">Office Category</label>
                    <select
                      value={enquiryType}
                      onChange={(e) => setEnquiryType(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-slate-200 outline-none"
                    >
                      <option>Executive Office (Floors 11-20)</option>
                      <option>High-Rise Panorama (Floors 21-34)</option>
                      <option>Full Corporate Floor</option>
                      <option>Rooftop Business Suite</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-300 font-medium block mb-1">Required Area</label>
                    <select
                      value={enquiryArea}
                      onChange={(e) => setEnquiryArea(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-slate-200 outline-none"
                    >
                      <option>650 - 1,200 sq.ft.</option>
                      <option>1,200 - 2,500 sq.ft.</option>
                      <option>3,000 - 6,000 sq.ft.</option>
                      <option>Full Floor (8,000+ sq.ft.)</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex justify-between text-slate-300">
                    <span>Payment Plan:</span>
                    <span className="text-amber-400 font-bold">66 Months Easy Installments</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Rate:</span>
                    <span className="text-emerald-400 font-bold">PKR 26,000 - 28,000 / sq.ft.</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsEnquiryModalOpen(false)}
                    className="px-4 py-2 text-slate-400 hover:text-white rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg transition"
                  >
                    Submit Booking Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
