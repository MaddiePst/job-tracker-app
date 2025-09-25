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
    // Verify for all required fields to be complete
    if (!email || !password || !name)
      return res
        .status(400)
        .json({ message: "Email, password and name required" });

    const normalized = String(email).toLowerCase().trim();

    // Check if the user alredy exists
    if (
      users.find((u) => String(u.email).toLowerCase().trim() === normalized)
    ) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Establish new user
    const newUser = { id: uuidv4(), email, password, name };

    // Add new user to the data
    users.push(newUser);
    await writeJSON("users.json", users);

    return res
      .status(201)
      .json({ id: newUser.id, email: newUser.email, name: newUser.name });
  } catch (err) {
    console.error("createUser error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

//************Read (GET) user/LogIn**********
export const logInUser = async (req, res) => {
  try {
    const body = req.body || {};
    const email = String(body.email || "")
      .toLowerCase()
      .trim();
    const password = String(body.password || "");

    // Check if email and password exists
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    //Read users
    const users = await readJSON("users.json");
    // console.log("Loaded users count:", Array.isArray(users) ? users.length : 0);

    // Find if user exists
    const userIndex = Array.isArray(users)
      ? users.findIndex(
          (u) =>
            String(u.email || "")
              .toLowerCase()
              .trim() === email
        )
      : -1;
    const user = userIndex === -1 ? null : users[userIndex];
    // console.log("Login attempt for:", email, "found user:", !!user);

    // Check for user
    if (!user)
      return res
        .status(401)
        .json({ error: "Invalid credentials", reason: "user_not_found" });

    console.log(
      "Stored password snippet:",
      String(user.password || "").slice(0, 20)
    );

    let match = false;
    let migratedPlaintext = false;

    // If stored password looks like bcrypt ($2), try bcrypt.compare
    if (typeof user.password === "string" && user.password.startsWith("$2")) {
      try {
        match = await bcrypt.compare(password, user.password);
        console.log("bcrypt.compare result:", match);
      } catch (err) {
        console.error("bcrypt.compare error:", err);
      }
    } else {
      // Fallback: maybe password was stored plaintext (unsafe). Try plaintext compare.
      console.log("Password not hashed. Trying plaintext fallback.");
      if (password === user.password) {
        match = true;
        migratedPlaintext = true;
        console.log("Plaintext password matched; will migrate to bcrypt hash.");
      } else {
        console.log("Plaintext compare failed.");
      }
    }

    // When is not a match
    if (!match) {
      return res.status(401).json({
        error: "Invalid credentials",
        reason: "password_mismatch",
        note: "Check the password you typed or re-create the user if needed.",
      });
    }

    // If we matched using plaintext fallback, re-hash and save to users.json
    if (migratedPlaintext) {
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

    // Success — issue token
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, {
      expiresIn: "7d",
    });
    return res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//**********Update User**********
export const updateUserData = async (req, res) => {
  try {
    // Get the user.id
    const userId = req.params.id;

    if (!userId)
      return res.status(400).json({ message: "Missing id in params" });
    // Read the data
    const users = await readJSON("users.json");
    // Check if user exists
    const idx = users.findIndex((u) => String(u.id) === String(userId));
    if (idx === -1) return res.status(404).json({ message: "User not found" });

    // Get fields (from user -body-) and update fields
    const { name, email, password } = req.body || {};
    if (email) users[idx].email = String(email).toLowerCase().trim();
    if (name !== undefined) users[idx].name = name;
    // Hash password
    if (password) {
      const hash = await bcrypt.hash(password, SECRET);
      users[idx].password = hash;
    }

    // Write (update) fields
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

//**********Delete User*********
export const deleteUser = async (req, res) => {
  try {
    // Get the user.id
    const userId = req.params.id;
    if (!userId)
      return res.status(400).json({ message: "Missing id in params" });

    // Read users
    const users = await readJSON("users.json");
    // Check if user exists
    const idx = users.findIndex((u) => String(u.id) === String(userId));
    if (idx === -1) return res.status(404).json({ message: "User not found" });

    // Extract and re-write (erase) user/s
    const [removed] = users.splice(idx, 1);
    await writeJSON("users.json", users);
    return res.json({ message: "User deleted", id: removed.id });
  } catch (err) {
    console.error("deleteUser error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
