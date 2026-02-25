import "./AuthPage.css";
import React, { useState } from "react";

function AuthPage() {
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <div className={`container ${isRegistering ? "active" : ""}`}>
      {/* Login Form */}
      <div className="form-box Login">
        <div className="animation">
          <h2>Login</h2>
          <div className="input-box">
            <input type="text" required />
            <label>Username</label>
          </div>
          <div className="input-box">
            <input type="password" required />
            <label>Password</label>
          </div>
          <button className="btn">Login</button>
          <div className="regi-link">
            Don't have an account?{" "}
            <button className="link-button" onClick={() => setIsRegistering(true)}>Sign Up</button>
          </div>
        </div>
      </div>

      {/* Register Form */}
      <div className="form-box Register">
        <div className="animation">
          <h2>Register</h2>
          <div className="input-box">
            <input type="text" required />
            <label>Username</label>
          </div>
          <div className="input-box">
            <input type="email" required />
            <label>Email</label>
          </div>
          <div className="input-box">
            <input type="password" required />
            <label>Password</label>
          </div>
          <button className="btn">Register</button>
          <div className="regi-link">
            Already have an account?{" "}
            <button className="link-button" onClick={() => setIsRegistering(false)}>Sign In</button>
          </div>
        </div>
      </div>

      {/* Info Panels */}
      <div className="info-content Login">
        <div className="animation">
          <h2>WELCOME BACK!</h2>
          <p>We are happy to have you with us again. If you need anything, we are here to help.</p>
        </div>
      </div>

      <div className="info-content Register">
        <div className="animation">
          <h2>WELCOME!</h2>
          <p>We’re delighted to have you here. If you need any assistance, feel free to reach out.</p>
        </div>
      </div>

      {/* Decorative Shapes */}
      <div className="curved-shape"></div>
      <div className="curved-shape2"></div>
    </div>
  );
}

export default AuthPage;