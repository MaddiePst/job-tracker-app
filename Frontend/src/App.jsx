import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./Components/Header.jsx";
import Login from "./Pages/LogIn.jsx";
import Register from "./Pages/Register.jsx";
import Dashboard from "./Pages/Dashboard.jsx";
// import JobsList from "./Pages/JobsList.jsx";
import JobForm from "./Pages/JobForm.jsx";
import Profile from "./Pages/Profile.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import { isLoggedIn } from "./utils/auth.js";

export default function App() {
  return (
    <>
      {isLoggedIn() && <Header />}
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/logIn" />} />
          <Route path="/logIn" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            {/* <Route path="/jobs" element={<JobsList />} /> */}
            <Route path="/jobs/new" element={<JobForm />} />
            <Route path="/jobs/edit/:id" element={<JobForm />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route path="*" element={<div>404 - Not Found</div>} />
        </Routes>
      </main>
    </>
  );
}
