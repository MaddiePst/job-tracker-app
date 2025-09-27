import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn, logout } from "../utils/auth";

// Header
export default function Header() {
  const navigate = useNavigate();
  const logged = isLoggedIn();

  const doLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="site-header">
      <div className="container header-inner">
        {/* <div className="logo">
          <Link to="/">LOGO</Link>
        </div> */}
        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/jobs">Jobs</Link>
          {logged ? (
            <Link to="/profile">Profile</Link>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </nav>
        <div>
          {logged ? (
            <button className="btn" onClick={doLogout}>
              Logout
            </button>
          ) : (
            <Link to="/login" className="btn">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
