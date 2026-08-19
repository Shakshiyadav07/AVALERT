import React, { useState } from 'react';
import { WifiOff, Radio, ShieldAlert, CheckCircle, Activity, Cpu } from 'lucide-react';

export default function MeshTriageSimulator() {
  const [sosList, setSosList] = useState([
    { id: "SOS-902", location: "Sector 4 Avalanche Ridge", people: 3, injured: 2, status: "Pending Mesh Relay", priority: "Calculating..." },
    { id: "SOS-905", location: "Ganga Barrage Safe Zone", people: 1, injured: 0, status: "Synced", priority: "Low" }
  ]);
  
  const [simulating, setSimulating] = useState(false);
  const [logs, setLogs] = useState(["System initialized. Listening for offline Bluetooth/Wi-Fi Direct packets..."]);

  // Unique Feature: AI Triage & Mesh Hop Simulation
  const triggerOfflineMeshBroadcast = () => {
    setSimulating(true);
    setLogs(prev => ["Triggered Offline SOS: No internet detected. Switching to Bluetooth Mesh Mode...", ...prev]);

    setTimeout(() => {
      setLogs(prev => ["Packet hop 1: Relayed via nearby node (Device ID: #8841)...", ...prev]);
    }, 1000);

    setTimeout(() => {
      setLogs(prev => ["Packet hop 2: Reached Gateway Node. AI Triage Engine analyzing injuries...", ...prev]);
    }, 2200);

    setTimeout(() => {
      // AI Priority Calculation
      setSosList(prev => [
        { 
          id: "SOS-910", 
          location: "High Altitude Crevasse Zone B", 
          people: 4, 
          injured: 3, 
          status: "Delivered via Mesh (Hop Count: 2)", 
          priority: "CRITICAL #1 (AI Triage)" 
        },
        ...prev
      ]);
      setLogs(prev => ["SUCCESS: Critical SOS delivered to Rescue HQ without cellular network! AI assigned Priority #1.", ...prev]);
      setSimulating(false);
    }, 3500);
  };

  return (
    <div className="bg-slate-900 text-white p-6 rounded-xl border border-red-500/30 shadow-2xl my-6">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-3">
          <Radio className="text-red-500 animate-pulse" size={28} />
          <div>
            <h2 className="text-xl font-bold tracking-wide">Offline Mesh Network & AI Triage Module</h2>
            <p className="text-xs text-slate-400">SIH Unique Innovation: Store-and-Forward Emergency Routing</p>
          </div>
        </div>
        <span className="bg-red-500/20 text-red-400 text-xs px-3 py-1 rounded-full border border-red-500/30 flex items-center gap-1">
          <WifiOff size={14} /> Zero-Internet Mode Ready
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Simulation Trigger */}
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
              <Cpu size={16} className="text-indigo-400" /> Peer-to-Peer Bluetooth Mesh Simulator
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Simulate an emergency dispatch when cellular towers are down. The packet hops through nearby peer devices until it reaches the rescue server.
            </p>
            
            {/* Live Terminal Logs */}
            <div className="bg-black/60 rounded p-3 h-36 overflow-y-auto font-mono text-xs text-green-400 border border-slate-800">
              {logs.map((log, idx) => (
                <div key={idx} className="mb-1">{`> ${log}`}</div>
              ))}
            </div>
          </div>

          <button
            onClick={triggerOfflineMeshBroadcast}
            disabled={simulating}
            className={`mt-4 w-full py-3 rounded-lg font-bold transition flex items-center justify-center gap-2 ${
              simulating 
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                : 'bg-linear-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white shadow-lg shadow-red-900/50'
            }`}
          >
            {simulating ? <Activity className="animate-spin" size={18} /> : <ShieldAlert size={18} />}
            {simulating ? 'Relaying Packet via Mesh...' : 'Simulate Offline Emergency SOS'}
          </button>
        </div>

        {/* Right: Live AI Triage List */}
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
          <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <Activity size={16} className="text-red-400" /> AI-Prioritized Incident Queue
          </h3>
          <div className="space-y-3">
            {sosList.map((sos, index) => (
              <div key={index} className="bg-slate-900/80 p-3 rounded border border-slate-700/60 flex flex-col gap-1 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-red-400">{sos.id}</span>
                  <span className={`px-2 py-0.5 rounded font-bold ${
                    sos.priority.includes('CRITICAL') ? 'bg-red-500/20 text-red-300 border border-red-500' : 'bg-blue-500/20 text-blue-300'
                  }`}>
                    {sos.priority}
                  </span>
                </div>
                <div className="text-slate-300 font-medium">{sos.location}</div>
                <div className="flex justify-between text-slate-400 text-[11px] mt-1 border-t border-slate-800 pt-1">
                  <span>Injured: {sos.injured} | Affected: {sos.people}</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle size={12} /> {sos.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}