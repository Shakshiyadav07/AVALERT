import React, { useState } from "react";

function Register({ onRegister, onLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
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

        if (onRegister) {
          onRegister(data);
        }

        onLogin();
      } else {
        alert(data.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Registration Error:", error);
      alert("Backend is not connected. Please start FastAPI.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">

        {/* =====================================================
            LEFT SIDE
        ====================================================== */}

        <div className="auth-left">

          {/* LOGO */}
          <div className="auth-logo">
            <div className="auth-logo-icon">
              🚨
            </div>

            <div className="auth-logo-text">
              <h1>AVALERT</h1>
              <p>Emergency Response System</p>
            </div>
          </div>

          {/* HEADING */}
          <h2>
            Create your
            <br />
            <span>Citizen Account.</span>
          </h2>

          {/* DESCRIPTION */}
          <p className="auth-description">
            Register with AVALERT to quickly access emergency
            services, share your location and keep your safety
            status updated.
          </p>

          {/* FEATURES */}
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


        {/* =====================================================
            RIGHT SIDE
        ====================================================== */}

        <div className="auth-right">

          <div className="auth-box">

            {/* HEADER */}
            <div className="auth-box-header">

              <h2>Create Account</h2>

              <p>
                Register to access your emergency dashboard
              </p>

            </div>


            {/* REGISTER FORM */}
            <form
              className="auth-form"
              onSubmit={handleRegister}
            >

              {/* FULL NAME */}
              <div className="auth-field">

                <label>Full Name</label>

                <div className="auth-input-wrapper">

                  <span className="auth-input-icon">
                    👤
                  </span>

                  <input
                    className="auth-input"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    required
                  />

                </div>

              </div>


              {/* EMAIL */}
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
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    required
                  />

                </div>

              </div>


              {/* PASSWORD */}
              <div className="auth-field">

                <label>Create Password</label>

                <div className="auth-input-wrapper">

                  <span className="auth-input-icon">
                    🔒
                  </span>

                  <input
                    className="auth-input"
                    type="password"
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    required
                  />

                </div>

              </div>


              {/* CREATE ACCOUNT BUTTON */}
              <button
                type="submit"
                className="auth-login-btn"
              >
                CREATE AVALERT ACCOUNT
              </button>

            </form>


            {/* LOGIN LINK */}
            <div className="auth-register">

              <span>Already have an account?</span>{" "}

              <span onClick={onLogin}>
                Login
              </span>

            </div>


            {/* SECURITY MESSAGE */}
            <div className="auth-security">

              🔐 Your personal information is securely handled.

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Register;