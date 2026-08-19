import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, MapPin, Cpu, Box, LayoutDashboard, 
  CloudSun, Clock, Crosshair, Wifi, WifiOff, DollarSign, 
  UserCheck, Radio, AlertTriangle, Database, Mail, Lock, Skull, Utensils, Zap, Send
} from "lucide-react";
import confetti from "canvas-confetti";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Leaflet Icon Fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
    map.invalidateSize();
  }, [center, zoom, map]);
  return null;
}

export default function App() {
  const [currentView, setCurrentView] = useState("login"); 
  const [activeTab, setActiveTab] = useState("overview");
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [systemLogs, setSystemLogs] = useState([]);
  
  const [weather] = useState({ temp: "32°C", condition: "Humid & Clear", wind: "12 km/h WSW" });
  const [mapCenter, setMapCenter] = useState([26.4499, 80.3319]); 
  const [mapZoom, setMapZoom] = useState(12);

  const [incidents, setIncidents] = useState([
    { id: "AL-8041", name: "Kanpur Central Zone", zoneType: "High Traffic Area", lat: 26.4499, lng: 80.3319, priority: "Critical", people: 4, injured: 1, time: "3 mins ago", status: "Active Citizen Crowd-Dispatch" },
  ]);

  const [sensorTargets, setSensorTargets] = useState([
    { id: "AV-SN-101", sector: "Avalanche Zone Alpha", status: "Vital Sign Detected (Pulse Weak)", type: "Survivor", battery: "88%", lat: 26.4510, lng: 80.3350 },
    { id: "AV-SN-102", sector: "Avalanche Zone Beta", status: "No Vital Signs (Body Located)", type: "Fatality / Recovery", battery: "64%", lat: 26.4420, lng: 80.3220 },
  ]);

  const [foodCamps, setFoodCamps] = useState([
    { id: "FC-01", name: "Civil Lines Central Kitchen", mealsReady: 1200, distributedToday: 3400, status: "Active Cooking & Packaging", lat: 26.4720, lng: 80.3470 },
    { id: "FC-02", name: "Swaroop Nagar Relief Camp", mealsReady: 450, distributedToday: 1100, status: "Distribution Ongoing", lat: 26.4630, lng: 80.3210 },
  ]);
  const [newCampName, setNewCampName] = useState("");
  const [newCampMeals, setNewCampMeals] = useState(500);

  const [sosLocation, setSosLocation] = useState("Kanpur Sector 1");
  const [sosPeople, setSosPeople] = useState(2);
  const [sosInjured, setSosInjured] = useState(0);
  const [sosDetails, setSosDetails] = useState("Immediate assistance needed at location.");

  const [safeUsers, setSafeUsers] = useState([
    { id: 1, name: "Aarav Mehta", location: "Civil Lines Safezone", timestamp: "10:14 AM" },
  ]);
  const [safeForm, setSafeForm] = useState({ name: "", location: "" });

  const [communityAlerts, setCommunityAlerts] = useState([
    { id: 1, text: "Weather alert: Clear and sunny conditions across Kanpur.", verified: true, time: "10 mins ago" },
  ]);
  const [newAlertText, setNewAlertText] = useState("");

  const [dbLogs] = useState([
    { endpoint: "POST /api/v1/food/dispatch", status: "200 OK", latency: "22ms" },
    { endpoint: "GET /api/v1/avalanche/sensors", status: "200 OK", latency: "14ms" }
  ]);

  const [aiScanning, setAiScanning] = useState(false);
  const [aiResults, setAiResults] = useState(null);
  const [offlineQueue] = useState([{ id: "OFF-991", details: "Local Beacon Signal - 2 persons", synced: false }]);

  const [supplies] = useState({ food: 2450, water: 5100, medicalKits: 410, blankets: 980 });
  const [funds] = useState({ goal: 1000000, raised: 740000, donors: 3120 });

  const [strikeActive, setStrikeActive] = useState(false);
  const [strikeTarget, setStrikeTarget] = useState("Sector 4 - Blocked Bridge Medical Drop");

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

  const addLog = (msg) => {
    setSystemLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 5)]);
  };

  const handleSOSSubmit = (e) => {
    e.preventDefault();
    const priorityLevel = Number(sosInjured) > 0 || Number(sosPeople) > 4 ? "Critical" : "High";
    const newIncident = {
      id: `SOS-${Math.floor(1000 + Math.random() * 9000)}`,
      name: sosLocation,
      zoneType: "Emergency SOS",
      lat: mapCenter[0] + (Math.random() - 0.5) * 0.02,
      lng: mapCenter[1] + (Math.random() - 0.5) * 0.02,
      priority: priorityLevel,
      people: Number(sosPeople),
      injured: Number(sosInjured),
      time: "Just now",
      status: "Dispatched to Civilian Rescue Squad"
    };
    setIncidents([newIncident, ...incidents]);
    addLog(`Direct Emergency Strike Triggered for ${sosLocation}`);
    alert(`BYPASS PROTOCOL SUCCESSFUL! Local Volunteer Network & Autonomous Drone Squad Alerted.`);
    setActiveTab("overview");
  };

  const handleImSafeSubmit = (e) => {
    e.preventDefault();
    if (!safeForm.name || !safeForm.location) {
      alert("Please fill in all fields.");
      return;
    }
    const newUser = {
      id: Date.now(),
      name: safeForm.name,
      location: safeForm.location,
      timestamp: new Date().toLocaleTimeString(),
    };
    setSafeUsers([newUser, ...safeUsers]);
    addLog(`Citizen marked safe: ${safeForm.name}`);
    setSafeForm({ name: "", location: "" });
    confetti({ particleCount: 60, spread: 70 });
  };

  const handleAddFoodCamp = (e) => {
    e.preventDefault();
    if (!newCampName) return;
    const newCamp = {
      id: `FC-0${foodCamps.length + 1}`,
      name: newCampName,
      mealsReady: Number(newCampMeals),
      distributedToday: 0,
      status: "Active Kitchen Setup",
      lat: mapCenter[0] + (Math.random() - 0.5) * 0.015,
      lng: mapCenter[1] + (Math.random() - 0.5) * 0.015,
    };
    setFoodCamps([newCamp, ...foodCamps]);
    setNewCampName("");
    addLog(`New Direct Food Camp deployed: ${newCampName}`);
  };

  const handleLiveLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(pos => {
      setMapCenter([pos.coords.latitude, pos.coords.longitude]);
      setMapZoom(15);
      addLog("GPS recalibrated to exact user coordinate.");
    }, () => alert("Permission denied for GPS."));
  };

  // Exact Match Login View based on Screenshot
  if (currentView === "login") {
    return (
      <div className="relative flex h-screen w-screen items-center justify-center bg-[#030408] text-slate-200 font-sans overflow-hidden p-6">
        <style>{`
          @keyframes moveBlob1 {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(60px, -40px) scale(1.15); }
            66% { transform: translate(-40px, 50px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          @keyframes moveBlob2 {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(-60px, 60px) scale(1.1); }
            66% { transform: translate(50px, -40px) scale(0.95); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .live-blob-1 { animation: moveBlob1 12s ease-in-out infinite; }
          .live-blob-2 { animation: moveBlob2 15s ease-in-out infinite; }
        `}</style>

        {/* Ambient Background Gradient Glows */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="live-blob-1 absolute top-10 left-10 w-[500px] h-[500px] bg-red-950/20 rounded-full blur-[130px]"></div>
          <div className="live-blob-2 absolute bottom-10 right-10 w-[600px] h-[600px] bg-cyan-950/25 rounded-full blur-[150px]"></div>
        </div>

        {/* Login Card Container matching Screenshot Style */}
        <div className="relative z-10 w-full max-w-5xl bg-[#080b14]/90 backdrop-blur-2xl border border-slate-800/80 rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
          
          {/* Left Side: Brand, Title, Description, and 4 Features */}
          <div className="p-8 lg:p-12 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              
              {/* Brand Header */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/40">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-sm font-black text-white tracking-widest leading-none">AVALERT</h1>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">EMERGENCY RESPONSE SYSTEM</p>
                </div>
              </div>

              {/* Headings */}
              <div className="space-y-3 pt-2">
                <h2 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  Stay Safe.<br />
                  <span className="text-red-500 font-black">Stay Connected.</span>
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed max-w-md">
                  In an emergency, every second matters. AVALERT helps citizens quickly connect with rescue teams and share their safety status.
                </p>
              </div>

              {/* 4 Feature Items */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3.5 text-xs text-slate-300 font-medium">
                  <div className="w-7 h-7 rounded-lg bg-[#121629] border border-slate-800 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                  </div>
                  <span>One-Tap Emergency SOS</span>
                </div>

                <div className="flex items-center gap-3.5 text-xs text-slate-300 font-medium">
                  <div className="w-7 h-7 rounded-lg bg-[#121629] border border-slate-800 flex items-center justify-center shrink-0">
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                  </div>
                  <span>Share Your Emergency Location</span>
                </div>

                <div className="flex items-center gap-3.5 text-xs text-slate-300 font-medium">
                  <div className="w-7 h-7 rounded-lg bg-[#121629] border border-slate-800 flex items-center justify-center shrink-0">
                    <span className="text-red-500 font-bold text-xs">✓</span>
                  </div>
                  <span>Update Your Safety Status</span>
                </div>

                <div className="flex items-center gap-3.5 text-xs text-slate-300 font-medium">
                  <div className="w-7 h-7 rounded-lg bg-[#121629] border border-slate-800 flex items-center justify-center shrink-0">
                    <Lock className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                  <span>Secure Citizen Access</span>
                </div>
              </div>

            </div>
          </div>

          {/* Right Side: Citizen Login Form */}
          <div className="p-8 lg:p-12 bg-[#060812]/95 border-l border-slate-800/60 flex flex-col justify-center space-y-6">
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-white">Citizen Login</h3>
              <p className="text-xs text-slate-400">Login to access your emergency dashboard</p>
            </div>

            <div className="space-y-4 pt-1">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-300">Email Address</label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5" />
                  <input type="email" placeholder="Enter your email" className="w-full bg-[#0a0d1d] border border-slate-800/80 rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-red-600 transition-all" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-300">Password</label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5" />
                  <input type="password" placeholder="Enter your password" className="w-full bg-[#0a0d1d] border border-slate-800/80 rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-red-600 transition-all" />
                </div>
              </div>

              <button onClick={() => setCurrentView("dashboard")} className="w-full py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-600/30 transition-all mt-2">
                LOGIN TO AVALERT
              </button>

              <div className="text-center pt-2">
                <p className="text-xs text-slate-400">
                  Don't have an account? <span className="text-red-500 font-bold cursor-pointer hover:underline">Create Account</span>
                </p>
              </div>

              <div className="text-center pt-3 border-t border-slate-800/50 mt-4">
                <p className="text-[10px] text-slate-500 flex items-center justify-center gap-1.5">
                  <Lock className="w-3 h-3 text-amber-500" /> Your emergency information is securely handled.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // Dashboard view with all robust functions
  return (
    <div className="flex h-screen bg-[#060813] text-slate-200 font-sans overflow-hidden">
      <aside className="w-[300px] bg-[#0a0d1d] border-r border-slate-800 flex flex-col justify-between p-6 z-20 shrink-0">
        <div className="space-y-6">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setCurrentView("dashboard"); setActiveTab("overview"); }}>
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center font-black text-white text-xl">AV</div>
            <div>
              <h2 className="font-black text-xl tracking-wider text-white leading-none">AVALERT</h2>
              <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest mt-0.5">Anti-Bureaucracy Core</p>
            </div>
          </div>

          <nav className="space-y-1.5 pt-2 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
            {[
              { id: "overview", label: "Command Dashboard", icon: LayoutDashboard },
              { id: "strike", label: "⚡ Instant Drone / Strike Aid", icon: Zap, color: "text-amber-400" },
              { id: "food-distribution", label: "Food & Kitchen Distribution", icon: Utensils, color: "text-amber-400" },
              { id: "avalanche-bodies", label: "Sensor & Body Recovery", icon: Skull, color: "text-rose-500" },
              { id: "rescue", label: "Rescue Team Ops", icon: ShieldAlert, color: "text-amber-500" },
              { id: "sos", label: "Citizen SOS Direct App", icon: AlertTriangle, color: "text-red-500" },
              { id: "imsafe", label: "I'M SAFE Registry", icon: UserCheck, color: "text-emerald-400" },
              { id: "map", label: "Disaster Map & GPS", icon: MapPin, color: "text-cyan-400" },
              { id: "ai", label: "Sensor AI Intel", icon: Cpu, color: "text-purple-400" },
              { id: "offline", label: "Offline Mesh Network", icon: Radio, color: "text-indigo-400" },
              { id: "backend", label: "Backend APIs & DB", icon: Database, color: "text-blue-400" },
              { id: "relief", label: "Relief Supplies", icon: Box, color: "text-amber-400" },
              { id: "funding", label: "Emergency Funds", icon: DollarSign, color: "text-emerald-500" },
            ].map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all font-bold text-xs ${
                    activeTab === item.id 
                      ? "bg-red-950/70 text-red-400 border border-red-800/80 shadow-md" 
                      : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${item.color || "text-slate-300"}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="space-y-3 pt-2 border-t border-slate-800">
          <button onClick={() => setCurrentView("login")} className="w-full py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-bold text-red-400">
            Log Out / Lock Screen
          </button>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-400">Network Link</span>
              {isOnline ? (
                <span className="flex items-center gap-1 text-emerald-400"><Wifi className="w-3.5 h-3.5" /> Online</span>
              ) : (
                <span className="flex items-center gap-1 text-red-400"><WifiOff className="w-3.5 h-3.5" /> Offline P2P</span>
              )}
            </div>
            {systemLogs.length > 0 && (
              <div className="text-[9px] font-mono text-slate-500 truncate">{systemLogs[0]}</div>
            )}
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 border-b border-slate-800 bg-[#080b18] px-8 flex items-center justify-between z-30 shrink-0">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-red-950 text-red-400 border border-red-800 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-red-500 animate-pulse" /> Anti-Bureaucracy Override Active
            </span>
            <span className="text-xs text-slate-400">Node: #AV-01</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 text-xs font-bold">
              <CloudSun className="w-4 h-4 text-amber-400" />
              <span>{weather.temp} | {weather.condition}</span>
            </div>
            <div className="flex items-center gap-2.5 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 text-xs font-bold">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span className="font-mono text-cyan-300">{currentTime}</span>
            </div>
            <button onClick={handleLiveLocation} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/80 text-xs font-bold transition-all">
              <Crosshair className="w-4 h-4" /><span>GPS Track</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {activeTab === "overview" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-[#090c1b] border border-slate-800 space-y-2 cursor-pointer hover:border-red-500/50 transition-all" onClick={() => setActiveTab("strike")}>
                  <div className="flex justify-between items-center text-slate-400 text-xs font-bold"><span>Instant Strike / Drones</span><Zap className="w-5 h-5 text-amber-400" /></div>
                  <p className="text-3xl font-black text-white">Ready</p>
                  <p className="text-xs text-amber-400 font-semibold">Bypass Gov Delay &rarr;</p>
                </div>
                <div className="p-5 rounded-2xl bg-[#090c1b] border border-slate-800 space-y-2 cursor-pointer hover:border-amber-500/50 transition-all" onClick={() => setActiveTab("food-distribution")}>
                  <div className="flex justify-between items-center text-slate-400 text-xs font-bold"><span>Food Kitchen Camps</span><Utensils className="w-5 h-5 text-amber-400" /></div>
                  <p className="text-3xl font-black text-white">{foodCamps.length}</p>
                  <p className="text-xs text-amber-400 font-semibold">Click to Manage Food &rarr;</p>
                </div>
                <div className="p-5 rounded-2xl bg-[#090c1b] border border-slate-800 space-y-2 cursor-pointer hover:border-rose-500/50 transition-all" onClick={() => setActiveTab("avalanche-bodies")}>
                  <div className="flex justify-between items-center text-slate-400 text-xs font-bold"><span>Sensor Targets / Bodies</span><Skull className="w-5 h-5 text-rose-500" /></div>
                  <p className="text-3xl font-black text-white">{sensorTargets.length}</p>
                  <p className="text-xs text-rose-400 font-semibold">Avalanche Recovery &rarr;</p>
                </div>
                <div className="p-5 rounded-2xl bg-[#090c1b] border border-slate-800 space-y-2 cursor-pointer hover:border-emerald-500/50 transition-all" onClick={() => setActiveTab("sos")}>
                  <div className="flex justify-between items-center text-slate-400 text-xs font-bold"><span>Active SOS Cases</span><ShieldAlert className="w-5 h-5 text-red-500" /></div>
                  <p className="text-3xl font-black text-white">{incidents.length}</p>
                  <p className="text-xs text-red-400 font-semibold">Direct Dispatch Active &rarr;</p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-r from-red-950/60 via-[#090c1b] to-indigo-950/60 border border-red-900/50 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-red-600 text-white">REVOLUTIONARY FEATURE</span>
                    <h3 className="text-lg font-black text-white">Autonomous Direct-Aid Strike Protocol</h3>
                  </div>
                  <p className="text-xs text-slate-300 max-w-xl">
                    Jab government permissions ya rescue teams aane mein ghanto laga deti hain, tab yeh module seedhe local community drones aur volunteer squads ko trigger karta hai taaki emergency medicine aur food packets 10 minute ke andar pahunche.
                  </p>
                </div>
                <button onClick={() => setActiveTab("strike")} className="px-6 py-3.5 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-600/40 shrink-0 transition-all">
                  Launch Strike Control
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-[#090c1b] border border-slate-800 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-extrabold text-white text-base">Active Food Kitchen Status</h3>
                    <button onClick={() => setActiveTab("food-distribution")} className="text-xs text-amber-400 font-bold hover:underline">Open Food Module &rarr;</button>
                  </div>
                  <div className="space-y-3">
                    {foodCamps.map(camp => (
                      <div key={camp.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <span className="font-black text-white text-sm">{camp.id}</span>
                            <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-amber-950 text-amber-400 border border-amber-800">Kitchen Active</span>
                            <span className="text-xs text-slate-400 font-bold">{camp.name}</span>
                          </div>
                          <p className="text-xs text-slate-300">Meals Ready: <span className="text-emerald-400 font-bold">{camp.mealsReady}</span></p>
                        </div>
                        <button onClick={() => { setMapCenter([camp.lat, camp.lng]); setActiveTab("map"); }} className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200">Map Pin</button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#090c1b] border border-slate-800 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-extrabold text-white text-base">Avalanche & Body Sensor Feed</h3>
                    <button onClick={() => setActiveTab("avalanche-bodies")} className="text-xs text-rose-400 font-bold hover:underline">Open Module &rarr;</button>
                  </div>
                  <div className="space-y-3">
                    {sensorTargets.map(target => (
                      <div key={target.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-white text-sm">{target.id}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${target.type === "Fatality / Recovery" ? "bg-rose-950 text-rose-400 border border-rose-800" : "bg-amber-950 text-amber-400 border border-amber-800"}`}>{target.type}</span>
                          </div>
                          <p className="text-xs text-slate-300">{target.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "strike" && (
            <div className="max-w-3xl mx-auto p-8 rounded-2xl bg-[#090c1b] border border-red-900/60 space-y-6 shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-600/40">
                  <Zap className="w-7 h-7 text-white animate-bounce" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">Autonomous Emergency Strike & Drone Dispatch</h3>
                  <p className="text-xs text-slate-400">Bypasses govt permission queues. Directly routes nearest drone fleet with medical kits & emergency rations.</p>
                </div>
              </div>

              <div className="p-5 bg-slate-900 rounded-xl border border-slate-800 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Select Target Zone for Immediate Drop</label>
                  <select value={strikeTarget} onChange={e => setStrikeTarget(e.target.value)} className="w-full bg-[#060813] border border-slate-800 rounded-xl p-3 text-xs text-white">
                    <option>Sector 4 - Blocked Bridge Medical Drop</option>
                    <option>Kanpur Central Zone - High Risk Trapped Survivors</option>
                    <option>Swaroop Nagar Relief Camp - Urgent Oxygen Supplies</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-[#060813] rounded-xl border border-slate-800 text-center space-y-1">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Available Drones</p>
                    <p className="text-xl font-black text-emerald-400">14 Units Ready</p>
                  </div>
                  <div className="p-4 bg-[#060813] rounded-xl border border-slate-800 text-center space-y-1">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Estimated Flight Time</p>
                    <p className="text-xl font-black text-cyan-400">4.2 Minutes</p>
                  </div>
                </div>

                <button onClick={() => {
                  setStrikeActive(true);
                  addLog(`URGENT STRIKE DISPATCHED to ${strikeTarget}`);
                  setTimeout(() => {
                    setStrikeActive(false);
                    alert("DRONE STRIKE SUCCESSFUL! Supplies dropped at target coordinate.");
                  }, 2500);
                }} disabled={strikeActive} className="w-full py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-600/40 transition-all flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> {strikeActive ? "DEPLOYING AUTONOMOUS DRONES..." : "EXECUTE IMMEDIATE EMERGENCY STRIKE"}
                </button>
              </div>
            </div>
          )}

          {activeTab === "food-distribution" && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[#090c1b] border border-slate-800 space-y-4">
                <div className="flex items-center gap-3">
                  <Utensils className="w-8 h-8 text-amber-400" />
                  <div>
                    <h3 className="text-xl font-black text-white">Food & Kitchen Distribution Hub</h3>
                    <p className="text-xs text-slate-400">Manage emergency community kitchens and packet preparation</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
                  <div className="p-5 bg-slate-900 rounded-xl border border-slate-800 space-y-4">
                    <h4 className="font-bold text-white text-sm">Setup New Kitchen / Camp</h4>
                    <form onSubmit={handleAddFoodCamp} className="space-y-3 text-xs">
                      <div>
                        <label className="block text-slate-300 mb-1 font-semibold">Kitchen Name</label>
                        <input type="text" placeholder="e.g. North Sector Kitchen" value={newCampName} onChange={e => setNewCampName(e.target.value)} className="w-full bg-[#060813] border border-slate-800 rounded-lg p-2.5 text-white" />
                      </div>
                      <div>
                        <label className="block text-slate-300 mb-1 font-semibold">Meals Prepared</label>
                        <input type="number" value={newCampMeals} onChange={e => setNewCampMeals(e.target.value)} className="w-full bg-[#060813] border border-slate-800 rounded-lg p-2.5 text-white" />
                      </div>
                      <button type="submit" className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg shadow-md">Deploy Kitchen Camp</button>
                    </form>
                  </div>

                  <div className="lg:col-span-2 space-y-3">
                    <h4 className="font-bold text-white text-sm">Active Distribution Centers</h4>
                    {foodCamps.map(camp => (
                      <div key={camp.id} className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{camp.id}</span>
                            <span className="text-xs text-amber-400 font-bold">({camp.name})</span>
                          </div>
                          <p className="text-xs text-slate-300">Meals Ready: <span className="text-emerald-400 font-bold">{camp.mealsReady}</span></p>
                        </div>
                        <button onClick={() => {
                          setFoodCamps(foodCamps.map(c => c.id === camp.id ? {...c, mealsReady: c.mealsReady + 200} : c));
                          addLog(`Restocked 200 meals to ${camp.name}`);
                        }} className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg text-xs font-bold">+ Restock 200</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "avalanche-bodies" && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[#090c1b] border border-slate-800 space-y-4">
                <div className="flex items-center gap-3">
                  <Skull className="w-8 h-8 text-rose-500" />
                  <div>
                    <h3 className="text-xl font-black text-white">Avalanche Sensor & Recovery Module</h3>
                    <p className="text-xs text-slate-400">Detect survivors and bodies via RF / Thermal / Vital-Sign sensors</p>
                  </div>
                </div>
                <div className="space-y-3 pt-2">
                  {sensorTargets.map(target => (
                    <div key={target.id} className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{target.id}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${target.type === "Fatality / Recovery" ? "bg-rose-950 text-rose-400 border border-rose-800" : "bg-amber-950 text-amber-400 border border-amber-800"}`}>{target.type}</span>
                        </div>
                        <p className="text-xs text-slate-300">{target.status}</p>
                      </div>
                      <button onClick={() => {
                        setSensorTargets(sensorTargets.filter(t => t.id !== target.id));
                        addLog(`Target ${target.id} cleared.`);
                      }} className="px-3 py-2 bg-rose-950 hover:bg-rose-900 text-rose-400 rounded-lg text-xs font-bold">Mark Cleared</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "rescue" && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[#090c1b] border border-slate-800 space-y-4">
                <div className="flex items-center gap-3">
                  <ShieldAlert className="w-7 h-7 text-amber-500" />
                  <div>
                    <h3 className="text-xl font-black text-white">Rescue Team Dashboard</h3>
                    <p className="text-xs text-slate-400">Manage SOS cases and civilian team assignment</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {incidents.map(inc => (
                    <div key={inc.id} className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{inc.id}</span>
                          <span className="text-xs text-amber-400">({inc.name})</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Severity: {inc.priority} | State: <span className="text-white font-bold">{inc.status}</span></p>
                      </div>
                      <button onClick={() => {
                        setIncidents(incidents.map(i => i.id === inc.id ? {...i, status: "Citizen Volunteer Team En Route"} : i));
                        addLog(`Volunteer squad assigned to ${inc.id}`);
                      }} className="px-3 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold">Assign Volunteer Squad</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "sos" && (
            <div className="max-w-2xl mx-auto p-8 rounded-2xl bg-[#090c1b] border border-slate-800 space-y-6">
              <div className="flex items-center gap-4">
                <AlertTriangle className="w-10 h-10 text-red-500 shrink-0" />
                <div>
                  <h3 className="text-2xl font-black text-white">Citizen App SOS Screen</h3>
                  <p className="text-xs text-slate-400 font-medium">Instant emergency broadcast without government clearance</p>
                </div>
              </div>
              <form onSubmit={handleSOSSubmit} className="space-y-4 text-sm font-semibold">
                <div>
                  <label className="block text-slate-300 mb-1">Emergency Sector</label>
                  <input type="text" value={sosLocation} onChange={e => setSosLocation(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-red-600" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 mb-1">Total People Affected</label>
                    <input type="number" value={sosPeople} onChange={e => setSosPeople(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white" />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Number Injured</label>
                    <input type="number" value={sosInjured} onChange={e => setSosInjured(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Details & Requirements</label>
                  <textarea rows={3} value={sosDetails} onChange={e => setSosDetails(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white" />
                </div>
                <button type="submit" className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-base uppercase tracking-wider shadow-lg shadow-red-600/30 transition-all">BROADCAST CITIZEN SOS</button>
              </form>
            </div>
          )}

          {activeTab === "imsafe" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 p-6 rounded-2xl bg-[#090c1b] border border-slate-800 space-y-4">
                <div className="flex items-center gap-3"><UserCheck className="w-8 h-8 text-emerald-400" /><h3 className="text-xl font-black text-white">I'M SAFE Registry</h3></div>
                <form onSubmit={handleImSafeSubmit} className="space-y-4 text-sm font-semibold">
                  <div>
                    <label className="block text-slate-300 mb-1">Full Name</label>
                    <input type="text" placeholder="e.g. Aarav Mehta" value={safeForm.name} onChange={e => setSafeForm({...safeForm, name: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white" />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Safe Location</label>
                    <input type="text" placeholder="e.g. Base Camp Alpha" value={safeForm.location} onChange={e => setSafeForm({...safeForm, location: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white" />
                  </div>
                  <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20">Mark Safe & Broadcast</button>
                </form>
              </div>
              <div className="lg:col-span-7 p-6 rounded-2xl bg-[#090c1b] border border-slate-800 space-y-4">
                <h3 className="text-xl font-black text-white">Verified Safe Registry Stream</h3>
                <div className="space-y-3">
                  {safeUsers.map(user => (
                    <div key={user.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                      <div><p className="font-bold text-white text-base">{user.name}</p><p className="text-xs text-slate-400">{user.location}</p></div>
                      <span className="text-xs text-emerald-400 font-mono font-bold">{user.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "map" && (
            <div className="p-6 rounded-2xl bg-[#090c1b] border border-slate-800 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-white">Live Disaster & Strike Map</h3>
                <span className="text-xs text-cyan-400 font-bold">Leaflet Engine Active</span>
              </div>
              <div className="h-[550px] w-full rounded-xl overflow-hidden border border-slate-800 relative z-10">
                <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: "100%", width: "100%" }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <MapController center={mapCenter} zoom={mapZoom} />
                  {foodCamps.map(fc => (
                    <Marker key={fc.id} position={[fc.lat, fc.lng]}>
                      <Popup>
                        <b>{fc.name}</b><br />Meals Ready: {fc.mealsReady}
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>
          )}

          {activeTab === "ai" && (
            <div className="p-6 rounded-2xl bg-[#090c1b] border border-slate-800 space-y-5">
              <div className="flex items-center gap-3">
                <Cpu className="w-8 h-8 text-purple-400" />
                <div>
                  <h3 className="text-xl font-black text-white">Sensor AI Intel Module</h3>
                  <p className="text-xs text-slate-400">Avalanche victim & body heat signature recognition</p>
                </div>
              </div>
              <button onClick={() => {
                setAiScanning(true);
                setTimeout(() => {
                  setAiScanning(false);
                  setAiResults({ confidence: "99.1%", victimsDetected: 3, zone: "Sector North", status: "Sensors Synced" });
                }, 2000);
              }} disabled={aiScanning} className="px-6 py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-lg transition-all">
                {aiScanning ? "Processing..." : "Run Sensor Scan"}
              </button>
              {aiResults && (
                <div className="p-5 bg-slate-900 rounded-xl border border-purple-900/50 space-y-2">
                  <p className="text-sm text-white font-bold">AI Analysis Complete: {aiResults.victimsDetected} Signals Processed</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "offline" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-[#090c1b] border border-slate-800 space-y-4">
                <h3 className="text-lg font-black text-white">Store-and-Forward Mesh</h3>
                <div className="space-y-2">
                  {offlineQueue.map((item, index) => (
                    <div key={index} className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex justify-between items-center text-xs">
                      <span className="font-mono text-white">{item.id}: {item.details}</span>
                      <span className="text-indigo-400 font-bold">{isOnline ? "Synced" : "Queued P2P"}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-[#090c1b] border border-slate-800 space-y-4">
                <h3 className="text-lg font-black text-white">Community Verification Stream</h3>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!newAlertText) return;
                  setCommunityAlerts([{ id: Date.now(), text: newAlertText, verified: true, time: "Just now" }, ...communityAlerts]);
                  setNewAlertText("");
                }} className="space-y-3">
                  <input type="text" placeholder="Broadcast alert..." value={newAlertText} onChange={e => setNewAlertText(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white" />
                  <button type="submit" className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs">Verify & Post Alert</button>
                </form>
              </div>
            </div>
          )}

          {activeTab === "backend" && (
            <div className="p-6 rounded-2xl bg-[#090c1b] border border-slate-800 space-y-5">
              <h3 className="text-xl font-black text-white">Backend & Database Status</h3>
              <div className="space-y-2">
                {dbLogs.map((log, index) => (
                  <div key={index} className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-200">{log.endpoint}</span>
                    <span className="text-emerald-400">{log.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "relief" && (
            <div className="p-6 rounded-2xl bg-[#090c1b] border border-slate-800 space-y-4">
              <h3 className="text-xl font-black text-white">Relief & Inventory Management</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(supplies).map(([key, val]) => (
                  <div key={key} className="p-5 bg-slate-900 rounded-xl border border-slate-800 uppercase font-bold space-y-1">
                    <p className="text-xs text-slate-400">{key}</p>
                    <p className="text-3xl text-white mt-1">{val}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "funding" && (
            <div className="p-6 rounded-2xl bg-[#090c1b] border border-slate-800 space-y-5">
              <h3 className="text-xl font-black text-white">Emergency Crowdfunding & Community Support</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>Raised: ₹{funds.raised}</span>
                  <span>Goal: ₹{funds.goal}</span>
                </div>
                <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full transition-all" style={{ width: `${(funds.raised / funds.goal) * 100}%` }}></div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}