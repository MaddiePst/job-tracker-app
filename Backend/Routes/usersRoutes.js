import express from "express";
import {
  createNewUser,
  deleteUser,
  logInUser,
  updateUserData,
} from "../Controllers/userController.js";

const router = express.Router();

//Create new user
router.post("/createUser", createNewUser);
//Log in user
router.get("/logIn", logInUser);
// Update User Data
router.put("/updateUser/:id", updateUserData);
// Delete User
router.delete("/updateUser/:id", deleteUser);

export default router;
