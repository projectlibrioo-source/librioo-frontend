import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import logActivity from '../utils/logActivity';
import logo from "../../assets/logoLib3-1.png";

const AdminLogin = () => {
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/admin/dashboard";

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!adminId.trim() || !password.trim()) {
    setError("Please enter your admin ID/email and password.");
    return;
  }

  setError("");
  setLoading(true);

  try {
    await signInWithEmailAndPassword(auth, adminId.trim(), password);
    // ✅ Log admin login
    await logActivity("admin", "settings", `Admin logged in: ${adminId.trim()}`);
    navigate("/admin/dashboard");

    
  } catch (err) {
    console.log("Error code:", err.code);
    console.log("Error message:", err.message);
    switch (err.code) {
      case "auth/user-not-found":
      case "auth/invalid-credential":
      case "auth/wrong-password":
        setError("Invalid email or password. Please try again.");
        break;
      case "auth/invalid-email":
        setError("Please enter a valid email address.");
        break;
      case "auth/too-many-requests":
        setError("Too many failed attempts. Please try again later.");
        break;
      default:
        setError("Login failed. Please try again.");
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-[#f6f7fb] flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex w-[320px] bg-[#eef4fb] border-r border-[#dbe5f0] flex-col justify-between p-10">
        <div>
          <img
            src={logo}
            alt="Librioo Logo"
            className="h-20 w-auto"
          />
          <p className="mt-4 text-[15px] leading-7 text-[#6b7280] max-w-[240px]">
            Library administration system for managing books, users,
            transactions, and robot operations.
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-[#dbe5f0] bg-white px-5 py-4">
            <p className="text-sm font-semibold text-[#111827]">Books</p>
            <p className="mt-1 text-sm text-[#6b7280]">
              Manage and organize library collections.
            </p>
          </div>

          <div className="rounded-2xl border border-[#dbe5f0] bg-white px-5 py-4">
            <p className="text-sm font-semibold text-[#111827]">Users</p>
            <p className="mt-1 text-sm text-[#6b7280]">
              Maintain member and guest information.
            </p>
          </div>

          <div className="rounded-2xl border border-[#dbe5f0] bg-white px-5 py-4">
            <p className="text-sm font-semibold text-[#111827]">Robot Status</p>
            <p className="mt-1 text-sm text-[#6b7280]">
              Monitor and manage guidance features.
            </p>
          </div>
        </div>
      </div>

      {/* Right section */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-[500px]">
          {/* Top heading */}
          <div className="mb-8">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#9ca3af]">
              Admin Portal
            </p>
            <h2 className="mt-2 text-[44px] font-bold tracking-tight text-[#111827]">
              Login
            </h2>
            <p className="mt-2 text-[15px] text-[#6b7280]">
              Sign in to continue to the Librioo administration dashboard.
            </p>
          </div>

          {/* Login Card */}
          <div className="rounded-[24px] border border-[#e5e7eb] bg-white shadow-[0_10px_30px_rgba(17,24,39,0.06)]">
            {/* Card top */}
            <div className="border-b border-[#eef2f7] px-8 py-5">
              <div className="flex items-center justify-between">
                <h3 className="text-[28px] font-bold text-[#111827]">
                  Admin Sign In
                </h3>
                <div className="rounded-full bg-[#f3f4f6] px-4 py-1.5 text-sm font-semibold text-[#2563eb]">
                  Secure Access
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-8 py-8">
              <div className="space-y-6">
                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#374151]">
                    Admin ID or Email
                  </label>
                  <input
                    type="text"
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    placeholder="Enter admin ID or email"
                    className="h-[54px] w-full rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 text-sm text-[#111827] placeholder:text-[#9ca3af] focus:border-[#60a5fa] focus:bg-white focus:ring-2 focus:ring-[#dbeafe]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#374151]">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="h-[54px] w-full rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 text-sm text-[#111827] placeholder:text-[#9ca3af] focus:border-[#60a5fa] focus:bg-white focus:ring-2 focus:ring-[#dbeafe]"
                  />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <label className="flex items-center gap-2 text-sm text-[#6b7280]">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border border-[#cbd5e1] bg-white accent-[#2563eb]"
                    />
                    Remember me
                  </label>

                  <a
                    href="/forgot-password"
                    className="text-sm font-semibold text-[#2563eb] hover:text-[#1d4ed8]"
                  >
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  className="h-[54px] w-full rounded-xl bg-[#2563eb] text-sm font-semibold text-white transition hover:bg-[#1d4ed8]"
                >
                  Login to Dashboard
                </button>
              </div>
            </form>
          </div>

          {/* Bottom note */}
          <p className="mt-5 text-center text-sm text-[#9ca3af]">
            Librioo Library Management System
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;