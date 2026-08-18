import React, { useState } from "react";
function Register({ onRegister, onLogin }) {
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
  return (
    <div className="auth-page">

      <div className="auth-box">

        {/* LEFT SIDE */}
        <div className="auth-left">

          <div className="brand">
            <div className="brand-icon">🚨</div>

            <div>
              <h1>AVALERT</h1>
              <span>EMERGENCY RESPONSE SYSTEM</span>
            </div>
          </div>

          <div className="auth-intro">
            <h2>
              Create Your <span>Account.</span>
            </h2>

            <p>
              Register with AVALERT to quickly access emergency
              services, share your location and keep your safety
              status updated.
            </p>
          </div>

          <div className="feature-list">

            <div className="feature">
              <div className="feature-icon">🚨</div>
              <span>One-Tap Emergency SOS</span>
            </div>

            <div className="feature">
              <div className="feature-icon">📍</div>
              <span>Share Your Emergency Location</span>
            </div>

            <div className="feature">
              <div className="feature-icon">✓</div>
              <span>Update Your Safety Status</span>
            </div>

            <div className="feature">
              <div className="feature-icon">🔐</div>
              <span>Secure Citizen Access</span>
            </div>

          </div>

        </div>


        {/* RIGHT SIDE */}
        <div className="auth-right">

          <div className="login-header">

            <div className="small-security">
              🔐 SECURE REGISTRATION
            </div>

            <h2>Create Citizen Account</h2>

            <p>
              Join AVALERT and stay connected during emergencies.
            </p>

          </div>

<form
  className="auth-form"
  onSubmit={async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert("Account created successfully!");

        onLogin();
      } else {
        alert(data.message || "Registration failed.");
      }

    } catch (error) {
      console.error("Registration Error:", error);
      alert("Backend is not connected. Please start FastAPI.");
    }
  }}
>
          
          

            {/* NAME */}
            <div className="input-group">

              <label>Full Name</label>

              <div className="input-wrapper">
                <span>👤</span>

                <input
                type="text"
             placeholder="Enter your full name"
              value={name}
            onChange={(e) => setName(e.target.value)}
          required
/>
              </div>

            </div>


            {/* EMAIL */}
            <div className="input-group">

              <label>Email Address</label>

              <div className="input-wrapper">
                <span>✉</span>

                <input
  type="email"
  placeholder="Enter your email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
/>
              </div>

            </div>


            {/* PASSWORD */}
            <div className="input-group">

              <label>Create Password</label>

              <div className="input-wrapper">
                <span>🔒</span>

                <input
  type="password"
  placeholder="Create a strong password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  required
/>
              </div>

            </div>


            {/* REGISTER BUTTON */}
            <button
              type="submit"
              className="login-button"
            >
              CREATE AVALERT ACCOUNT
            </button>

          </form>


          {/* LOGIN LINK */}
          <div className="register-link">

            <span>Already have an account?</span>

            <button
              type="button"
              onClick={onLogin}
              className="link-button"
            >
              Login
            </button>

          </div>


          {/* SECURITY MESSAGE */}
          <div className="security-message">
            🔐 Your personal information is securely handled.
          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;