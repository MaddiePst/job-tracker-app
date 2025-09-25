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
    <div className="auth-page">
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="auth-form">
        <div>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
        </div>
        <button className="btn" type="submit">
          Log In
        </button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Create account</Link> here
      </p>
    </div>
  );
}
