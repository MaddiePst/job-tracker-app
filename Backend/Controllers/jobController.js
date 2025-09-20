import { v4 as uuidv4 } from "uuid";
import { readJSON, writeJSON } from "./reusableFunc.js";
// import data from "../Data/myJobs.json" with {type: 'json'};

/// Read data
const rawData = await readJSON("myJobs.json"); // returns { jobs: [...] }
const jobs = rawData.jobs || [];
// console.log(jobs);

// ******Create (POST) job*******
export const addNewJob = async (req, res) => {
  try {
    const {
      company,
      title,
      location,
      status = "Applied",
      date_applied = new Date().toISOString(),
      link,
      notes = "",
    } = req.body;

    // Checking for all fields required to be completed
    if (!company || !title || !location) {
      return res
        .status(400)
        .json({ message: "company, title, and location are required" });
    }

    const job = {
      id: uuidv4(),
      company,
      title,
      location,
      status,
      date_applied,
      link,
      notes,
    };

    // Add new job to the array
    jobs.push(job);

    // Write back to the same structure
    await writeJSON("myJobs.json", { jobs });

    return res.status(201).json(job);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

//**********Read (GET) job**********
// Get all jobs
export const getAllJobs = async (req, res) => {
  try {
    // Filter jobs by authenticated user if needed
    const myJobs = jobs.filter((j) => j.userId === req.user.id);

    return res.json(myJobs);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Filter jobs data
export const filteredData = async (req, res) => {
  // allJobs not defines=d
  let filteredData = jobs;
  console.log("Query: ", req.query);
  const { title, company, location, status } = req.query;
  console.log("Filtering data");

  // filter with query param
  if (title) {
    filteredData = filteredData.filter(
      (job) => job.title.toLowerCase() === title.toLowerCase()
    );
  }

  if (company) {
    filteredData = filteredData.filter(
      (job) => job.company.toLowerCase() === company.toLowerCase()
    );
  }
  if (location) {
    filteredData = filteredData.filter(
      (job) => job.location.toLowerCase() === location.toLowerCase()
    );
  }
  if (status) {
    filteredData = filteredData.filter(
      (job) => job.status.toLowerCase() === status.toLowerCase()
    );
  }
  res.json(filteredData);
};

//******Update job data*******
export const updateJobData = async (req, res) => {
  try {
    const jobId = req.params.id;
    if (!jobId)
      return res.status(400).json({ message: "Missing id in params" });

    const idx = jobs.findIndex((j) => String(j.id) === String(jobId));
    if (idx === -1) return res.status(404).json({ message: "Job not found" });

    // Update allowed fields
    const allowedFields = [
      "company",
      "title",
      "location",
      "status",
      "date_applied",
      "link",
      "notes",
    ];
    const updates = req.body;
    let updated = false;

    allowedFields.forEach((field) => {
      if (updates[field] !== undefined) {
        jobs[idx][field] = updates[field];
        updated = true;
      }
    });

    if (!updated)
      return res.status(400).json({ message: "No valid fields to update" });

    await writeJSON("myJobs.json", { jobs });

    return res.json({ message: "Job updated", job: jobs[idx] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// **********Delete job*******
export const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    if (!jobId)
      return res.status(400).json({ message: "Missing id in params" });

    const idx = jobs.findIndex((j) => String(j.id) === String(jobId));
    if (idx === -1) return res.status(404).json({ message: "Job not found" });

    jobs.splice(idx, 1);

    await writeJSON("myJobs.json", { jobs });

    return res.json({ message: "Job deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
