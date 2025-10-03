// src/components/Header.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn, logout } from "../utils/auth";

export default function Header() {
  const navigate = useNavigate();
  const logged = isLoggedIn();
  const [open, setOpen] = useState(false);

  const doLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-green-900 border-b border-slate-100 shadow-m">
      <div className="app-container flex items-center justify-between gap-4 py-3 px-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            onClick={() => {
              setOpen(false);
              doLogout();
            }}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center text-gray-100 font-bold ">
              JT
            </div>
            <div className="hidden sm:block">
              <div className="text-lg font-semibold text-gray-100 ">
                JobTracker
              </div>
              <div className="text-xs text-muted -mt-0.5 text-gray-100 ">
                Manage your applications
              </div>
            </div>
          </Link>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/dashboard"
            className="text-m text-gray-100 hover:text-green-200"
          >
            Dashboard
          </Link>
          {/* <Link
            to="/allJobs"
            className="text-m text-gray-100 hover:text-green-200"
          >
            Jobs
          </Link> */}
        </nav>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-5">
          {logged ? (
            <button
              onClick={doLogout}
              className="px-4 py-1 rounded-md bg-gray-100 border border-slate-200 text-m hover:text-green-800"
            >
              Log out
            </button>
          ) : (
            " "
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setOpen((s) => !s)}
            aria-label="Toggle menu"
            className="p-2 rounded-md border border-gray-700 bg-white"
          >
            <svg
              className="w-5 h-5 text-slate-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <div className="md:hidden border-t border-slate-100 bg-white">
          <div className="app-container py-3 flex flex-col gap-2 items-center bg-gray-100">
            <Link
              to="/dashboard"
              onClick={() => setOpen(false)}
              className="text-gray-900 text-sm"
            >
              Dashboard
            </Link>
            {/* <Link
              to="/jobs"
              onClick={() => setOpen(false)}
              className=" text-gray-900 text-sm"
            >
              Jobs
            </Link> */}

            <button
              onClick={() => {
                setOpen(false);
                doLogout();
              }}
              className="mt-2 px-5 py-2 rounded-md text-white bg-green-900 text-sm "
            >
              Log out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
