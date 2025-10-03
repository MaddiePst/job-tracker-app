// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/users/logIn", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="app-container py-16">
      <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-card">
        <h2 className="text-2xl font-semibold mb-2">Welcome back</h2>
        <p className="text-sm text-muted mb-6">Sign in to manage your jobs</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <label className="block text-m text-muted">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border border-slate-500 rounded-md px-3 py-2"
              required
            />
          </label>

          <label className="block text-m text-muted">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full border border-slate-500 rounded-md px-3 py-2"
              required
            />
          </label>

          <button
            type="submit"
            className="w-full inline-flex justify-center px-4 py-2 bg-green-800 text-white rounded-md"
          >
            Log In
          </button>
        </form>

        <p className="text-sm text-center text-muted mt-4">
          Don't have an account?{" "}
          <Link className="text-brand-700 font-medium" to="/register">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
