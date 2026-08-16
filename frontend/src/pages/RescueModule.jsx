import React from "react";
import { Users, AlertTriangle, Activity, CheckCircle, Clock } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function RescueModule() {
  const { sosList, updateSOSStatus, safeList } = useApp();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold text-red-500 uppercase tracking-widest">Tactical Operations</p>
        <h1 className="text-2xl font-black sm:text-3xl">Rescue HQ Dashboard</h1>
        <p className="text-xs text-slate-400 mt-1">
          Smart SOS triage with dynamic urgency sorting for rescue deployment teams.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
          <p className="text-xs text-red-300 font-medium">Critical Priority Requests</p>
          <p className="text-2xl font-black text-red-400 mt-1">
            {sosList.filter((s) => s.priority === "Critical" && s.status !== "Resolved").length}
          </p>
        </div>
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
          <p className="text-xs text-amber-300 font-medium">Active Rescue Operations</p>
          <p className="text-2xl font-black text-amber-400 mt-1">
            {sosList.filter((s) => s.status === "In Progress").length}
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
          <p className="text-xs text-emerald-300 font-medium">Verified Safe Citizens</p>
          <p className="text-2xl font-black text-emerald-400 mt-1">{safeList.length}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <h3 className="font-bold text-slate-200 mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-red-400" /> Triage SOS Queue
        </h3>

        <div className="space-y-3">
          {sosList.map((sos) => {
            const isCritical = sos.priority === "Critical";
            const isHigh = sos.priority === "High";

            return (
              <div
                key={sos.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border border-white/5 bg-slate-900/60 gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-100">{sos.user}</span>
                    <span className="text-[10px] text-slate-400">({sos.id})</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${
                        isCritical
                          ? "bg-red-500/20 text-red-400 border-red-500/30 animate-pulse"
                          : isHigh
                          ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                          : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                      }`}
                    >
                      {sos.priority}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 flex items-center gap-3">
                    <span>Location: <strong className="text-slate-200">{sos.location}</strong></span>
                    <span>Trapped: <strong className="text-slate-200">{sos.trappedCount}</strong></span>
                    <span>Battery: <strong className="text-slate-200">{sos.batteryLevel}%</strong></span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 mr-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {sos.time}
                  </span>
                  
                  {sos.status === "Pending" && (
                    <button
                      onClick={() => updateSOSStatus(sos.id, "In Progress")}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-semibold"
                    >
                      Dispatch Team
                    </button>
                  )}

                  {sos.status === "In Progress" && (
                    <button
                      onClick={() => updateSOSStatus(sos.id, "Resolved")}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Complete
                    </button>
                  )}

                  {sos.status === "Resolved" && (
                    <span className="text-xs text-emerald-400 font-bold px-2 py-1 bg-emerald-500/10 rounded border border-emerald-500/20">
                      Resolved
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}