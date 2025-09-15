import users from "../users.json" with { type: "json" };
import jwt from "jsonwebtoken";
import {readJSON, writeJSON} from "./reusableFunc.js"
import users from '../users.json'

// let users = [];

// Create (POST) user
export const createNewUser = async (req, res) => {
  const user = req.body;
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'All fields required!' });
  }

  const users = readJSON('users', []);
  if (users.find(el => el.email === email)) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const newUser = { id: generateId(), email, password: hashed, name: name || '' };
  users.push(newUser);
  writeJSON('users', users);

  const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '7d' });

  res.json({ token, user: { id: newUser.id, email: newUser.email, name: newUser.name } });

  return res.status(201).json({message: 'User created'});
};

//Read (GET) user/LogIn
export const logInUser = async (req, res) => {
  console.log('LodIn Funct: ',req.body);
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

   const users = readJSON('users', []);
  const user = users.find(el => el.email === email);
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  return  res.status(201).json({message: 'User logged in!'})
};


// ?????????????????????? Is the following code still correct?? (update user data n delete user data)
//Update user data
export const updateUserData = async (req, res) => {
  const id = req.params.id;
  users[id] = req.body;
  return res.status(201).json({message: 'User update'});
};
// Delete user
export const deleteUser = async (req, res) => {
  const id = req.params.id;
  users.splice(id, 1);
  res.send(`User ${id} deleted`);
};
