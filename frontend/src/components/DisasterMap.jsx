import React from "react";
import { ShieldAlert, AlertOctagon, CheckCircle2 } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function DisasterMap() {
  const { zones } = useApp();

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-slate-200 flex items-center gap-2">
            Disaster Risk Map
          </h3>
          <p className="text-xs text-slate-400">Live geospatial classification & blocked routes</p>
        </div>
        <div className="flex gap-2 text-[10px]">
          <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">Danger</span>
          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">Blocked</span>
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Safe</span>
        </div>
      </div>

      <div className="relative h-64 w-full rounded-xl border border-white/10 bg-slate-950/80 overflow-hidden flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
        
        <div className="relative z-10 w-full h-full flex flex-col justify-around">
          {zones.map((zone) => {
            const isDanger = zone.status === "Danger";
            const isBlocked = zone.status === "Blocked";

            return (
              <div
                key={zone.id}
                className={`flex items-center justify-between p-3 rounded-lg border backdrop-blur-md transition-all ${
                  isDanger
                    ? "border-red-500/40 bg-red-500/10 text-red-300"
                    : isBlocked
                    ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                    : "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  {isDanger && <ShieldAlert className="w-5 h-5 text-red-400 animate-pulse" />}
                  {isBlocked && <AlertOctagon className="w-5 h-5 text-amber-400" />}
                  {!isDanger && !isBlocked && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                  <div>
                    <p className="text-xs font-bold">{zone.name}</p>
                    <p className="text-[10px] opacity-80">{zone.dangerLevel} • [{zone.lat}, {zone.lng}]</p>
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded bg-black/40">
                  {zone.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}