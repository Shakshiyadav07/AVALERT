import React, { useState } from "react";
import { Package, Utensils, Droplets, Stethoscope, Tent, Plus } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function ReliefModule() {
  const { supplies, setSupplies } = useApp();
  const [addType, setAddType] = useState("foodKits");
  const [addQty, setAddQty] = useState("");

  const handleUpdateSupply = (e) => {
    e.preventDefault();
    if (!addQty) return;
    setSupplies((prev) => ({
      ...prev,
      [addType]: prev[addType] + Number(addQty),
    }));
    setAddQty("");
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold text-red-500 uppercase tracking-widest">Resource Allocation</p>
        <h1 className="text-2xl font-black sm:text-3xl">Relief & Supplies Logistics</h1>
        <p className="text-xs text-slate-400 mt-1">
          Track and dispatch essential food, water, and medical inventory across disaster camps.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Utensils className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Ration Packets</p>
            <p className="text-xl font-black text-slate-100">{supplies.foodKits} Units</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Droplets className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Clean Water</p>
            <p className="text-xl font-black text-slate-100">{supplies.waterLiters} L</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Medical Trauma Kits</p>
            <p className="text-xl font-black text-slate-100">{supplies.medicalKits} Kits</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Tent className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Emergency Tents</p>
            <p className="text-xl font-black text-slate-100">{supplies.shelterTents} Units</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <h3 className="font-bold text-slate-200 mb-3 text-sm flex items-center gap-2">
          <Package className="w-4 h-4 text-red-400" /> Restock / Inflow Inventory Form
        </h3>

        <form onSubmit={handleUpdateSupply} className="flex flex-col sm:flex-row gap-3">
          <select
            value={addType}
            onChange={(e) => setAddType(e.target.value)}
            className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
          >
            <option value="foodKits">Food Packets</option>
            <option value="waterLiters">Water (Liters)</option>
            <option value="medicalKits">Medical Kits</option>
            <option value="shelterTents">Shelter Tents</option>
          </select>

          <input
            type="number"
            value={addQty}
            onChange={(e) => setAddQty(e.target.value)}
            placeholder="Quantity to add"
            className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
            required
          />

          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white flex items-center justify-center gap-1"
          >
            <Plus className="w-4 h-4" /> Add Inventory
          </button>
        </form>
      </div>
    </div>
  );
}