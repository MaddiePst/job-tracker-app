import React, { useEffect, useState } from "react";
// import api from "../utils/api.js";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Alternatively fetch /users/logIn? (not ideal). If you implement /me, call it.
    // For now show the token-decoded info if needed.
    const token = localStorage.getItem("token");
    setUser(token ? { token } : null);
  }, []);

  return (
    <div>
      <h2>Profile</h2>
      {user ? <div>Token present</div> : <div>No user loaded</div>}
    </div>
  );
}
