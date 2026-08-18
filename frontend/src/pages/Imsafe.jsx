import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserCheck, CheckCircle } from "lucide-react";

export default function Imsafe() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [safe, setSafe] = useState(false);

  const handleSafe = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://127.0.0.1:8000/safe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        location: location,
      }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      setSafe(true);
    } else {
      alert("Failed to update safe status.");
    }
  } catch (error) {
    console.error("Safe Status Error:", error);
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

      <div className="max-w-xl mx-auto bg-[#0b1020] border border-emerald-800 rounded-2xl p-6">

        {!safe ? (

          <>
            <div className="flex items-center gap-3 mb-6">
              <UserCheck className="text-emerald-400 w-10 h-10" />

              <div>
                <h1 className="text-2xl font-black">
                  I'M SAFE
                </h1>

                <p className="text-slate-400 text-sm">
                  Tell the rescue team that you are safe.
                </p>
              </div>
            </div>

            <form onSubmit={handleSafe} className="space-y-5">

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
                  Safe Location
                </label>

                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter your current safe location"
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 py-4 rounded-xl font-black"
              >
                MARK ME AS SAFE
              </button>

            </form>
          </>

        ) : (

          <div className="text-center py-8">

            <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto" />

            <h1 className="text-3xl font-black mt-4 text-emerald-400">
              You Are Safe!
            </h1>

            <p className="text-slate-400 mt-2">
              Your safe status has been shared with the rescue team.
            </p>

            <button
              onClick={() => navigate("/citizen")}
              className="mt-6 bg-emerald-600 px-6 py-3 rounded-xl font-bold"
            >
              Back to Dashboard
            </button>

          </div>

        )}

      </div>
    </div>
  );
}