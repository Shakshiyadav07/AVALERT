import React from "react";
import { NavLink } from "react-router-dom";
import { ShieldAlert, Users, HeartHandshake, CircleDollarSign, Wifi, WifiOff } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Navigation() {
  const { isOnline } = useApp();

  const navItems = [
    { name: "Citizen SOS", path: "/", icon: ShieldAlert },
    { name: "Rescue HQ", path: "/rescue", icon: Users },
    { name: "Relief & Supplies", path: "/relief", icon: HeartHandshake },
    { name: "Disaster Funding", path: "/funding", icon: CircleDollarSign },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b0f17]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500 font-black">
            AV
          </div>
          <div>
            <span className="font-bold tracking-wider text-base uppercase text-slate-100 flex items-center gap-2">
              AVALERT <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/20 border border-red-500/30 text-red-400">COMMAND</span>
            </span>
            <p className="text-[10px] text-slate-400">Integrated Disaster Response System</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-red-500/10 text-red-400 border border-red-500/20 shadow-lg shadow-red-500/5"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${
              isOnline
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : "border-amber-500/30 bg-amber-500/10 text-amber-400"
            }`}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span>{isOnline ? "LIVE SYNC" : "OFFLINE ENGINE"}</span>
          </div>
        </div>
      </div>
    </header>
  );
}