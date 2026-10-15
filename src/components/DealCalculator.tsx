import React, { useState } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  Coins, 
  Copy, 
  Check, 
  HelpCircle,
  Building,
  ShieldCheck,
  Share2
} from 'lucide-react';

export const DealCalculator: React.FC = () => {
  const [areaSqFt, setAreaSqFt] = useState<number>(3200);
  const [pricePerSqFt, setPricePerSqFt] = useState<number>(22500);
  const [rentPerSqFt, setRentPerSqFt] = useState<number>(180);
  const [maintenancePerSqFt, setMaintenancePerSqFt] = useState<number>(30);
  const [annualEscalationPercent, setAnnualEscalationPercent] = useState<number>(10);
  const [usdRate, setUsdRate] = useState<number>(278.5);
  const [buildingName, setBuildingName] = useState<string>('Technocity / BFC Prime Floor');

  const [copied, setCopied] = useState(false);

  // Financial Computations
  const totalCostPKR = areaSqFt * pricePerSqFt;
  const totalCostCrore = (totalCostPKR / 10000000).toFixed(2);
  const totalCostUSD = Math.round(totalCostPKR / usdRate);

  const monthlyGrossRentPKR = areaSqFt * rentPerSqFt;
  const annualGrossRentPKR = monthlyGrossRentPKR * 12;

  const monthlyMaintenancePKR = areaSqFt * maintenancePerSqFt;
  const annualNetRentPKR = (monthlyGrossRentPKR - monthlyMaintenancePKR) * 12;

  const grossRentalYield = ((annualGrossRentPKR / totalCostPKR) * 100).toFixed(2);
  const netRentalYield = ((annualNetRentPKR / totalCostPKR) * 100).toFixed(2);
  const paybackYears = (totalCostPKR / annualNetRentPKR).toFixed(1);

  // Copy deal memo
  const handleCopyDealMemo = () => {
    const memo = `
🏢 COMMERCIAL OFFICE INVESTMENT DEAL MEMO
📍 Location: ${buildingName}, I.I. Chundrigar Road, Karachi
📐 Area: ${areaSqFt.toLocaleString()} sq.ft.
💰 Purchase Rate: PKR ${pricePerSqFt.toLocaleString()} / sq.ft.
💵 Total Acquisition Cost: PKR ${totalCostCrore} Crore (~$${totalCostUSD.toLocaleString()} USD)
📈 Monthly Gross Rent: PKR ${(monthlyGrossRentPKR).toLocaleString()} / month (PKR ${rentPerSqFt}/sq.ft.)
📊 Annual Gross Rental Income: PKR ${(annualGrossRentPKR).toLocaleString()}
💎 Gross Rental Yield: ${grossRentalYield}% per annum
💎 Net Rental Yield: ${netRentalYield}% per annum (after building maintenance & generator backup)
⏳ Full Payback Period: ${paybackYears} Years
📝 Annual Rent Escalation Clause: ${annualEscalationPercent}% compound per annum
⚖️ Tax Status: Registered FBR corporate commercial lease.
    `.trim();

    navigator.clipboard.writeText(memo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Chundrigar Commercial Office ROI & Yield Simulator
              </h2>
              <p className="text-xs text-slate-400">
                Karachi financial hub commercial yields, tenant rental rates, payback period, and Section 7E capital analysis.
              </p>
            </div>
          </div>

          <button
            onClick={handleCopyDealMemo}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-900/30 transition self-start md:self-auto"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Deal Memo Copied!' : 'Copy Investor Deal Memo'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Parameters */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Building className="w-4 h-4 text-emerald-400" />
            <span>Property & Investment Inputs</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-slate-300 font-medium block mb-1">
                Target Building / Project Name
              </label>
              <input
                type="text"
                value={buildingName}
                onChange={(e) => setBuildingName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-slate-300 font-medium">Floor Area (Square Feet)</label>
                <span className="text-indigo-400 font-bold">{areaSqFt.toLocaleString()} sq.ft.</span>
              </div>
              <input
                type="range"
                min="500"
                max="15000"
                step="100"
                value={areaSqFt}
                onChange={(e) => setAreaSqFt(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>Small Unit (500 sq.ft)</span>
                <span>Full Floor (5,000 sq.ft)</span>
                <span>Multi-Floor (15,000 sq.ft)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-slate-300 font-medium">Purchase Rate per Sq.Ft. (PKR)</label>
                <span className="text-emerald-400 font-bold">PKR {pricePerSqFt.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="14000"
                max="32000"
                step="500"
                value={pricePerSqFt}
                onChange={(e) => setPricePerSqFt(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>PKR 14,000 (Uni Tower)</span>
                <span>PKR 22,000 (Technocity)</span>
                <span>PKR 32,000 (BFC/MCB)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-slate-300 font-medium">Expected Monthly Rent per Sq.Ft. (PKR)</label>
                <span className="text-amber-400 font-bold">PKR {rentPerSqFt} / sq.ft.</span>
              </div>
              <input
                type="range"
                min="90"
                max="260"
                step="5"
                value={rentPerSqFt}
                onChange={(e) => setRentPerSqFt(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>Economy (PKR 90)</span>
                <span>Corporate Avg (PKR 180)</span>
                <span>Grade A+ (PKR 260)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-slate-400 block text-[11px] mb-1">
                  Service / Generator Surcharge
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={maintenancePerSqFt}
                    onChange={(e) => setMaintenancePerSqFt(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-indigo-500 text-xs"
                  />
                  <span className="absolute right-2.5 top-1.5 text-[10px] text-slate-400">PKR/sqft</span>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block text-[11px] mb-1">
                  Annual Rent Escalation
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={annualEscalationPercent}
                    onChange={(e) => setAnnualEscalationPercent(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-indigo-500 text-xs"
                  />
                  <span className="absolute right-2.5 top-1.5 text-[10px] text-slate-400">% / yr</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Investment Yield Output */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Total Cost */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                Total Acquisition Cost
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-white">PKR {totalCostCrore}</span>
                <span className="text-sm font-bold text-emerald-400">Crore</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Equivalent to ~${totalCostUSD.toLocaleString()} USD
              </p>
            </div>

            {/* Monthly Rent */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                Monthly Gross Rental Inflow
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-amber-400">
                  PKR {(monthlyGrossRentPKR / 100000).toFixed(2)}
                </span>
                <span className="text-sm font-bold text-amber-300">Lacs / month</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Annual: PKR {(annualGrossRentPKR / 10000000).toFixed(2)} Crore
              </p>
            </div>
          </div>

          {/* Yields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                Gross Rental Yield
              </span>
              <span className="text-2xl font-black text-emerald-400 mt-1 block">
                {grossRentalYield}%
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Annualized</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                Net Rental Yield
              </span>
              <span className="text-2xl font-black text-teal-400 mt-1 block">
                {netRentalYield}%
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">After Maintenance</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                Capital Payback
              </span>
              <span className="text-2xl font-black text-indigo-400 mt-1 block">
                {paybackYears} Yrs
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Payback Horizon</span>
            </div>
          </div>

          {/* Regulatory & Commercial Notes */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 text-xs">
            <h4 className="font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Karachi Commercial Real Estate Advisory Note</span>
            </h4>
            <div className="space-y-2 text-slate-300 leading-relaxed">
              <p>
                <strong>Commercial Yield Advantage:</strong> Unlike residential real estate in DHA/Clifton which yields 3.5% - 5.5%, I.I. Chundrigar Road commercial offices deliver <strong>{grossRentalYield}%</strong> cash-on-cash yield due to severe supply constraints on prime banking/PSX corridor space.
              </p>
              <p>
                <strong>FBR Section 7E Tax Strategy:</strong> Active commercial offices held for business purposes or generating taxable rental income with registered lease deeds qualify for distinct treatment. Always ensure sub-registrar registration.
              </p>
              <p>
                <strong>Escalation Power:</strong> Standard corporate tenancy contracts on Chundrigar Road feature 10% annual or 25% triennial rent escalations, compounding your investment return.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
