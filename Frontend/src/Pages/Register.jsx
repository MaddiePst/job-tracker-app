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
    <div className="auth-page">
      <h2>Create account</h2>
      <form onSubmit={handleRegister} className="auth-form">
        <div>
          <label>
            Name:
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
        </div>

        <div>
          <label>
            Email:
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </label>
        </div>

        <div>
          <label>
            Password:
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
          </label>
        </div>
        <button className="btn" type="submit">
          Create account
        </button>
      </form>
    </div>
  );
}
