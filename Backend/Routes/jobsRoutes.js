import express from "express";
import {
  filteredData,
  getAllJobs,
  addNewJob,
  updateJobData,
  deleteJob,
} from "../Controllers/jobController.js";
import { authMiddleware } from "../Middleware/middlewareUser.js";

// ??????????? Do I need authentification??????????? to all the routes

const router = express.Router();
// Create new job
router.post("/allJobs", addNewJob);
// Get all jobs
router.get("/allJobs", authMiddleware, getAllJobs);
// Get jobs filtered
router.get("/allJobs", filteredData);
// Update jobs data
router.put("/allJobs/:id", authMiddleware, updateJobData);
// Delete job
router.delete("/allJobs/:id", deleteJob);

export default router;
