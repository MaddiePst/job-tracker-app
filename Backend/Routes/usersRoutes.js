import express from "express";
import {
  createNewUser,
  deleteUser,
  logInUser,
  profileUser,
  updateUserData,
} from "../Controllers/userController.js";
import { authMiddleware } from "../Middleware/middlewareUser.js";

const router = express.Router();

//Create new user
router.post("/createUser", createNewUser);
//Log in user
router.get("/logIn", logInUser);
// Update User Data
router.put("/updateUser/:id", authMiddleware, updateUserData);
// Delete User
router.delete("/deleteUser/:id", deleteUser);
//Get my profile
router.get("/profileUser", authMiddleware, profileUser);
export default router;
