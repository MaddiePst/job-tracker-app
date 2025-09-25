import express from "express";
import {
  createNewUser,
  deleteUser,
  logInUser,
  updateUserData,
} from "../Controllers/userController.js";
import { authMiddleware } from "../Middleware/middlewareUser.js";

const router = express.Router();

//Create new user
router.post("/createUser", createNewUser);
//Log in user
router.post("/logIn", logInUser);
// router.get("/logIn", logInUser);
router.get("/dashboard", logInUser);
// Update User Data
router.put("/updateUser/:id", authMiddleware, updateUserData);
// Delete User
router.delete("/deleteUser/:id", deleteUser);
export default router;
