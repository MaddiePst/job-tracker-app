import express from "express";
import {
  filteredData,
  getAllJobs,
  createNewJob,
  updateJobData,
  deleteJob,
} from "../Controllers/jobController.js";

const router = express.Router();
// Create new job
router.post("/allJobs", createNewJob);
// Get all jobs
router.get("/allJobs", getAllJobs);
// Get jobs filtered
router.get("/allJobs", filteredData);
// Update jobs data
router.put("/allJobs/:id", updateJobData);
// Delete job
router.delete("/allJobs/:id", deleteJob);

export default router;
