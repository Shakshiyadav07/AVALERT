import React, { useState } from "react";
function Login({ onLogin, onRegister }) {
  const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
  return (
    <div className="auth-page">

      <div className="auth-container">

        {/* ================= LEFT SIDE ================= */}

        <div className="auth-left">

          <div className="auth-logo">

            <div className="auth-logo-icon">
              🚨
            </div>

            <div className="auth-logo-text">
              <h1>AVALERT</h1>
              <p>Emergency Response System</p>
            </div>

          </div>

          <h2>
            Stay Safe.
            <br />
            Stay <span>Connected.</span>
          </h2>

          <p className="auth-description">
            In an emergency, every second matters.
            AVALERT helps citizens quickly connect
            with rescue teams and share their safety status.
          </p>

          <div className="auth-features">

            <div className="auth-feature">
              <div className="auth-feature-icon">
                🚨
              </div>
              <span>One-Tap Emergency SOS</span>
            </div>

            <div className="auth-feature">
              <div className="auth-feature-icon">
                📍
              </div>
              <span>Share Your Emergency Location</span>
            </div>

            <div className="auth-feature">
              <div className="auth-feature-icon">
                ✓
              </div>
              <span>Update Your Safety Status</span>
            </div>

            <div className="auth-feature">
              <div className="auth-feature-icon">
                🔐
              </div>
              <span>Secure Citizen Access</span>
            </div>

          </div>

        </div>


        {/* ================= RIGHT SIDE ================= */}

        <div className="auth-right">

          <div className="auth-box">

            <div className="auth-box-header">

              <h2>Citizen Login</h2>

              <p>
                Login to access your emergency dashboard
              </p>

            </div>


            <form
              className="auth-form"
              onSubmit={(e) => {
                e.preventDefault();
                onLogin();
              }}
            >

              {/* Email */}

              <div className="auth-field">

                <label>Email Address</label>

                <div className="auth-input-wrapper">

                  <span className="auth-input-icon">
                    ✉
                  </span>

                  <input
                    className="auth-input"
                    type="email"
                    placeholder="Enter your email"
                    required
                  />

                </div>

              </div>


              {/* Password */}

              <div className="auth-field">

                <label>Password</label>

                <div className="auth-input-wrapper">

                  <span className="auth-input-icon">
                    🔒
                  </span>

                  <input
                    className="auth-input"
                    type="password"
                    placeholder="Enter your password"
                    required
                  />

                </div>

              </div>


              {/* Login */}

              <button
                className="auth-login-btn"
                type="submit"
              >
                LOGIN TO AVALERT
              </button>

            </form>


            {/* Register */}

            <div className="auth-register">

              Don't have an account?{" "}

              <span onClick={onRegister}>
                Create Account
              </span>

            </div>


            {/* Security */}

            <div className="auth-security">

              🔐 Your emergency information is securely handled.

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;