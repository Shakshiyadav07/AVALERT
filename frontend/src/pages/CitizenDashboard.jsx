import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldAlert,
  UserCheck,
  MapPin,
  LogOut,
} from "lucide-react";

export default function CitizenDashboard() {
  const navigate = useNavigate();

  const [location, setLocation] = useState(null);
  return (
    <div className="min-h-screen bg-[#060813] text-white p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black">
            AVALERT
          </h1>

          <p className="text-slate-400 text-sm">
            Citizen Emergency Dashboard
          </p>
        </div>

        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-xl"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {/* Welcome */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold">
          Welcome, Citizen
        </h2>

        <p className="text-slate-400 mt-1">
          Stay safe. Send emergency alerts or update your safety status.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* SOS Card */}
        <div className="bg-[#0b1020] border border-red-800 rounded-2xl p-6">

          <ShieldAlert className="text-red-500 w-10 h-10 mb-4" />

          <h3 className="text-xl font-bold">
            Emergency SOS
          </h3>

          <p className="text-slate-400 text-sm mt-2 mb-5">
            Send an emergency request to the rescue team.
          </p>

          <button
            onClick={() => navigate("/citizen/sos")}
            className="w-full bg-red-600 hover:bg-red-500 py-3 rounded-xl font-bold"
          >
            SEND SOS
          </button>

        </div>

        {/* I'm Safe Card */}
        <div className="bg-[#0b1020] border border-emerald-800 rounded-2xl p-6">

          <UserCheck className="text-emerald-400 w-10 h-10 mb-4" />

          <h3 className="text-xl font-bold">
            I'M SAFE
          </h3>

          <p className="text-slate-400 text-sm mt-2 mb-5">
            Inform your family and rescue team that you are safe.
          </p>

          <button
            onClick={() => navigate("/citizen/safe")}
            className="w-full bg-emerald-600 hover:bg-emerald-500 py-3 rounded-xl font-bold"
          >
            I'M SAFE
          </button>

        </div>

        {/* Location Card */}
        <div className="bg-[#0b1020] border border-cyan-800 rounded-2xl p-6">

          <MapPin className="text-cyan-400 w-10 h-10 mb-4" />

          <h3 className="text-xl font-bold">
            My Location
          </h3>

          <p className="text-slate-400 text-sm mt-2">
            Your current emergency location will be shared with the rescue team.
          </p>
          {location && (
  <div className="mt-4 bg-slate-900 rounded-xl p-3 text-sm">
    <p>
      <span className="text-cyan-400">Latitude:</span>{" "}
      {location.latitude}
    </p>

    <p>
      <span className="text-cyan-400">Longitude:</span>{" "}
      {location.longitude}
    </p>
  </div>
)}
          <button
            onClick={() => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    },
    () => {
      alert("Unable to get your location.");
    }
  );
}}
            className="w-full mt-5 bg-cyan-700 hover:bg-cyan-600 py-3 rounded-xl font-bold"
          >
            GET LOCATION
          </button>

        </div>

      </div>

    </div>
  );
}