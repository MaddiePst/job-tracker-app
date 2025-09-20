import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { readJSON, writeJSON } from "./reusableFunc.js";
import { v4 as uuidv4 } from "uuid";
import { SECRET } from "../Middleware/middlewareUser.js";

/// Read data
const rawData = await readJSON("users.json"); // returns { jobs: [...] }
const users = rawData.users || [];
// console.log(jobs);

// ******Create (POST) user*****
export const createNewUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name)
      return res
        .status(400)
        .json({ message: "Email, password and name required" });

    const normalized = String(email).toLowerCase().trim();

    if (
      users.find((u) => String(u.email).toLowerCase().trim() === normalized)
    ) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = { id: uuidv4(), email, password, name };

    users.push(newUser);
    await writeJSON("users.json", users);

    // never return password hash to client
    return res
      .status(201)
      .json({ id: newUser.id, email: newUser.email, name: newUser.name });
  } catch (err) {
    console.error("createUser error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

//Read (GET) user/LogIn
export const logInUser = async (req, res) => {
  try {
    const body = req.body || {};
    const email = String(body.email || "")
      .toLowerCase()
      .trim();
    const password = String(body.password || "");

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    // Load users and show debug info
    const users = await readJSON("users.json");
    console.log("Loaded users count:", Array.isArray(users) ? users.length : 0);
    console.log(
      "Users emails (first 10):",
      Array.isArray(users) ? users.slice(0, 10).map((u) => u.email) : users
    );

    // Find user by normalized email
    const userIndex = users.findIndex(
      (u) =>
        String(u.email || "")
          .toLowerCase()
          .trim() === email
    );
    const user = userIndex === -1 ? null : users[userIndex];

    console.log("Login attempt for:", email, "found user:", !!user);
    if (!user) {
      return res
        .status(401)
        .json({ error: "Invalid credentials", reason: "user_not_found" });
    }

    // Show partial stored password for debugging (first 10 chars)
    console.log(
      "Stored password snippet:",
      String(user.password || "").slice(0, 10)
    );

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
      console.log(
        "Password does not look hashed. Trying plaintext compare fallback."
      );
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
        note: "Server tested bcrypt compare and plaintext fallback (if applicable). Check server logs for details.",
      });
    }

    // If fallback matched (user had plaintext password), re-hash and persist (migrate to hashed password)
    if (usedPlaintextFallback) {
      try {
        const newHash = await bcrypt.hash(password, 10);
        users[userIndex].password = newHash;
        await writeJSON("users.json", users);
        console.log(
          "Migrated plaintext password -> bcrypt hash for user:",
          user.email
        );
      } catch (err) {
        console.error("Failed to migrate/hash password:", err);
      }
    }

    // Success: sign token and return
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, {
      expiresIn: "7d",
    });
    return res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//  Update User
export const updateUserData = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId)
      return res.status(400).json({ message: "Missing id in params" });

    const users = await readJSON("users.json");
    const idx = users.findIndex((u) => String(u.id) === String(userId));
    if (idx === -1) return res.status(404).json({ message: "User not found" });

    const { name, email, password } = req.body || {};
    if (email) users[idx].email = String(email).toLowerCase().trim();
    if (name !== undefined) users[idx].name = name;
    if (password) {
      const hash = await bcrypt.hash(password, SALT_ROUNDS);
      users[idx].password = hash;
    }

    await writeJSON("users.json", users);
    return res.json({
      message: "User updated",
      user: {
        id: users[idx].id,
        email: users[idx].email,
        name: users[idx].name,
      },
    });
  } catch (err) {
    console.error("updateUser error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

//  Delete User
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId)
      return res.status(400).json({ message: "Missing id in params" });

    const users = await readJSON("users.json");
    const idx = users.findIndex((u) => String(u.id) === String(userId));
    if (idx === -1) return res.status(404).json({ message: "User not found" });

    const [removed] = users.splice(idx, 1);
    await writeJSON("users.json", users);
    return res.json({ message: "User deleted", id: removed.id });
  } catch (err) {
    console.error("deleteUser error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
