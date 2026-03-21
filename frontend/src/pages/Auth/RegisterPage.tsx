import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import type { UserRole } from "../../types";
import {
  GraduationCap,
  Mail,
  Lock,
  User,
  Building2,
  IdCard,
  AlertCircle,
  Loader2,
  Users,
  BookOpen,
} from "lucide-react";
import "./Auth.css";

export const RegisterPage: React.FC = () => {
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student" as UserRole,
    department: "",
    rollNumber: "",
    employeeId: "",
  });
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.department
    ) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (!formData.email.endsWith("@krmu.edu.in")) {
      setError("Please use your KRMU institutional email (@krmu.edu.in)");
      return;
    }

    if (formData.role === "student" && !formData.rollNumber) {
      setError("Roll number is required for students");
      return;
    }

    if (formData.role === "faculty" && !formData.employeeId) {
      setError("Employee ID is required for faculty");
      return;
    }

    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      department: formData.department,
      ...(formData.role === "student"
        ? { rollNumber: formData.rollNumber }
        : { employeeId: formData.employeeId }),
    };

    const success = await register(userData);
    if (success) {
      navigate("/login");
    } else {
      setError("Email already registered. Please use a different email.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container register-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <GraduationCap size={32} />
            </div>
            <h1>Create Account</h1>
            <p>Join the KRMU Event Management System</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div className="alert alert-error">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <div className="role-selector">
              <button
                type="button"
                className={`role-btn ${formData.role === "student" ? "active" : ""}`}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, role: "student" }))
                }
              >
                <BookOpen size={20} />
                <span>Student</span>
              </button>
              <button
                type="button"
                className={`role-btn ${formData.role === "faculty" ? "active" : ""}`}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, role: "faculty" }))
                }
              >
                <Users size={20} />
                <span>Faculty</span>
              </button>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="name">
                  Full Name *
                </label>
                <div className="input-with-icon">
                  <User size={18} className="input-icon" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="form-input"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  Email Address *
                </label>
                <div className="input-with-icon">
                  <Mail size={18} className="input-icon" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="form-input"
                    placeholder="you@krmu.edu.in"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="department">
                  Department *
                </label>
                <div className="input-with-icon">
                  <Building2 size={18} className="input-icon" />
                  <select
                    id="department"
                    name="department"
                    className="form-input form-select"
                    value={formData.department}
                    onChange={handleChange}
                    disabled={isLoading}
                  >
                    <option value="">Select Department</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Technology">
                      Information Technology
                    </option>
                    <option value="Electronics">
                      Electronics & Communication
                    </option>
                    <option value="Mechanical">Mechanical Engineering</option>
                    <option value="Civil">Civil Engineering</option>
                    <option value="Management">Management Studies</option>
                    <option value="Law">Law</option>
                    <option value="Pharmacy">Pharmacy</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label
                  className="form-label"
                  htmlFor={
                    formData.role === "student" ? "rollNumber" : "employeeId"
                  }
                >
                  {formData.role === "student"
                    ? "Roll Number *"
                    : "Employee ID *"}
                </label>
                <div className="input-with-icon">
                  <IdCard size={18} className="input-icon" />
                  <input
                    id={
                      formData.role === "student" ? "rollNumber" : "employeeId"
                    }
                    name={
                      formData.role === "student" ? "rollNumber" : "employeeId"
                    }
                    type="text"
                    className="form-input"
                    placeholder={
                      formData.role === "student"
                        ? "e.g., 2024CS001"
                        : "e.g., FAC001"
                    }
                    value={
                      formData.role === "student"
                        ? formData.rollNumber
                        : formData.employeeId
                    }
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="password">
                  Password *
                </label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className="form-input"
                    placeholder="Min. 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="confirmPassword">
                  Confirm Password *
                </label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    className="form-input"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
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
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account? <Link to="/login">Sign in here</Link>
            </p>
          </div>
        </div>

        <div className="auth-side">
          <div className="auth-side-content">
            <h2>Join KRMU Today</h2>
            <p>
              Create your account to access event management features tailored
              for your role.
            </p>

            <div className="role-benefits">
              <div className="benefit-section">
                <h3>👨‍🎓 For Students</h3>
                <ul>
                  <li>Browse and discover events</li>
                  <li>One-click event registration</li>
                  <li>Track your participation</li>
                  <li>View attendance records</li>
                </ul>
              </div>

              <div className="benefit-section">
                <h3>👨‍🏫 For Faculty</h3>
                <ul>
                  <li>Create and manage events</li>
                  <li>Digital attendance marking</li>
                  <li>Automated email reports</li>
                  <li>View registration analytics</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
