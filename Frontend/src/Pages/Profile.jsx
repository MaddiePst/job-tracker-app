// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setUser(token ? { token } : null);
  }, []);

  return (
    <div className="app-container py-8">
      <div className="max-w-lg mx-auto bg-white p-6 rounded-2xl shadow-card">
        <h2 className="text-xl font-semibold mb-2">Profile</h2>
        {user ? (
          <div className="text-sm text-muted">
            Token present — you're logged in
          </div>
        ) : (
          <div className="text-sm text-muted">No user loaded</div>
        )}
      </div>
    </div>
  );
}
