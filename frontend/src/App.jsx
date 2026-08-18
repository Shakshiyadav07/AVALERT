import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  MapPin,
  Cpu,
  Users,
  Box,
  LayoutDashboard,
  Search,
  Bell,
  CloudSun,
  Clock,
  MessageSquare,
  Crosshair,
  Wifi,
  WifiOff,
  Send,
  AlertTriangle,
  Plus,
  CheckCircle2,
  Navigation,d
  Activity,
  HeartPulse,
  DollarSign,
  UserCheck,
  RefreshCw,
  Zap
} from "lucide-react";
import confetti from "canvas-confetti";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import MeshTriageSimulator from './components/MeshTriageSimulator';

// Leaflet Default Marker Repair
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
}

export default function App() {
  // Navigation & Core States
  const [activeTab, setActiveTab] = useState("dashboard");
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [systemLogs, setSystemLogs] = useState([]);

  // Weather Widget State
  const [weather] = useState({
    temp: "-4°C",
    condition: "Snowfall Warning",
    wind: "32 km/h NW"
  });

  // Map & Location States
  const [mapCenter, setMapCenter] = useState([26.4499, 80.3319]); // Kanpur Base
  const [mapZoom, setMapZoom] = useState(12);
  const [searchQuery, setSearchQuery] = useState("");

  // System Wide Incidents & Zones Data
  const [incidents, setIncidents] = useState([
    { id: "AL-1024", name: "Kanpur Central Debris Zone", zoneType: "Danger", lat: 26.4499, lng: 80.3319, priority: "Critical", people: 4, injured: 2, time: "2 mins ago" },
    { id: "AL-1021", name: "Srinagar Avalanche Sector S-4", zoneType: "Danger", lat: 34.0837, lng: 74.7973, priority: "High", people: 2, injured: 0, time: "6 mins ago" },
    { id: "BLK-001", name: "Ganga Barrage Bridge Blocked", zoneType: "Blocked", lat: 26.5000, lng: 80.3100, priority: "Medium", people: 0, injured: 0, time: "15 mins ago" },
    { id: "SAFE-01", name: "Kanpur Relief HQ Base Camp", zoneType: "Safe", lat: 26.4800, lng: 80.3200, priority: "Safe", people: 0, injured: 0, time: "Active" }
  ]);

  // Form & SOS States
  const [sosLocation, setSosLocation] = useState("Kanpur Civil Lines Sector 3");
  const [sosPeople, setSosPeople] = useState(3);
  const [sosInjured, setSosInjured] = useState(1);
  const [sosDetails, setSosDetails] = useState("Structure collapse near main market. Medical assistance needed.");

  // Citizen "I'M SAFE" Registrations
  const [safeUsers, setSafeUsers] = useState([
    { id: 1, name: "Rahul Verma", location: "Kanpur Sector 4", timestamp: "10:12 AM" },
    { id: 2, name: "Priya Sharma", location: "Civil Lines", timestamp: "11:05 AM" }
  ]);
  const [safeForm, setSafeForm] = useState({ name: "", location: "" });

  // Relief & Funding Modules
  const [supplies, setSupplies] = useState({ food: 1840, water: 4200, medicine: 310, shelter: 120 });
  const [funds, setFunds] = useState({ goal: 500000, raised: 342000, donors: 1240 });
  const [rescueTeams, setRescueTeams] = useState([
  {
    id: "RT-01",
    name: "Alpha Rescue Unit",
    members: 6,
    vehicle: "Rescue Van 01",
    status: "Available",
    location: "Kanpur Base Camp"
  },
  {
    id: "RT-02",
    name: "Mountain Response Team",
    members: 8,
    vehicle: "Rescue Truck 02",
    status: "On Mission",
    location: "Srinagar Sector S-4"
  },
  {
    id: "RT-03",
    name: "Medical Rescue Unit",
    members: 5,
    vehicle: "Ambulance 03",
    status: "Available",
    location: "Kanpur Civil Lines"
  }
]);

const [rescueCases, setRescueCases] = useState([
  {
    id: "SOS-4821",
    location: "Kanpur Central Debris Zone",
    type: "Structure Collapse",
    people: 4,
    injured: 2,
    priority: "Critical",
    status: "Pending",
    assignedTeam: "Unassigned",
    details: "People trapped near collapsed market structure.",
    time: "2 mins ago"
  },
  {
    id: "SOS-4817",
    location: "Srinagar Avalanche Sector S-4",
    type: "Avalanche",
    people: 2,
    injured: 0,
    priority: "High",
    status: "Assigned",
    assignedTeam: "Mountain Response Team",
    details: "Two people reported missing after avalanche.",
    time: "6 mins ago"
  },
  {
    id: "SOS-4809",
    location: "Kanpur Civil Lines",
    type: "Medical Emergency",
    people: 3,
    injured: 1,
    priority: "Critical",
    status: "En Route",
    assignedTeam: "Medical Rescue Unit",
    details: "Injured citizen requires urgent medical evacuation.",
    time: "11 mins ago"
  }
]);

const [selectedCase, setSelectedCase] = useState(null);
const [selectedTeam, setSelectedTeam] = useState("");

  // Community Alerts Feed
  const [alerts, setAlerts] = useState([
    { id: 1, author: "Kanpur Emergency Officer", text: "Water levels rising. Evacuate low-lying areas.", time: "10m ago", type: "Warning" }
  ]);
  const [newAlertText, setNewAlertText] = useState("");

  // AI Victim Detection Radar State
  const [scanning, setScanning] = useState(false);
  const [buriedData, setBuriedData] = useState(null);

  // Online / Offline & Clock Event Listeners
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      clearInterval(timer);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Logger Function for System Integrations
  const addLog = (msg) => {
    setSystemLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 4)]);
  };

  // Smart SOS Priority Classifier Engine
  const calculatePriority = (people, injured) => {
    if (injured > 0 || people > 5) return "Critical";
    if (people > 2) return "High";
    return "Medium";
  };

  // SOS Submission Integration
  const handleSOSSubmit = (e) => {
    e.preventDefault();
    const priorityLevel = calculatePriority(Number(sosPeople), Number(sosInjured));
    const newSOS = {
      id: `SOS-${Math.floor(1000 + Math.random() * 9000)}`,
      name: sosLocation,
      zoneType: "Danger",
      lat: mapCenter[0] + (Math.random() - 0.5) * 0.02,
      lng: mapCenter[1] + (Math.random() - 0.5) * 0.02,
      priority: priorityLevel,
      people: Number(sosPeople),
      injured: Number(sosInjured),
      time: "Just now"
    };

    setIncidents([newSOS, ...incidents]);
    confetti({ particleCount: 100, spread: 70 });
    addLog(`SOS Transmitted: ${newSOS.id} classified as ${priorityLevel}`);
    alert(`SOS DISPATCHED! Priority calculated: ${priorityLevel}`);
  };

  // "I'M SAFE" Registration Integration
  const handleImSafeSubmit = (e) => {
    e.preventDefault();
    if (!safeForm.name || !safeForm.location) return;
    setSafeUsers([{ id: Date.now(), ...safeForm, timestamp: new Date().toLocaleTimeString() }, ...safeUsers]);
    setSafeForm({ name: "", location: "" });
    addLog(`Citizen status update: ${safeForm.name} marked SAFE`);
    confetti({ particleCount: 50, spread: 50 });
  };

  // Live Location Capturer
  const handleLiveLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setMapCenter([lat, lng]);
          setMapZoom(15);
          addLog(`GPS Captured: Lat ${lat.toFixed(4)}, Lng ${lng.toFixed(4)}`);
        },
        () => alert("GPS Permission Denied.")
      );
    }
  };

  // AI Victim Radar Integration
  const handleAIScan = () => {
    setScanning(true);
    setBuriedData(null);
    addLog("AI GPR Thermal Scan Initiated...");
    setTimeout(() => {
      setScanning(false);
      setBuriedData([
        { location: "Debris Pocket 3 (South)", depth: "3.2m", heartRate: "72 BPM (Pulse Detected)", priority: "Critical Rescue" },
        { location: "Sub-layer Cellar B-1", depth: "5.4m", heartRate: "0 BPM (No Pulse)", priority: "Low Signal" }
      ]);
      addLog("AI GPR Payload Received: 2 targets located.");
    }, 2000);
  };
  const assignRescueTeam = (caseId, teamName) => {
  if (!teamName) return;

  setRescueCases((prev) =>
    prev.map((item) =>
      item.id === caseId
        ? {
            ...item,
            assignedTeam: teamName,
            status: "Assigned"
          }
        : item
    )
  );

  setRescueTeams((prev) =>
    prev.map((team) =>
      team.name === teamName
        ? { ...team, status: "On Mission" }
        : team
    )
  );

  addLog(`Team ${teamName} assigned to ${caseId}`);
  setSelectedTeam("");
};

const updateRescueStatus = (caseId, status) => {
  setRescueCases((prev) =>
    prev.map((item) =>
      item.id === caseId
        ? { ...item, status }
        : item
    )
  );

  addLog(`${caseId} status changed to ${status}`);
};

  return (
    <div className="flex h-screen bg-[#060813] text-slate-200 font-sans overflow-hidden">
      {/* ---------------- INTEGRATED SIDEBAR ---------------- */}
      <aside className="w-[320px] bg-[#0a0d1d] border-r border-slate-800 flex flex-col justify-between p-6 z-20 shrink-0">
        <div className="space-y-6">
          <nav className="space-y-2 pt-2">
            {[
              { id: "dashboard", label: "Command Center", icon: LayoutDashboard, color: "text-slate-300" },
              { id: "sos", label: "Emergency SOS", icon: ShieldAlert, color: "text-red-500" },
              { id: "imsafe", label: "I'M SAFE Status", icon: UserCheck, color: "text-emerald-400" },
              { id: "map", label: "Live Disaster Map", icon: MapPin, color: "text-cyan-400" },
              { id: "rescue", label: "Rescue Operations", icon: Users, color: "text-indigo-400" },
              { id: "relief", label: "Relief & Supplies", icon: Box, color: "text-amber-400" },
              { id: "funding", label: "Emergency Funds", icon: DollarSign, color: "text-emerald-500" },
              { id: "victim", label: "AI Victim Intelligence", icon: Cpu, color: "text-purple-400" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-start gap-4 px-5 py-3.5 rounded-xl transition-all font-bold text-base ${
                  activeTab === tab.id
                    ? "bg-red-950/70 text-red-400 border border-red-800/80 shadow-lg shadow-red-950/40"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <tab.icon className={`w-6 h-6 shrink-0 ${tab.color}`} />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* System Health / Connectivity Node */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-400">System Status</span>
            {isOnline ? (
              <span className="flex items-center gap-1.5 text-emerald-400"><Wifi className="w-4 h-4" /> Online</span>
            ) : (
              <span className="flex items-center gap-1.5 text-red-400"><WifiOff className="w-4 h-4" /> Mesh Offline</span>
            )}
          </div>
          {systemLogs.length > 0 && (
            <div className="text-[10px] font-mono text-slate-500 space-y-1 border-t border-slate-800 pt-2">
              {systemLogs.map((log, i) => (
                <p key={i} className="truncate">{log}</p>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* ---------------- MAIN DISPLAY AREA ---------------- */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Header */}
        <header className="h-24 border-b border-slate-800 bg-[#080b18] px-8 flex items-center justify-between sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center font-black text-white text-2xl shadow-xl shadow-red-600/40">
              AV
            </div>
            <div>
              <h1 className="font-black text-3xl tracking-widest text-white leading-none">AVALERT</h1>
              <p className="text-xs text-red-500 font-bold uppercase tracking-widest mt-1">Lead System Integration Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Weather Block */}
            <div className="flex items-center gap-3 bg-slate-900 px-5 py-3 rounded-xl border border-slate-800 text-sm font-bold">
              <CloudSun className="w-6 h-6 text-amber-400 shrink-0" />
              <div className="flex flex-col">
                <span className="text-white leading-tight">{weather.temp}</span>
                <span className="text-slate-400 text-xs">{weather.condition}</span>
              </div>
            </div>

            {/* Time Clock Block */}
            <div className="flex items-center gap-3 bg-slate-900 px-5 py-3 rounded-xl border border-slate-800 text-sm font-bold">
              <Clock className="w-6 h-6 text-cyan-400 shrink-0" />
              <span className="text-cyan-300 font-mono text-base">{currentTime}</span>
            </div>

            {/* Live GPS Button */}
            <button
              onClick={handleLiveLocation}
              className="flex items-center gap-2.5 px-5 py-3 rounded-xl bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/80 text-sm font-bold transition-all"
            >
              <Crosshair className="w-5 h-5" />
              <span>Capture GPS</span>
            </button>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* DASHBOARD OVERVIEW */}
          {activeTab === "dashboard" && (
            <>
              {/* Stats Bar */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <div className="p-5 rounded-2xl bg-[#090c1b] border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-slate-400 text-xs font-bold">
                    <span>Critical Incidents</span>
                    <ShieldAlert className="w-5 h-5 text-red-500" />
                  </div>
                  <p className="text-3xl font-black text-white">{incidents.filter((i) => i.priority === "Critical").length}</p>
                  <p className="text-xs text-red-400 font-semibold">Immediate Priority</p>
                </div>

                <div className="p-5 rounded-2xl bg-[#090c1b] border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-slate-400 text-xs font-bold">
                    <span>Citizens Marked Safe</span>
                    <UserCheck className="w-5 h-5 text-emerald-400" />
                  </div>
                  <p className="text-3xl font-black text-white">{safeUsers.length}</p>
                  <p className="text-xs text-emerald-400 font-semibold">Verified Safe</p>
                </div>

                <div className="p-5 rounded-2xl bg-[#090c1b] border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-slate-400 text-xs font-bold">
                    <span>Active Relief Food</span>
                    <Box className="w-5 h-5 text-amber-400" />
                  </div>
                  <p className="text-3xl font-black text-white">{supplies.food} Packs</p>
                  <p className="text-xs text-amber-400 font-semibold">In Stock</p>
                </div>

                <div className="p-5 rounded-2xl bg-[#090c1b] border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-slate-400 text-xs font-bold">
                    <span>Funds Raised</span>
                    <DollarSign className="w-5 h-5 text-emerald-500" />
                  </div>
                  <p className="text-3xl font-black text-white">₹{(funds.raised / 1000).toFixed(0)}k</p>
                  <p className="text-xs text-slate-400 font-semibold">Goal: ₹{(funds.goal / 1000).toFixed(0)}k</p>
                </div>
              </div>

              {/* Incidents Engine List */}
              <div className="p-6 rounded-2xl bg-[#090c1b] border border-slate-800 space-y-5">
                <h3 className="font-extrabold text-white text-lg">Integrated Emergency Queue</h3>
                <div className="space-y-3">
                  {incidents.map((inc, i) => (
                    <div key={i} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="font-black text-white">{inc.id}</span>
                          <span
                            className={`px-2.5 py-0.5 rounded text-xs font-black uppercase ${
                              inc.priority === "Critical"
                                ? "bg-red-950 text-red-400 border border-red-800"
                                : inc.priority === "High"
                                ? "bg-amber-950 text-amber-400 border border-amber-800"
                                : "bg-blue-950 text-blue-400 border border-blue-800"
                            }`}
                          >
                            {inc.priority} Priority
                          </span>
                          <span className="text-xs text-slate-400 font-bold">Zone: {inc.zoneType}</span>
                        </div>
                        <p className="text-sm text-slate-300 font-semibold">{inc.name}</p>
                        <p className="text-xs text-slate-500">
                          {inc.people} People Trapped • {inc.injured} Injured • {inc.time}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setMapCenter([inc.lat, inc.lng]);
                          setActiveTab("map");
                        }}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200"
                      >
                        Focus Map
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* EMERGENCY SOS MODULE */}
          {activeTab === "sos" && (
            <div className="max-w-2xl mx-auto p-8 rounded-2xl bg-[#090c1b] border border-slate-800 space-y-6">
              <div className="flex items-center gap-4">
                <ShieldAlert className="w-10 h-10 text-red-500 shrink-0" />
                <div>
                  <h3 className="text-2xl font-black text-white">Smart SOS Broadcast Engine</h3>
                  <p className="text-xs text-slate-400 font-medium">Automatic priority rating calculation based on payload</p>
                </div>
              </div>

              <form onSubmit={handleSOSSubmit} className="space-y-4 text-sm font-semibold">
                <div>
                  <label className="block text-slate-300 mb-1.5">Emergency Location / Sector</label>
                  <input
                    type="text"
                    value={sosLocation}
                    onChange={(e) => setSosLocation(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 mb-1.5">Total People</label>
                    <input
                      type="number"
                      value={sosPeople}
                      onChange={(e) => setSosPeople(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1.5">Number Injured</label>
                    <input
                      type="number"
                      value={sosInjured}
                      onChange={(e) => setSosInjured(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1.5">Description & Supplies Needed</label>
                  <textarea
                    rows={3}
                    value={sosDetails}
                    onChange={(e) => setSosDetails(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-base uppercase tracking-wider shadow-lg shadow-red-600/30 transition-all"
                >
                  DISPATCH SOS TO COMMAND CENTER
                </button>
              </form>
            </div>
          )}

          {/* I'M SAFE MODULE */}
          {activeTab === "imsafe" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 p-6 rounded-2xl bg-[#090c1b] border border-slate-800 space-y-4">
                <div className="flex items-center gap-3">
                  <UserCheck className="w-8 h-8 text-emerald-400" />
                  <h3 className="text-xl font-black text-white">Mark Yourself Safe</h3>
                </div>
                <form onSubmit={handleImSafeSubmit} className="space-y-4 text-sm font-semibold">
                  <div>
                    <label className="block text-slate-300 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Verma"
                      value={safeForm.name}
                      onChange={(e) => setSafeForm({ ...safeForm, name: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Current Safe Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Relief Shelter Camp 2"
                      value={safeForm.location}
                      onChange={(e) => setSafeForm({ ...safeForm, location: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white"
                    />
                  </div>
                  <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl">
                    Broadcast Safety Status
                  </button>
                </form>
              </div>

              <div className="lg:col-span-7 p-6 rounded-2xl bg-[#090c1b] border border-slate-800 space-y-4">
                <h3 className="text-xl font-black text-white">Verified Safe Citizens Stream</h3>
                <div className="space-y-3">
                  {safeUsers.map((u) => (
                    <div key={u.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-white text-base">{u.name}</p>
                        <p className="text-xs text-slate-400">{u.location}</p>
                      </div>
                      <span className="text-xs text-emerald-400 font-mono font-bold">{u.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* DISASTER MAP & ZONES */}
          {activeTab === "map" && (
            <div className="p-6 rounded-2xl bg-[#090c1b] border border-slate-800 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-white">Integrate Multi-Zone Disaster Map</h3>
                <div className="flex gap-4 text-xs font-bold">
                  <span className="text-red-400 flex items-center gap-1.5"><span className="w-3 h-3 bg-red-500 rounded-full"></span> Danger Zone</span>
                  <span className="text-amber-400 flex items-center gap-1.5"><span className="w-3 h-3 bg-amber-500 rounded-full"></span> Blocked Access</span>
                  <span className="text-emerald-400 flex items-center gap-1.5"><span className="w-3 h-3 bg-emerald-500 rounded-full"></span> Safe Relief Camp</span>
                </div>
              </div>

              <div className="h-[520px] rounded-2xl overflow-hidden border border-slate-800">
                <MapContainer center={mapCenter} zoom={mapZoom} className="h-full w-full">
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <MapController center={mapCenter} zoom={mapZoom} />
                  {incidents.map((inc, i) => (
                    <React.Fragment key={i}>
                      <Marker position={[inc.lat, inc.lng]}>
                        <Popup>{inc.name} ({inc.priority})</Popup>
                      </Marker>
                      <Circle
                        center={[inc.lat, inc.lng]}
                        radius={inc.zoneType === "Danger" ? 2500 : inc.zoneType === "Blocked" ? 1500 : 1000}
                        pathOptions={{
                          color: inc.zoneType === "Danger" ? "red" : inc.zoneType === "Blocked" ? "orange" : "green",
                          fillColor: inc.zoneType === "Danger" ? "red" : inc.zoneType === "Blocked" ? "orange" : "green",
                          fillOpacity: 0.3
                        }}
                      />
                    </React.Fragment>
                  ))}
                </MapContainer>
              </div>
            </div>
          )}
          {/* RESCUE OPERATIONS - MEMBER 2 */}
{activeTab === "rescue" && (
  <div className="space-y-6">

    <div className="flex items-center justify-between">
      <div>
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-indigo-400" />

          <h2 className="text-2xl font-black text-white">
            Rescue Operations Dashboard
          </h2>
        </div>

        <p className="text-sm text-slate-400 mt-1">
          Manage SOS cases, rescue teams and emergency response
        </p>
      </div>

      <div className="px-4 py-2 rounded-xl bg-indigo-950/50 border border-indigo-800">
        <span className="text-xs font-bold text-indigo-300">
          RESCUE NETWORK ACTIVE
        </span>
      </div>
    </div>

    {/* STATS */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

      <div className="p-5 rounded-2xl bg-[#090c1b] border border-slate-800">
        <p className="text-xs text-slate-400 font-bold">
          Active SOS Cases
        </p>

        <p className="text-3xl font-black text-white mt-2">
          {rescueCases.filter(c => c.status !== "Resolved").length}
        </p>
      </div>

      <div className="p-5 rounded-2xl bg-[#090c1b] border border-slate-800">
        <p className="text-xs text-slate-400 font-bold">
          Critical Cases
        </p>

        <p className="text-3xl font-black text-red-400 mt-2">
          {rescueCases.filter(c => c.priority === "Critical").length}
        </p>
      </div>

      <div className="p-5 rounded-2xl bg-[#090c1b] border border-slate-800">
        <p className="text-xs text-slate-400 font-bold">
          Teams Available
        </p>

        <p className="text-3xl font-black text-emerald-400 mt-2">
          {rescueTeams.filter(t => t.status === "Available").length}
        </p>
      </div>

      <div className="p-5 rounded-2xl bg-[#090c1b] border border-slate-800">
        <p className="text-xs text-slate-400 font-bold">
          Teams On Mission
        </p>

        <p className="text-3xl font-black text-cyan-400 mt-2">
          {rescueTeams.filter(t => t.status === "On Mission").length}
        </p>
      </div>

    </div>

    {/* SOS + TEAMS */}
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

      {/* SOS CASE LIST */}
      <div className="p-6 rounded-2xl bg-[#090c1b] border border-slate-800">

        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-black text-white">
            SOS Cases
          </h3>

          <span className="px-3 py-1 rounded-lg bg-red-950 text-red-400 border border-red-800 text-xs font-bold">
            LIVE
          </span>
        </div>

        <div className="space-y-3">

          {rescueCases.map((item) => (

            <div
              key={item.id}
              className="p-4 rounded-xl bg-slate-900 border border-slate-800"
            >

              <div className="flex justify-between gap-4">

                <div>

                  <div className="flex items-center gap-2">

                    <span className="font-black text-white">
                      {item.id}
                    </span>

                    <span className="px-2 py-1 rounded bg-red-950 text-red-400 text-[10px] font-bold">
                      {item.priority}
                    </span>

                  </div>

                  <p className="text-sm text-slate-300 mt-2">
                    {item.location}
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    {item.people} People • {item.injured} Injured
                  </p>

                  <p className="text-xs text-indigo-400 mt-2">
                    Team: {item.assignedTeam}
                  </p>

                </div>

                <button
                  onClick={() => setSelectedCase(item)}
                  className="h-fit px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                >
                  View Case
                </button>

              </div>

            </div>

          ))}

        </div>
      </div>

      {/* TEAMS */}
      <div className="p-6 rounded-2xl bg-[#090c1b] border border-slate-800">

        <h3 className="text-xl font-black text-white mb-5">
          Rescue Teams
        </h3>

        <div className="space-y-3">

          {rescueTeams.map((team) => (

            <div
              key={team.id}
              className="p-4 rounded-xl bg-slate-900 border border-slate-800"
            >

              <div className="flex justify-between">

                <div>
                  <p className="font-bold text-white">
                    {team.name}
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    {team.id} • {team.members} Members
                  </p>
                </div>

                <span
                  className={
                    team.status === "Available"
                      ? "text-emerald-400 text-xs"
                      : "text-cyan-400 text-xs"
                  }
                >
                  ● {team.status}
                </span>

              </div>

              <div className="mt-3 text-xs text-slate-400 space-y-1">
                <p>🚑 {team.vehicle}</p>
                <p>📍 {team.location}</p>
              </div>

            </div>

          ))}

        </div>
      </div>

    </div>

    {/* CASE DETAILS */}
    {selectedCase && (

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="p-6 rounded-2xl bg-[#090c1b] border border-slate-800">

          <h3 className="text-xl font-black text-white">
            Case Details
          </h3>

          <div className="mt-5 space-y-4">

            <div>
              <p className="text-xs text-slate-500">CASE ID</p>
              <p className="font-bold text-white">
                {selectedCase.id}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">LOCATION</p>
              <p className="font-bold text-white">
                {selectedCase.location}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">
                EMERGENCY TYPE
              </p>

              <p className="font-bold text-white">
                {selectedCase.type}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">

              <div className="p-3 rounded-xl bg-slate-900">
                <p className="text-xs text-slate-500">
                  PEOPLE
                </p>

                <p className="text-xl font-black text-white">
                  {selectedCase.people}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900">
                <p className="text-xs text-slate-500">
                  INJURED
                </p>

                <p className="text-xl font-black text-red-400">
                  {selectedCase.injured}
                </p>
              </div>

            </div>

            <div className="p-4 rounded-xl bg-slate-900">
              <p className="text-xs text-slate-500">
                DESCRIPTION
              </p>

              <p className="text-sm text-slate-300 mt-2">
                {selectedCase.details}
              </p>
            </div>

          </div>

        </div>

        {/* TEAM ASSIGNMENT */}
        <div className="p-6 rounded-2xl bg-[#090c1b] border border-slate-800">

          <h3 className="text-xl font-black text-white">
            Team Assignment
          </h3>

          <p className="text-xs text-slate-500 mt-4">
            Current Team
          </p>

          <p className="text-sm font-bold text-indigo-400 mt-1">
            {selectedCase.assignedTeam}
          </p>

          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="w-full mt-5 bg-slate-900 border border-slate-800 rounded-xl p-3 text-white"
          >

            <option value="">
              Select Rescue Team
            </option>

            {rescueTeams
              .filter(team => team.status === "Available")
              .map(team => (
                <option key={team.id} value={team.name}>
                  {team.name}
                </option>
              ))}

          </select>

          <button
            onClick={() =>
              assignRescueTeam(selectedCase.id, selectedTeam)
            }
            disabled={!selectedTeam}
            className="w-full mt-3 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-bold"
          >
            ASSIGN TEAM
          </button>

          {/* RESCUE STATUS */}
          <p className="text-sm font-bold text-slate-300 mt-6">
            Rescue Status
          </p>

          <div className="grid grid-cols-2 gap-2 mt-3">

            {[
              "Pending",
              "Assigned",
              "En Route",
              "Rescue Active",
              "Resolved"
            ].map((status) => (

              <button
                key={status}
                onClick={() =>
                  updateRescueStatus(
                    selectedCase.id,
                    status
                  )
                }
                className={`p-2 rounded-lg text-xs font-bold ${
                  selectedCase.status === status
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-900 text-slate-400"
                }`}
              >
                {status}
              </button>

            ))}

          </div>

          <button
            onClick={() => setSelectedCase(null)}
            className="w-full mt-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
          >
            CLOSE CASE
          </button>

        </div>

      </div>

    )}

  </div>
)}

          {/* RELIEF & RESOURCES */}
          {activeTab === "relief" && (
            <div className="p-8 rounded-2xl bg-[#090c1b] border border-slate-800 space-y-6">
              <h3 className="text-2xl font-black text-white">Relief Supply Tracking Module</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800">
                  <p className="text-sm text-slate-400 font-bold">Ration Packs</p>
                  <p className="text-4xl font-black text-amber-400 mt-2">{supplies.food}</p>
                </div>
                <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800">
                  <p className="text-sm text-slate-400 font-bold">Drinking Water</p>
                  <p className="text-4xl font-black text-blue-400 mt-2">{supplies.water} L</p>
                </div>
                <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800">
                  <p className="text-sm text-slate-400 font-bold">Medical Kits</p>
                  <p className="text-4xl font-black text-red-400 mt-2">{supplies.medicine}</p>
                </div>
                <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800">
                  <p className="text-sm text-slate-400 font-bold">Shelter Tents</p>
                  <p className="text-4xl font-black text-emerald-400 mt-2">{supplies.shelter}</p>
                </div>
              </div>
            </div>
          )}

          {/* FUNDING SECTION */}
          {activeTab === "funding" && (
            <div className="p-8 rounded-2xl bg-[#090c1b] border border-slate-800 space-y-6 max-w-3xl mx-auto">
              <div className="flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-emerald-500" />
                <h3 className="text-2xl font-black text-white">Disaster Relief Crowdfunding Integration</h3>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex justify-between font-bold text-sm">
                  <span className="text-slate-400">Total Funds Collected</span>
                  <span className="text-emerald-400">₹{funds.raised.toLocaleString()} / ₹{funds.goal.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-500"
                    style={{ width: `${(funds.raised / funds.goal) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-400 font-medium">Supported by {funds.donors} donors nationwide.</p>
              </div>
            </div>
          )}

          {/* AI VICTIM INTELLIGENCE */}
          {activeTab === "victim" && (
            <div className="p-8 rounded-2xl bg-[#090c1b] border border-slate-800 space-y-6">
              <h3 className="text-2xl font-black text-white">AI ↔️ Dashboard Intelligence Payload</h3>
              <div className="p-8 bg-slate-900/90 rounded-2xl border border-slate-800 text-center space-y-4">
                <button
                  onClick={handleAIScan}
                  disabled={scanning}
                  className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-black text-sm rounded-xl uppercase tracking-wider"
                >
                  {scanning ? "RUNNING HARDWARE RADAR SCAN..." : "FETCH AI GPR SENSOR DATA"}
                </button>

                {buriedData && (
                  <div className="space-y-3 pt-4 text-left">
                    {buriedData.map((d, i) => (
                      <div key={i} className="p-4 bg-slate-800 rounded-xl flex justify-between items-center text-sm">
                        <div>
                          <p className="font-bold text-white">{d.location}</p>
                          <p className="text-xs text-slate-400">Depth: {d.depth} | {d.heartRate}</p>
                        </div>
                        <span className="px-3 py-1 bg-purple-950 text-purple-300 font-bold text-xs rounded-lg">{d.priority}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}