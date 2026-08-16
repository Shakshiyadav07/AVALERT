import React, { useState } from "react";
import { Send, MapPin, CheckCircle, Shield, AlertTriangle } from "lucide-react";
import { useApp } from "../context/AppContext";
import DisasterMap from "../components/DisasterMap";

export default function CitizenModule() {
  const { dispatchSOS, markSafe, isOnline } = useApp();
  const [location, setLocation] = useState("");
  const [locating, setLocating] = useState(false);
  const [userName, setUserName] = useState("");
  const [medicalEmergency, setMedicalEmergency] = useState(false);
  const [trappedCount, setTrappedCount] = useState(1);
  const [ageGroup, setAgeGroup] = useState("adult");
  const [weatherRisk, setWeatherRisk] = useState("high");
  const [sentStatus, setSentStatus] = useState(null);

  const fetchLocation = () => {
    setLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
          setLocating(false);
        },
        () => {
          setLocation("34.0837, 74.7973 (Fallback Coordinates)");
          setLocating(false);
        }
      );
    } else {
      setLocation("34.0837, 74.7973 (Fallback)");
      setLocating(false);
    }
  };

  const handleSubmitSOS = (e) => {
    e.preventDefault();
    const result = dispatchSOS({
      userName: userName || "Citizen User",
      location: location || "Sector B-4 Lat 34.08",
      medicalEmergency,
      trappedCount: Number(trappedCount),
      ageGroup,
      batteryLevel: Math.floor(Math.random() * 30) + 5,
      weatherRisk,
    });
    setSentStatus(result);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold text-red-500 uppercase tracking-widest">Emergency Assistance</p>
        <h1 className="text-2xl font-black sm:text-3xl">Citizen Emergency Hub</h1>
        <p className="text-xs text-slate-400 mt-1">
          Broadcast Smart SOS signals or report yourself safe directly to local rescue command.
        </p>
      </div>

      {!isOnline && (
        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span><strong>Offline Mode Active:</strong> Your SOS payload will be prioritized locally and synced via mesh protocol.</span>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-red-400 flex items-center gap-2 text-base">
              <Send className="w-4 h-4" /> Smart SOS Emergency Dispatch
            </h3>
            <span className="text-[10px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded border border-red-500/30">AI Priority Active</span>
          </div>

          {sentStatus ? (
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle className="w-5 h-5" /> SOS Dispatched Successfully!
              </div>
              <p className="text-xs">
                Assigned Priority Rating: <strong>{sentStatus.priority}</strong>. Rescue command has received your telemetry data.
              </p>
              <button
                onClick={() => setSentStatus(null)}
                className="mt-2 text-xs text-slate-300 underline font-semibold"
              >
                Send Another SOS
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitSOS} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Your Name / Identifier</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold font-sans">GPS Coordinates</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Auto-detect or manually type location"
                    className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-red-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={fetchLocation}
                    className="px-3 py-2 rounded-xl bg-white/10 border border-white/10 font-semibold hover:bg-white/20 flex items-center gap-1"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    {locating ? "Acquiring..." : "GPS"}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Trapped Individuals</label>
                  <input
                    type="number"
                    min="1"
                    value={trappedCount}
                    onChange={(e) => setTrappedCount(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Demographic Group</label>
                  <select
                    value={ageGroup}
                    onChange={(e) => setAgeGroup(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-red-500"
                  >
                    <option value="adult">Adults Only</option>
                    <option value="child_elderly">Includes Child / Elderly</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  id="medCheck"
                  checked={medicalEmergency}
                  onChange={(e) => setMedicalEmergency(e.target.checked)}
                  className="rounded border-white/10 bg-slate-900 text-red-500 focus:ring-0 w-4 h-4"
                />
                <label htmlFor="medCheck" className="text-slate-300 font-medium cursor-pointer">
                  Critical Medical Emergency / Injury Required
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 font-bold text-white shadow-lg shadow-red-600/20 transition-all text-xs uppercase tracking-wider"
              >
                Broadcast Emergency SOS
              </button>
            </form>
          )}

          <div className="border-t border-white/10 pt-4 mt-4">
            <h4 className="font-bold text-emerald-400 flex items-center gap-1.5 text-xs mb-2">
              <Shield className="w-4 h-4" /> I'M SAFE Protocol
            </h4>
            <p className="text-[11px] text-slate-400 mb-3">
              Already evacuated or secure? Inform authorities to clear response queues.
            </p>
            <button
              onClick={() => {
                markSafe({ name: userName || "Citizen User", location: location || "Sector B-4" });
                alert("Marked as SAFE in Disaster Command HQ.");
              }}
              className="w-full py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-semibold text-xs"
            >
              Broadcast "I Am Safe" Status
            </button>
          </div>
        </div>

        <DisasterMap />
      </div>
    </div>
  );
}