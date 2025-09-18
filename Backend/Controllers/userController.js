import users from "../Data/users.json" with { type: "json" };
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';
// import users from '../users.json';
import {readJSON, writeJSON} from "./reusableFunc.js";
import { v4 as uuidv4 } from 'uuid';
import { SECRET } from "../Middleware/middlewareUser.js";

// Create (POST) user
export const createNewUser = async (req, res) => {
  const user = req.body;
  const { name, email, password } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'All fields required!' });
  }

  const users = await readJSON('users');
  if (users.find(el => el.email === email)) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const newUser = { id: uuidv4(), email, password, name};
  users.push(newUser);
  await writeJSON('users', users);

  const token = jwt.sign({ id: newUser.id }, SECRET, { expiresIn: '7d' });

  res.json({ token, user: { id: newUser.id, email: newUser.email, name: newUser.name } });

  console.log('Users: ', users)

  return res.status(201).json({message: 'User created'});
};

//Read (GET) user/LogIn
export const logInUser = async (req, res) => {
  try {
    const body = req.body || {};
    const email = String(body.email || "").toLowerCase().trim();
    const password = String(body.password || "");

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    // Load users and show debug info
    const users = await readJSON("users.json");
    console.log("Loaded users count:", Array.isArray(users) ? users.length : 0);
    console.log("Users emails (first 10):", Array.isArray(users) ? users.slice(0,10).map(u => u.email) : users);

    // Find user by normalized email
    const userIndex = users.findIndex(u => String(u.email || "").toLowerCase().trim() === email);
    const user = userIndex === -1 ? null : users[userIndex];

    console.log("Login attempt for:", email, "found user:", !!user);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials", reason: "user_not_found" });
    }

    // Show partial stored password for debugging (first 10 chars)
    console.log("Stored password snippet:", String(user.password || "").slice(0, 10));

    // Try bcrypt compare if stored password looks like a bcrypt hash (starts with $2)
    let match = false;
    let usedPlaintextFallback = false;

    if (typeof user.password === "string" && user.password.startsWith("$2")) {
      try {
        match = await bcrypt.compare(password, user.password);
        console.log("bcrypt.compare result:", match);
      } catch (err) {
        console.error("bcrypt.compare error:", err);
      }
    } else {
      // fallback: maybe password was stored plaintext (not recommended)
      console.log("Password does not look hashed. Trying plaintext compare fallback.");
      if (password === user.password) {
        match = true;
        usedPlaintextFallback = true;
        console.log("Plaintext password matched!");
      } else {
        console.log("Plaintext password did NOT match.");
      }
    }

    if (!match) {
      return res.status(401).json({
        error: "Invalid credentials",
        reason: "password_mismatch",
        note: "Server tested bcrypt compare and plaintext fallback (if applicable). Check server logs for details."
      });
    }

    // If fallback matched (user had plaintext password), re-hash and persist (migrate to hashed password)
    if (usedPlaintextFallback) {
      try {
        const newHash = await bcrypt.hash(password, 10);
        users[userIndex].password = newHash;
        await writeJSON("users.json", users);
        console.log("Migrated plaintext password -> bcrypt hash for user:", user.email);
      } catch (err) {
        console.error("Failed to migrate/hash password:", err);
      }
    }

    // Success: sign token and return
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: "7d" });
    return res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// ✅ Update User
export const updateUserData = async (req, res) => {
  try {
    console.log("PUT /users/:id called");
    console.log("req.originalUrl:", req.originalUrl);
    console.log("req.params:", req.params);
    console.log("req.body:", req.body);

    const userId = req.params.id || req.body?.id;
    if (!userId) {
      return res.status(400).json({ message: "Missing id in params or body" });
    }

    // load users
    const users = await readJSON("users.json");
    console.log("Loaded users count:", Array.isArray(users) ? users.length : 0);

    // find index with flexible matching
    const idx = users.findIndex(u => String(u?.id) === String(userId));
    if (idx === -1) {
      const availableIds = users.slice(0, 10).map(u => ({ id: u.id, email: u.email }));
      return res.status(404).json({
        message: "User not found",
        hint: "Use an id from availableIds to test",
        availableIds
      });
    }

    // optionally enforce ownership: uncomment if you need it
    // if (users[idx].id !== req.user?.id) return res.status(403).json({ message: "Forbidden" });

    // determine allowed update fields
    const allowed = new Set(["email","name","password","role","phone"]); // adjust to your model
    const body = (req.body && typeof req.body === "object") ? (req.body.user || req.body) : {};
    const keys = Object.keys(body);
    if (keys.length === 0) {
      return res.status(400).json({ message: "Request body empty. Send fields to update." });
    }

    // apply updates (protect id/userId)
    const protectedFields = new Set(["id","userId","_id"]);
    const applied = [];
    for (const k of keys) {
      if (protectedFields.has(k)) continue;
      if (!allowed.has(k)) continue; // skip not allowed fields
      users[idx][k] = body[k];
      applied.push(k);
    }

    if (applied.length === 0) {
      return res.status(400).json({
        message: "No valid fields to update",
        allowedFields: Array.from(allowed),
        receivedKeys: keys
      });
    }

    // persist
    await writeJSON("users.json", users);

    return res.json({ message: "User updated", user: users[idx], applied });
  } catch (err) {
    console.error("updateUser error:", err);
    return res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

// ✅ Delete User
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  let users = await readJSON('users.json');
  const userIndex = users.findIndex((u) => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  const deletedUser = users[userIndex];
  users.splice(userIndex, 1);

  writeJSON('users.json',users);
  res.json({ message: "User deleted", user: deletedUser });
};

// Grabing info for the logged profile
export async function profileUser (req,res) {
 const users = await readJSON('users');
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });  
  return res.json({ id: user.id, name: user.name, email: user.email });
}
