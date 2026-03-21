import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { GraduationCap, Mail, Lock, AlertCircle, Loader2 } from "lucide-react";
import "./Auth.css";

export const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    const success = await login(email, password);
    if (success) {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

      if (storedUser.role === "faculty") {
        navigate("/faculty/dashboard");
      } else {
        navigate("/student/dashboard");
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <GraduationCap size={32} />
            </div>
            <h1>Welcome Back</h1>
            <p>Sign in to access your KRMU account</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div className="alert alert-error">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email Address
              </label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  placeholder="you@krmu.edu.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  id="password"
                  type="password"
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block btn-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account? <Link to="/register">Register here</Link>
            </p>
          </div>

          <div className="demo-credentials">
            <h4>Demo Credentials</h4>
            <div className="demo-grid">
              <div className="demo-item">
                <span className="demo-label">Faculty:</span>
                <code>faculty@krmu.edu.in</code>
                <code>faculty123</code>
              </div>
              <div className="demo-item">
                <span className="demo-label">Student:</span>
                <code>student@krmu.edu.in</code>
                <code>student123</code>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-side">
          <div className="auth-side-content">
            <h2>KRMU Smart College Event & Attendance Management System</h2>
            <p>
              A centralized digital platform for managing college events,
              student registrations, and attendance seamlessly.
            </p>
            <ul className="feature-list">
              <li>📅 Easy event management</li>
              <li>✅ Digital attendance tracking</li>
              <li>📧 Automated email reports</li>
              <li>📊 Real-time statistics</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
