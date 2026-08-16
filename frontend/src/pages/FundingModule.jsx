import React, { useState } from "react";
import { CircleDollarSign, Heart, ShieldCheck } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function FundingModule() {
  const { totalFunds, addDonation } = useApp();
  const [amount, setAmount] = useState("");
  const [donorName, setDonorName] = useState("");

  const handleDonate = (e) => {
    e.preventDefault();
    if (!amount) return;
    addDonation(amount);
    setAmount("");
    setDonorName("");
    alert("Thank you for supporting emergency rescue efforts!");
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold text-red-500 uppercase tracking-widest">Community Financial Support</p>
        <h1 className="text-2xl font-black sm:text-3xl">Disaster Relief Fund</h1>
        <p className="text-xs text-slate-400 mt-1">
          Direct emergency crowdfunding ledger for search operations and medical kits.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <CircleDollarSign className="w-8 h-8" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Total Active Vault</p>
              <p className="text-3xl font-black text-slate-100 mt-0.5">₹{totalFunds.toLocaleString()}</p>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4 space-y-2 text-xs text-slate-400">
            <p className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Transparent Emergency Allocation
            </p>
            <p>Funds are instantly routed towards drone battery packs, thermal gear, and medicine kits.</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-4">
          <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-400" /> Contribute to Emergency Relief
          </h3>

          <form onSubmit={handleDonate} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Donor Name (Optional)</label>
              <input
                type="text"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder="Anonymous or Your Name"
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Donation Amount (₹)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 1000"
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-white text-xs tracking-wider"
            >
              Confirm Donation
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}