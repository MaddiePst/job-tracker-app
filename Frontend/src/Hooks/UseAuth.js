import { useState, useEffect } from "react";
import { isLoggedIn } from "../utils/auth";

export default function useAuth() {
  const [authed, setAuthed] = useState(isLoggedIn());
  useEffect(() => {
    const onStorage = () => setAuthed(isLoggedIn());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  return authed;
}
