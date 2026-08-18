import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  ShieldAlert,
  MapPin,
  Cpu,
  Users,
  Box,
  LayoutDashboard,
  CloudSun,
  Clock,
  Crosshair,
  Wifi,
  WifiOff,
  DollarSign,
  UserCheck,
} from "lucide-react";

import confetti from "canvas-confetti";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import MeshTriageSimulator from './components/MeshTriageSimulator';

// Pages
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import CitizenDashboard from "./pages/citizenDashboard.jsx";
import SOS from "./pages/SOS.jsx";
import Imsafe from "./pages/Imsafe.jsx";

// ----------------------------------------------------
// LEAFLET DEFAULT MARKER FIX
// ----------------------------------------------------

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",

  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// ----------------------------------------------------
// MAP CONTROLLER
// ----------------------------------------------------

function MapController({ center, zoom }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, zoom, {
      duration: 1.5,
    });
  }, [center, zoom, map]);

  return null;
}

// ----------------------------------------------------
// MAIN APP
// ----------------------------------------------------

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  // --------------------------------------------------
  // NAVIGATION & CORE STATES
  // --------------------------------------------------

  const [activeTab, setActiveTab] = useState("dashboard");

  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const [systemLogs, setSystemLogs] = useState([]);

  // --------------------------------------------------
  // WEATHER
  // --------------------------------------------------

  const [weather] = useState({
    temp: "-4°C",
    condition: "Snowfall Warning",
    wind: "32 km/h NW",
  });

  // --------------------------------------------------
  // MAP & LOCATION
  // --------------------------------------------------

  const [mapCenter, setMapCenter] = useState([26.4499, 80.3319]);

  const [mapZoom, setMapZoom] = useState(12);

  // --------------------------------------------------
  // INCIDENT DATA
  // --------------------------------------------------

  const [incidents, setIncidents] = useState([
    {
      id: "AL-1024",
      name: "Kanpur Central Debris Zone",
      zoneType: "Danger",
      lat: 26.4499,
      lng: 80.3319,
      priority: "Critical",
      people: 4,
      injured: 2,
      time: "2 mins ago",
    },

    {
      id: "AL-1021",
      name: "Srinagar Avalanche Sector S-4",
      zoneType: "Danger",
      lat: 34.0837,
      lng: 74.7973,
      priority: "High",
      people: 2,
      injured: 0,
      time: "6 mins ago",
    },

    {
      id: "BLK-001",
      name: "Ganga Barrage Bridge Blocked",
      zoneType: "Blocked",
      lat: 26.5,
      lng: 80.31,
      priority: "Medium",
      people: 0,
      injured: 0,
      time: "15 mins ago",
    },

    {
      id: "SAFE-01",
      name: "Kanpur Relief HQ Base Camp",
      zoneType: "Safe",
      lat: 26.48,
      lng: 80.32,
      priority: "Safe",
      people: 0,
      injured: 0,
      time: "Active",
    },
  ]);

  // --------------------------------------------------
  // SOS STATES
  // --------------------------------------------------

  const [sosLocation, setSosLocation] = useState(
    "Kanpur Civil Lines Sector 3"
  );

  const [sosPeople, setSosPeople] = useState(3);

  const [sosInjured, setSosInjured] = useState(1);

  const [sosDetails, setSosDetails] = useState(
    "Structure collapse near main market. Medical assistance needed."
  );

  // --------------------------------------------------
  // I'M SAFE STATES
  // --------------------------------------------------

  const [safeUsers, setSafeUsers] = useState([
    {
      id: 1,
      name: "Rahul Verma",
      location: "Kanpur Sector 4",
      timestamp: "10:12 AM",
    },

    {
      id: 2,
      name: "Priya Sharma",
      location: "Civil Lines",
      timestamp: "11:05 AM",
    },
  ]);

  const [safeForm, setSafeForm] = useState({
    name: "",
    location: "",
  });

  // --------------------------------------------------
  // RELIEF & FUNDING
  // --------------------------------------------------

  const [supplies] = useState({
    food: 1840,
    water: 4200,
    medicine: 310,
    shelter: 120,
  });

  const [funds] = useState({
    goal: 500000,
    raised: 342000,
    donors: 1240,
  });

  // --------------------------------------------------
  // AI VICTIM DETECTION
  // --------------------------------------------------

  const [scanning, setScanning] = useState(false);

  const [buriedData, setBuriedData] = useState(null);

  // --------------------------------------------------
  // CLOCK + ONLINE/OFFLINE LISTENERS
  // --------------------------------------------------

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      clearInterval(timer);

      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // --------------------------------------------------
  // LOGGER
  // --------------------------------------------------

  const addLog = (message) => {
    setSystemLogs((previousLogs) => [
      `[${new Date().toLocaleTimeString()}] ${message}`,
      ...previousLogs.slice(0, 4),
    ]);
  };

  // --------------------------------------------------
  // PRIORITY CALCULATOR
  // --------------------------------------------------

  const calculatePriority = (people, injured) => {
    if (injured > 0 || people > 5) {
      return "Critical";
    }

    if (people > 2) {
      return "High";
    }

    return "Medium";
  };

  // --------------------------------------------------
  // SOS SUBMISSION
  // --------------------------------------------------

  const handleSOS = (e) => {
  e.preventDefault();

  const newSOS = {
    id: `SOS-${Math.floor(1000 + Math.random() * 9000)}`,
    name: name,
    location: location,
    people: Number(people),
    injured: Number(injured),
    time: new Date().toLocaleTimeString(),
    priority:
      Number(injured) > 0 || Number(people) > 5
        ? "Critical"
        : Number(people) > 2
        ? "High"
        : "Medium",
  };

  const existingSOS =
    JSON.parse(localStorage.getItem("avalertSOS")) || [];

  localStorage.setItem(
    "avalertSOS",
    JSON.stringify([newSOS, ...existingSOS])
  );

  setSent(true);
};

 // --------------------------------------------------
// SOS SUBMISSION
// --------------------------------------------------

const handleSOSSubmit = (event) => {
  event.preventDefault();

  const priorityLevel = calculatePriority(
    Number(sosPeople),
    Number(sosInjured)
  );

  const newSOS = {
    id: `SOS-${Math.floor(1000 + Math.random() * 9000)}`,
    name: sosLocation,
    zoneType: "Danger",

    lat: mapCenter[0] + (Math.random() - 0.5) * 0.02,
    lng: mapCenter[1] + (Math.random() - 0.5) * 0.02,

    priority: priorityLevel,
    people: Number(sosPeople),
    injured: Number(sosInjured),
    time: "Just now",
  };

  setIncidents((previousIncidents) => [
    newSOS,
    ...previousIncidents,
  ]);

  addLog(
    `SOS Transmitted: ${newSOS.id} classified as ${priorityLevel}`
  );

  alert(
    `SOS DISPATCHED! Priority calculated: ${priorityLevel}`
  );
};   

  // --------------------------------------------------
  // I'M SAFE SUBMISSION
  // --------------------------------------------------

  const handleImSafeSubmit = (event) => {
    event.preventDefault();

    if (!safeForm.name || !safeForm.location) {
      alert("Please enter your name and safe location.");
      return;
    }

    const newSafeUser = {
      id: Date.now(),

      name: safeForm.name,

      location: safeForm.location,

      timestamp: new Date().toLocaleTimeString(),
    };

    setSafeUsers((previousUsers) => [
      newSafeUser,
      ...previousUsers,
    ]);

    addLog(
      `Citizen status update: ${safeForm.name} marked SAFE`
    );

    setSafeForm({
      name: "",
      location: "",
    });

    confetti({
      particleCount: 50,
      spread: 50,
    });
  };

  // --------------------------------------------------
  // LIVE GPS
  // --------------------------------------------------

  const handleLiveLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;

        const longitude = position.coords.longitude;

        setMapCenter([latitude, longitude]);

        setMapZoom(15);

        addLog(
          `GPS Captured: Lat ${latitude.toFixed(
            4
          )}, Lng ${longitude.toFixed(4)}`
        );
      },

      () => {
        alert("GPS permission denied.");
      }
    );
  };

  // --------------------------------------------------
  // AI VICTIM SCAN
  // --------------------------------------------------

  const handleAIScan = () => {
    setScanning(true);

    setBuriedData(null);

    addLog("AI GPR Thermal Scan Initiated...");

    setTimeout(() => {
      setScanning(false);

      setBuriedData([
        {
          location: "Debris Pocket 3 (South)",
          depth: "3.2m",
          heartRate: "72 BPM (Pulse Detected)",
          priority: "Critical Rescue",
        },

        {
          location: "Sub-layer Cellar B-1",
          depth: "5.4m",
          heartRate: "0 BPM (No Pulse)",
          priority: "Low Signal",
        },
      ]);

      addLog(
        "AI GPR Payload Received: 2 targets located."
      );
    }, 2000);
  };

  // ==================================================
  // ROUTING
  // ==================================================
  if (location.pathname === "/" || location.pathname === "/login") {
  return (
    <Login
      onLogin={() => navigate("/citizen")}
      onRegister={() => navigate("/register")}
    />
  );
}

  if (location.pathname === "/register") {
    return <Register />;
  }

  if (location.pathname === "/citizen") {
    return <CitizenDashboard />;
  }

  if (location.pathname === "/citizen/sos") {
    return <SOS />;
  }

  if (location.pathname === "/citizen/safe") {
    return <Imsafe />;
  }

  // ==================================================
  // COMMAND CENTER
  // ==================================================

  return (
    <div className="flex h-screen bg-[#060813] text-slate-200 font-sans overflow-hidden">

      {/* SIDEBAR */}

      <aside className="w-[320px] bg-[#0a0d1d] border-r border-slate-800 flex flex-col justify-between p-6 z-20 shrink-0">

        <div className="space-y-6">

          <nav className="space-y-2 pt-2">

            {[
              {
                id: "dashboard",
                label: "Command Center",
                icon: LayoutDashboard,
                color: "text-slate-300",
              },

              {
                id: "sos",
                label: "Emergency SOS",
                icon: ShieldAlert,
                color: "text-red-500",
              },

              {
                id: "imsafe",
                label: "I'M SAFE Status",
                icon: UserCheck,
                color: "text-emerald-400",
              },

              {
                id: "map",
                label: "Live Disaster Map",
                icon: MapPin,
                color: "text-cyan-400",
              },

              {
                id: "rescue",
                label: "Rescue Operations",
                icon: Users,
                color: "text-indigo-400",
              },

              {
                id: "relief",
                label: "Relief & Supplies",
                icon: Box,
                color: "text-amber-400",
              },

              {
                id: "funding",
                label: "Emergency Funds",
                icon: DollarSign,
                color: "text-emerald-500",
              },

              {
                id: "victim",
                label: "AI Victim Intelligence",
                icon: Cpu,
                color: "text-purple-400",
              },
            ].map((tab) => {
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-start gap-4 px-5 py-3.5 rounded-xl transition-all font-bold text-base ${
                    activeTab === tab.id
                      ? "bg-red-950/70 text-red-400 border border-red-800/80 shadow-lg shadow-red-950/40"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 shrink-0 ${tab.color}`}
                  />

                  <span>{tab.label}</span>
                </button>
              );
            })}

          </nav>

        </div>

        {/* SYSTEM STATUS */}

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">

          <div className="flex items-center justify-between text-xs font-bold">

            <span className="text-slate-400">
              System Status
            </span>

            {isOnline ? (
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Wifi className="w-4 h-4" />
                Online
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-red-400">
                <WifiOff className="w-4 h-4" />
                Mesh Offline
              </span>
            )}

          </div>

          {systemLogs.length > 0 && (
            <div className="text-[10px] font-mono text-slate-500 space-y-1 border-t border-slate-800 pt-2">

              {systemLogs.map((log, index) => (
                <p
                  key={index}
                  className="truncate"
                >
                  {log}
                </p>
              ))}

            </div>
          )}

        </div>

      </aside>

      {/* MAIN AREA */}

      <main className="flex-1 flex flex-col overflow-y-auto">

        {/* HEADER */}

        <header className="h-24 border-b border-slate-800 bg-[#080b18] px-8 flex items-center justify-between sticky top-0 z-30 shrink-0">

          <div className="flex items-center gap-4">

            <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center font-black text-white text-2xl shadow-xl shadow-red-600/40">
              AV
            </div>

            <div>

              <h1 className="font-black text-3xl tracking-widest text-white leading-none">
                AVALERT
              </h1>

              <p className="text-xs text-red-500 font-bold uppercase tracking-widest mt-1">
                Lead System Integration Engine
              </p>

            </div>

          </div>

          <div className="flex items-center gap-4">

            {/* WEATHER */}

            <div className="flex items-center gap-3 bg-slate-900 px-5 py-3 rounded-xl border border-slate-800 text-sm font-bold">

              <CloudSun className="w-6 h-6 text-amber-400 shrink-0" />

              <div className="flex flex-col">

                <span className="text-white leading-tight">
                  {weather.temp}
                </span>

                <span className="text-slate-400 text-xs">
                  {weather.condition}
                </span>

              </div>

            </div>

            {/* CLOCK */}

            <div className="flex items-center gap-3 bg-slate-900 px-5 py-3 rounded-xl border border-slate-800 text-sm font-bold">

              <Clock className="w-6 h-6 text-cyan-400 shrink-0" />

              <span className="text-cyan-300 font-mono text-base">
                {currentTime}
              </span>

            </div>

            {/* GPS */}

            <button
              onClick={handleLiveLocation}
              className="flex items-center gap-2.5 px-5 py-3 rounded-xl bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/80 text-sm font-bold transition-all"
            >
              <Crosshair className="w-5 h-5" />

              <span>
                Capture GPS
              </span>
            </button>

          </div>

        </header>

        {/* CONTENT */}

        <div className="p-8 space-y-8">

          {/* =========================================
              DASHBOARD
          ========================================= */}

          {activeTab === "dashboard" && (
            <>

              {/* STATS */}

              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

                <div className="p-5 rounded-2xl bg-[#090c1b] border border-slate-800 space-y-2">

                  <div className="flex justify-between items-center text-slate-400 text-xs font-bold">

                    <span>
                      Critical Incidents
                    </span>

                    <ShieldAlert className="w-5 h-5 text-red-500" />

                  </div>

                  <p className="text-3xl font-black text-white">
                    {
                      incidents.filter(
                        (incident) =>
                          incident.priority === "Critical"
                      ).length
                    }
                  </p>

                  <p className="text-xs text-red-400 font-semibold">
                    Immediate Priority
                  </p>

                </div>

                <div className="p-5 rounded-2xl bg-[#090c1b] border border-slate-800 space-y-2">

                  <div className="flex justify-between items-center text-slate-400 text-xs font-bold">

                    <span>
                      Citizens Marked Safe
                    </span>

                    <UserCheck className="w-5 h-5 text-emerald-400" />

                  </div>

                  <p className="text-3xl font-black text-white">
                    {safeUsers.length}
                  </p>

                  <p className="text-xs text-emerald-400 font-semibold">
                    Verified Safe
                  </p>

                </div>

                <div className="p-5 rounded-2xl bg-[#090c1b] border border-slate-800 space-y-2">

                  <div className="flex justify-between items-center text-slate-400 text-xs font-bold">

                    <span>
                      Active Relief Food
                    </span>

                    <Box className="w-5 h-5 text-amber-400" />

                  </div>

                  <p className="text-3xl font-black text-white">
                    {supplies.food} Packs
                  </p>

                  <p className="text-xs text-amber-400 font-semibold">
                    In Stock
                  </p>

                </div>

                <div className="p-5 rounded-2xl bg-[#090c1b] border border-slate-800 space-y-2">

                  <div className="flex justify-between items-center text-slate-400 text-xs font-bold">

                    <span>
                      Funds Raised
                    </span>

                    <DollarSign className="w-5 h-5 text-emerald-500" />

                  </div>

                  <p className="text-3xl font-black text-white">
                    ₹{(funds.raised / 1000).toFixed(0)}k
                  </p>

                  <p className="text-xs text-slate-400 font-semibold">
                    Goal: ₹{(funds.goal / 1000).toFixed(0)}k
                  </p>

                </div>

              </div>

              {/* INCIDENT QUEUE */}

              <div className="p-6 rounded-2xl bg-[#090c1b] border border-slate-800 space-y-5">

                <h3 className="font-extrabold text-white text-lg">
                  Integrated Emergency Queue
                </h3>

                <div className="space-y-3">

                  {incidents.map((incident) => (

                    <div
                      key={incident.id}
                      className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between"
                    >

                      <div className="space-y-1">

                        <div className="flex items-center gap-3">

                          <span className="font-black text-white">
                            {incident.id}
                          </span>

                          <span
                            className={`px-2.5 py-0.5 rounded text-xs font-black uppercase ${
                              incident.priority === "Critical"
                                ? "bg-red-950 text-red-400 border border-red-800"
                                : incident.priority === "High"
                                ? "bg-amber-950 text-amber-400 border border-amber-800"
                                : "bg-blue-950 text-blue-400 border border-blue-800"
                            }`}
                          >
                            {incident.priority} Priority
                          </span>

                          <span className="text-xs text-slate-400 font-bold">
                            Zone: {incident.zoneType}
                          </span>

                        </div>

                        <p className="text-sm text-slate-300 font-semibold">
                          {incident.name}
                        </p>

                        <p className="text-xs text-slate-500">
                          {incident.people} People Trapped •{" "}
                          {incident.injured} Injured •{" "}
                          {incident.time}
                        </p>

                      </div>

                      <button
                        onClick={() => {
                          setMapCenter([
                            incident.lat,
                            incident.lng,
                          ]);

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

          {/* =========================================
              SOS
          ========================================= */}

          {activeTab === "sos" && (

            <div className="max-w-2xl mx-auto p-8 rounded-2xl bg-[#090c1b] border border-slate-800 space-y-6">

              <div className="flex items-center gap-4">

                <ShieldAlert className="w-10 h-10 text-red-500 shrink-0" />

                <div>

                  <h3 className="text-2xl font-black text-white">
                    Smart SOS Broadcast Engine
                  </h3>

                  <p className="text-xs text-slate-400 font-medium">
                    Automatic priority rating calculation based on payload
                  </p>

                </div>

              </div>

              <form
                onSubmit={handleSOSSubmit}
                className="space-y-4 text-sm font-semibold"
              >

                <div>

                  <label className="block text-slate-300 mb-1.5">
                    Emergency Location / Sector
                  </label>

                  <input
                    type="text"
                    value={sosLocation}
                    onChange={(event) =>
                      setSosLocation(event.target.value)
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-red-500"
                  />

                </div>

                <div className="grid grid-cols-2 gap-4">

                  <div>

                    <label className="block text-slate-300 mb-1.5">
                      Total People
                    </label>

                    <input
                      type="number"
                      value={sosPeople}
                      onChange={(event) =>
                        setSosPeople(event.target.value)
                      }
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white"
                    />

                  </div>

                  <div>

                    <label className="block text-slate-300 mb-1.5">
                      Number Injured
                    </label>

                    <input
                      type="number"
                      value={sosInjured}
                      onChange={(event) =>
                        setSosInjured(event.target.value)
                      }
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white"
                    />

                  </div>

                </div>

                <div>

                  <label className="block text-slate-300 mb-1.5">
                    Description & Supplies Needed
                  </label>

                  <textarea
                    rows={3}
                    value={sosDetails}
                    onChange={(event) =>
                      setSosDetails(event.target.value)
                    }
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

          {/* =========================================
              I'M SAFE
          ========================================= */}

          {activeTab === "imsafe" && (

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              <div className="lg:col-span-5 p-6 rounded-2xl bg-[#090c1b] border border-slate-800 space-y-4">

                <div className="flex items-center gap-3">

                  <UserCheck className="w-8 h-8 text-emerald-400" />

                  <h3 className="text-xl font-black text-white">
                    Mark Yourself Safe
                  </h3>

                </div>

                <form
                  onSubmit={handleImSafeSubmit}
                  className="space-y-4 text-sm font-semibold"
                >

                  <div>

                    <label className="block text-slate-300 mb-1">
                      Your Full Name
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. Rahul Verma"
                      value={safeForm.name}
                      onChange={(event) =>
                        setSafeForm({
                          ...safeForm,
                          name: event.target.value,
                        })
                      }
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white"
                    />

                  </div>

                  <div>

                    <label className="block text-slate-300 mb-1">
                      Current Safe Location
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. Relief Shelter Camp 2"
                      value={safeForm.location}
                      onChange={(event) =>
                        setSafeForm({
                          ...safeForm,
                          location: event.target.value,
                        })
                      }
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white"
                    />

                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl"
                  >
                    Broadcast Safety Status
                  </button>

                </form>

              </div>

              <div className="lg:col-span-7 p-6 rounded-2xl bg-[#090c1b] border border-slate-800 space-y-4">

                <h3 className="text-xl font-black text-white">
                  Verified Safe Citizens Stream
                </h3>

                <div className="space-y-3">

                  {safeUsers.map((user) => (

                    <div
                      key={user.id}
                      className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center"
                    >

                      <div>

                        <p className="font-bold text-white text-base">
                          {user.name}
                        </p>

                        <p className="text-xs text-slate-400">
                          {user.location}
                        </p>

                      </div>

                      <span className="text-xs text-emerald-400 font-mono font-bold">
                        {user.timestamp}
                      </span>

                    </div>

                  ))}

                </div>

              </div>

            </div>

          )}

          {/* =========================================
              DISASTER MAP
          ========================================= */}

          {activeTab === "map" && (

            <div className="p-6 rounded-2xl bg-[#090c1b] border border-slate-800 space-y-4">

              <div className="flex justify-between items-center">

                <h3 className="text-xl font-black text-white">
                  Integrated Multi-Zone Disaster Map
                </h3>

                <div className="flex gap-4 text-xs font-bold">

                  <span className="text-red-400 flex items-center gap-1.5">
                    <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                    Danger Zone
                  </span>

                  <span className="text-amber-400 flex items-center gap-1.5">
                    <span className="w-3 h-3 bg-amber-500 rounded-full"></span>
                    Blocked Access
                  </span>

                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <span className="w-3 h-3 bg-emerald-500 rounded-full"></span>
                    Safe Relief Camp
                  </span>

                </div>

              </div>

              <div className="h-[520px] rounded-2xl overflow-hidden border border-slate-800">

                <MapContainer
                  center={mapCenter}
                  zoom={mapZoom}
                  className="h-full w-full"
                >

                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                  <MapController
                    center={mapCenter}
                    zoom={mapZoom}
                  />

                  {incidents.map((incident) => (

                    <React.Fragment key={incident.id}>

                      <Marker
                        position={[
                          incident.lat,
                          incident.lng,
                        ]}
                      >

                        <Popup>
                          {incident.name} ({incident.priority})
                        </Popup>

                      </Marker>

                      <Circle
                        center={[
                          incident.lat,
                          incident.lng,
                        ]}
                        radius={
                          incident.zoneType === "Danger"
                            ? 2500
                            : incident.zoneType === "Blocked"
                            ? 1500
                            : 1000
                        }
                        pathOptions={{
                          color:
                            incident.zoneType === "Danger"
                              ? "red"
                              : incident.zoneType === "Blocked"
                              ? "orange"
                              : "green",

                          fillColor:
                            incident.zoneType === "Danger"
                              ? "red"
                              : incident.zoneType === "Blocked"
                              ? "orange"
                              : "green",

                          fillOpacity: 0.3,
                        }}
                      />

                    </React.Fragment>

                  ))}

                </MapContainer>

              </div>

            </div>

          )}

          {/* =========================================
              RELIEF
          ========================================= */}

          {activeTab === "relief" && (

            <div className="p-8 rounded-2xl bg-[#090c1b] border border-slate-800 space-y-6">

              <h3 className="text-2xl font-black text-white">
                Relief Supply Tracking Module
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">

                <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800">

                  <p className="text-sm text-slate-400 font-bold">
                    Ration Packs
                  </p>

                  <p className="text-4xl font-black text-amber-400 mt-2">
                    {supplies.food}
                  </p>

                </div>

                <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800">

                  <p className="text-sm text-slate-400 font-bold">
                    Drinking Water
                  </p>

                  <p className="text-4xl font-black text-blue-400 mt-2">
                    {supplies.water} L
                  </p>

                </div>

                <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800">

                  <p className="text-sm text-slate-400 font-bold">
                    Medical Kits
                  </p>

                  <p className="text-4xl font-black text-red-400 mt-2">
                    {supplies.medicine}
                  </p>

                </div>

                <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800">

                  <p className="text-sm text-slate-400 font-bold">
                    Shelter Tents
                  </p>

                  <p className="text-4xl font-black text-emerald-400 mt-2">
                    {supplies.shelter}
                  </p>

                </div>

              </div>

            </div>

          )}

          {/* =========================================
              FUNDING
          ========================================= */}

          {activeTab === "funding" && (

            <div className="p-8 rounded-2xl bg-[#090c1b] border border-slate-800 space-y-6 max-w-3xl mx-auto">

              <div className="flex items-center gap-3">

                <DollarSign className="w-8 h-8 text-emerald-500" />

                <h3 className="text-2xl font-black text-white">
                  Disaster Relief Crowdfunding Integration
                </h3>

              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">

                <div className="flex justify-between font-bold text-sm">

                  <span className="text-slate-400">
                    Total Funds Collected
                  </span>

                  <span className="text-emerald-400">
                    ₹{funds.raised.toLocaleString()} / ₹
                    {funds.goal.toLocaleString()}
                  </span>

                </div>

                <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden">

                  <div
                    className="bg-emerald-500 h-full transition-all duration-500"
                    style={{
                      width: `${
                        (funds.raised / funds.goal) * 100
                      }%`,
                    }}
                  ></div>

                </div>

                <p className="text-xs text-slate-400 font-medium">
                  Supported by {funds.donors} donors nationwide.
                </p>

              </div>

            </div>

          )}

          {/* =========================================
              AI VICTIM INTELLIGENCE
          ========================================= */}

          {activeTab === "victim" && (

            <div className="p-8 rounded-2xl bg-[#090c1b] border border-slate-800 space-y-6">

              <h3 className="text-2xl font-black text-white">
                AI Dashboard Intelligence Payload
              </h3>

              <div className="p-8 bg-slate-900/90 rounded-2xl border border-slate-800 text-center space-y-4">

                <button
                  onClick={handleAIScan}
                  disabled={scanning}
                  className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-black text-sm rounded-xl uppercase tracking-wider disabled:opacity-50"
                >
                  {scanning
                    ? "RUNNING HARDWARE RADAR SCAN..."
                    : "FETCH AI GPR SENSOR DATA"}
                </button>

                {buriedData && (

                  <div className="space-y-3 pt-4 text-left">

                    {buriedData.map((data, index) => (

                      <div
                        key={index}
                        className="p-4 bg-slate-800 rounded-xl flex justify-between items-center text-sm"
                      >

                        <div>

                          <p className="font-bold text-white">
                            {data.location}
                          </p>

                          <p className="text-xs text-slate-400">
                            Depth: {data.depth} |{" "}
                            {data.heartRate}
                          </p>

                        </div>

                        <span className="px-3 py-1 bg-purple-950 text-purple-300 font-bold text-xs rounded-lg">
                          {data.priority}
                        </span>

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