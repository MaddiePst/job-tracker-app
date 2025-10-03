// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post("/users/createUser", { name, email, password });
      alert("Registered! Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Register failed");
    }
  };

  return (
    <div className="app-container py-16">
      <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-card">
        <h2 className="text-2xl font-semibold mb-2">Create account</h2>
        <p className="text-sm text-muted mb-6">
          Start tracking your job applications
        </p>

        <form onSubmit={handleRegister} className="space-y-4">
          <label className="block text-m text-muted">
            Name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border border-slate-500 rounded-md px-3 py-2"
              required
            />
          </label>

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
          <div class="flex gap-7">
            <button
              type="submit"
              className="w-auto inline justify-center px-18 py-2 bg-green-900 text-white rounded-md "
            >
              Create account
            </button>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-auto inline justify-center px-8 py-2 bg-gray-200 text-gray-900 rounded-md"
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
