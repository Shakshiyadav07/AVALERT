import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, MapPin } from "lucide-react";

export default function SOS() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [people, setPeople] = useState(1);
  const [injured, setInjured] = useState(0);
  const [sent, setSent] = useState(false);
  const [description, setDescription] = useState("");
 const handleSOS = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://127.0.0.1:8000/sos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
  name: name,
  location: location,
  people: Number(people),
  injured: Number(injured),
  description: description,
}),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      setSent(true);
    } else {
      alert("Failed to send SOS.");
    }
  } catch (error) {
    console.error("SOS Error:", error);
    alert("Backend is not connected. Please make sure FastAPI is running.");
  }
};

  return (
    <div className="min-h-screen bg-[#060813] text-white p-6">

      <button
        onClick={() => navigate("/citizen")}
        className="mb-6 text-slate-400 hover:text-white"
      >
        ← Back to Dashboard
      </button>

      <div className="max-w-2xl mx-auto bg-[#0b1020] border border-red-800 rounded-2xl p-6">

        <div className="flex items-center gap-3 mb-6">
          <ShieldAlert className="text-red-500 w-10 h-10" />

          <div>
            <h1 className="text-2xl font-black">
              Emergency SOS
            </h1>

            <p className="text-slate-400 text-sm">
              Send your emergency information to the rescue team.
            </p>
          </div>
        </div>

        {sent ? (
          <div className="bg-emerald-900/30 border border-emerald-500 rounded-xl p-6 text-center">

            <h2 className="text-2xl font-bold text-emerald-400">
              SOS Sent Successfully!
            </h2>

            <p className="text-slate-300 mt-2">
              Rescue team has received your emergency request.
            </p>

            <button
              onClick={() => navigate("/citizen")}
              className="mt-5 bg-emerald-600 px-6 py-3 rounded-xl font-bold"
            >
              Back to Dashboard
            </button>

          </div>
        ) : (

          <form onSubmit={handleSOS} className="space-y-5">

            <div>
              <label className="block mb-2 text-slate-300">
                Your Name
              </label>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3"
              />
            </div>

            <div>
              <label className="block mb-2 text-slate-300">
                Emergency Location
              </label>

              <div className="flex gap-2">

                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter location"
                  required
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl p-3"
                />

                <button
                  type="button"
                  className="px-4 bg-cyan-700 rounded-xl"
                  onClick={() => setLocation("Current GPS Location")}
                >
                  <MapPin />
                </button>

              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">

              <div>
                <label className="block mb-2 text-slate-300">
                  People Trapped
                </label>

                <input
                  type="number"
                  min="1"
                  value={people}
                  onChange={(e) => setPeople(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3"
                />
              </div>

              <div>
                <label className="block mb-2 text-slate-300">
                  Injured People
                </label>

                <input
                  type="number"
                  min="0"
                  value={injured}
                  onChange={(e) => setInjured(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3"
                />
              </div>

            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-500 py-4 rounded-xl font-black"
            >
              SEND EMERGENCY SOS
            </button>

          </form>

        )}

      </div>
    </div>
  );
}