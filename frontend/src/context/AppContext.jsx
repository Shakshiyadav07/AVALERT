import React, { createContext, useContext, useState, useEffect } from "react";
import { calculateSOSPriority } from "../utils/sosEngine";

const AppContext = createContext();

const INITIAL_ZONES = [
  { id: "z1", name: "Sector B-4 (North Ridge)", status: "Danger", dangerLevel: "Critical Risk", lat: 34.08, lng: 74.79 },
  { id: "z2", name: "Valley Base Camp", status: "Safe", dangerLevel: "Low Risk", lat: 34.02, lng: 74.82 },
  { id: "z3", name: "Pass Connector 12", status: "Blocked", dangerLevel: "Road Debris Block", lat: 34.05, lng: 74.85 },
];

const INITIAL_SOS = [
  {
    id: "SOS-8091",
    user: "Aarav Sharma",
    location: "34.081, 74.792",
    zone: "Sector B-4",
    medicalEmergency: true,
    trappedCount: 3,
    ageGroup: "child_elderly",
    batteryLevel: 12,
    weatherRisk: "high",
    priority: "Critical",
    status: "Pending",
    time: "2 mins ago",
  },
  {
    id: "SOS-4022",
    user: "Priya Singh",
    location: "34.052, 74.851",
    zone: "Pass Connector 12",
    medicalEmergency: false,
    trappedCount: 1,
    ageGroup: "adult",
    batteryLevel: 45,
    weatherRisk: "medium",
    priority: "High",
    status: "In Progress",
    time: "12 mins ago",
  }
];

export function AppProvider({ children }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [zones, setZones] = useState(INITIAL_ZONES);
  const [sosList, setSosList] = useState(INITIAL_SOS);
  const [safeList, setSafeList] = useState([
    { id: "safe-1", name: "Rohan Verma", location: "Valley Base Camp", time: "10m ago", status: "Safe" }
  ]);
  const [supplies, setSupplies] = useState({
    foodKits: 450,
    waterLiters: 1200,
    medicalKits: 180,
    shelterTents: 65,
  });
  const [totalFunds, setTotalFunds] = useState(128500);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const dispatchSOS = (formData) => {
    const priorityMeta = calculateSOSPriority(formData);
    const newSOS = {
      id: `SOS-${Math.floor(1000 + Math.random() * 9000)}`,
      user: formData.userName || "Anonymous",
      location: formData.location || "Location Acquired",
      zone: formData.zone || "Sector B-4",
      ...formData,
      priority: priorityMeta.priority,
      status: "Pending",
      time: "Just now",
    };

    setSosList((prev) => [newSOS, ...prev]);
    return newSOS;
  };

  const markSafe = (person) => {
    setSafeList((prev) => [{ id: Date.now().toString(), ...person, time: "Just now", status: "Safe" }, ...prev]);
  };

  const updateSOSStatus = (id, newStatus) => {
    setSosList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  const addDonation = (amount) => {
    setTotalFunds((prev) => prev + Number(amount));
  };

  return (
    <AppContext.Provider
      value={{
        isOnline,
        zones,
        sosList,
        safeList,
        supplies,
        totalFunds,
        dispatchSOS,
        markSafe,
        updateSOSStatus,
        addDonation,
        setSupplies
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);