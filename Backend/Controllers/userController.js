import users from "../users.json";
import jwt from "jsonwebtoken";
// const usersData = require("../users.json");
// import usersData from "../users.json";
// assert { type: "json" };

// let users = [];

// Create (POST) user
export const createNewUser = (req, res) => {
  const user = req.body;
  users.push(user);
  res.status(201).json(user);
};

//Read (GET) user/LogIn
export const logInUser = (req, res) => {
  console.log(req.body);
};

//Update user data
export const updateUserData = (req, res) => {
  const id = req.params.id;
  users[id] = req.body;
  res.json(users[id]);
};
// Delete user
export const deleteUser = (req, res) => {
  const id = req.params.id;
  users.splice(id, 1);
  res.send(`User ${id} deleted`);
};
